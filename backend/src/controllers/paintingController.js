const Painting = require('../models/painting');
const User = require('../models/user');
const { Vibrant } = require('node-vibrant/node');
const namer = require('color-namer');
const userService = require('../services/userService');
const { ImageAnalyzer, ImageInfoGenerator } = require('../services/aiService');
const cloudinary = require('cloudinary');
const axios = require('axios');

function hexToWord(hexCode) {
    try {
        if (!hexCode) return 'Unknown Color';

        const hex = hexCode.startsWith('#') ? hexCode : `#${hexCode}`;

        const results = namer(hex);

        if (results) {
            if (results.ntc && results.ntc[0]) return results.ntc[0].name;
            if (results.basic && results.basic[0]) return results.basic[0].name;
            if (results.html && results.html[0]) return results.html[0].name;
        }

        return 'Unknown Color';
    } catch (error) {
        console.error(`color-namer failed for hex [${hexCode}]:`, error.message);
        return 'Unknown Color';
    }
}

async function addPaintingToUser(user_id, painting_id) {
    return await User.findByIdAndUpdate(
        user_id,
        { $push: { uploaded_paintings: painting_id } },
        { new: true }
    );
}

const addPaintingTags = async (req, res) => {
    try {
        const { id } = req.params;
        const { tagsString } = req.body;

        if (!tagsString || tagsString.trim() === "") {
            return res.status(400).json({ message: "Please provide tags to this painting." });
        }

        const painting = await Painting.findById(id);
        if (!painting) {
            return res.status(404).json({ message: "Painting not found." });
        }

        const rawTagsArray = tagsString.split(',');

        rawTagsArray.forEach(tag => {
            const cleanTag = tag.replace(/#/g, '').replace(/\s+/g, '').toLowerCase();

            if (cleanTag && !painting.tags.includes(cleanTag)) {
                painting.tags.push(cleanTag);
            }
        });

        await painting.save();
        res.status(200).json({ message: "Tags saved to painting.", tags: painting.tags });
    } catch (error) {
        res.status(500).json({ message: "Server errored processing tags", error: error.message });
    }
};

async function analyzeImage(req, res) {
    try {
        console.log("Signal Reached To Analyze Image");
        if (!req.file) return res.status(400).json({ message: 'No image provided.' });

        const fileUrl = req.file.path;
        const imageResponse = await axios.get(fileUrl, { responseType: 'arraybuffer' });
        const base64Image = Buffer.from(imageResponse.data, 'binary').toString('base64');
        const mimeType = req.file.mimetype || 'image/jpeg';
        const dataUrl = `data:${mimeType};base64,${base64Image}`;

        const analyzer = new ImageAnalyzer();
        await analyzer.analyzeImage(dataUrl);

        return res.status(200).json({
            title: analyzer.getTitle(),
            description: analyzer.getCaption(),
            tags: analyzer.getTags()?.join(', '),
            surface_type: analyzer.getSurfaceType(),
            color_medium: analyzer.getColorMedium(),
            artistic_style: analyzer.getArtStyle(),
        });
    } catch (error) {
        console.error("Analyze error:", error);
        return res.status(500).json({ message: 'Analysis failed.', error: error.message });
    }
}

async function createPainting(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'You must choose a valid file to upload.' });
        }

        const fileUrl = req.file.path;
        const palette = await Vibrant.from(fileUrl).getPalette();
        const cloudinaryId = req.file ? req.file.filename : req.body.cloudinary_id;

        const hexColors = Object.values(palette).map(swatch => swatch?.hex).filter(Boolean);

        const colorWords = hexColors.map(hex => ({
            hex: hex,
            name: hexToWord(hex)
        }))

        console.log(fileUrl)

        const newPainting = new Painting({
            user_id: req.user.user_id,
            title: req.body.title || 'Untitled',
            artist: req.user.username || 'Unknown Artist',
            image_url: fileUrl,
            cloudinary_id: cloudinaryId,
            description: req.body.description || '',
            surface_type: req.body.surface_type || 'Digital',
            color_medium: req.body.color_medium || 'Pixels',
            artistic_style: req.body.artistic_style || 'Freestyle',
            tags: req.body.tags ? req.body.tags.split(',') : [],
            colors: colorWords
        });

        await newPainting.save();
        await addPaintingToUser(req.user.user_id, newPainting._id);

        return res.status(200).json({
            message: 'Successfully upload and save to database.',
            url: fileUrl,
            painting: newPainting
        });
    } catch (error) {
        console.error("createPainting error:", error); // Server terminal debugf 
        return res.status(500).json({ message: 'Error saving painting', error: error.message });
    }
}

async function getAllPaintings(req, res) {
    try {
        const { search, medium, surface, style } = req.query;

        let queryCondition = { status: 'approved' };

        if (surface && surface.trim() !== '') {
            queryCondition.surface_type = { $regex: `^${surface.trim()}$`, $options: 'i' };
        }
        if (medium && medium.trim() !== '') {
            queryCondition.color_medium = { $regex: `^${medium.trim()}$`, $options: 'i' };
        }
        if (style && style.trim() !== '') {
            queryCondition.artistic_style = { $regex: `^${style.trim()}$`, $options: 'i' };
        }

        if (search && search.trim() !== '') {
            const sanitizedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

            queryCondition.$or = [
                { title: { $regex: sanitizedSearch, $options: 'i' } },
                { tags: { $regex: sanitizedSearch, $options: 'i' } },
                { artist: { $regex: sanitizedSearch, $options: 'i' } },
            ];
        }

        const paintings = await Painting.find(queryCondition).sort({ created_at: -1 }).lean();
        return res.status(200).json({ paintings: paintings })
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching paintings', error: error.message });
    }
}

async function getPainting(req, res) {
    try {
        const painting_id = req.params.painting_id;
        const painting = await Painting.findOne({ _id: painting_id });
        const uploader = await userService.getUserBasicData(painting.user_id);
        res.status(200).json({ painting: painting, uploader: uploader });
        return;
    } catch (error) {
        res.status(500).json({ message: 'Error fetching painting', error: error.message });
        return;
    }
}

const deletePainting = async (req, res) => {
    try {
        const { painting_id } = req.params;

        const userId = req.user?.user_id || req.user?._id || req.user?.id;

        const painting = await Painting.findById(painting_id);
        if (!painting) {
            return res.status(404).json({ error: "Painting not found." });
        }

        const creatorId = painting.uploader || painting.user_id || painting.userId;

        if (!creatorId || (creatorId.toString() !== userId?.toString() && req.user?.role !== 'admin')) {
            return res.status(403).json({ error: "You can't delete someone else's art." });
        }

        await User.updateMany(
            {
                $or: [
                    { uploaded_paintings: painting_id },
                    { favorites: painting_id },
                    { "collections.paintings": painting_id }
                ]
            },
            {
                $pull: {
                    uploaded_paintings: painting_id,
                    favorites: painting_id,
                    "collections.$[].paintings": painting_id
                }
            }
        );

        await Painting.findByIdAndDelete(painting_id);

        res.json({ message: "Painting removed from database successfully." });
    } catch (err) {
        console.error("Delete Painting Error:", err);
        res.status(500).json({ error: "Failed to delete painting." });
    }
};

async function savePainting(req, res) {
    try {

        const { title, description, artist, image_url, tags, surface_type, color_medium, artistic_style } = req.body;

        const userId = req.user.user_id;

        if (!image_url) {
            return res.status(400).json({ message: 'Missing image path (image_url)!' });
        }

        let colorWords = [];
        try {
            const palette = await Vibrant.from(image_url).getPalette();
            const hexColors = Object.values(palette).map(swatch => swatch?.hex).filter(Boolean);

            colorWords = hexColors.map(hex => ({
                hex: hex,
                name: hexToWord(hex)
            }));
        } catch (vibrantError) {
            console.error("Error parsing color palette from URL:", vibrantError.message);
        }

        const cloudinaryId = req.file ? req.file.filename : req.body.cloudinary_id;

        const newPainting = new Painting({
            user_id: userId,
            title: title || 'Untitled',
            artist: artist || req.user.username || 'Unknown Artist',
            image_url: image_url,
            cloudinary_id: cloudinaryId,
            description: description || '',
            surface_type: surface_type || 'Digital',
            color_medium: color_medium || 'Pixels',
            artistic_style: artistic_style || 'Freestyle',
            tags: Array.isArray(tags) ? tags : (tags ? tags.split(',') : []),
            colors: colorWords
        });

        const savedPainting = await newPainting.save();

        await addPaintingToUser(userId, savedPainting._id);

        return res.status(201).json({
            message: 'Saved work successfully!',
            painting: savedPainting
        });

    } catch (error) {
        console.error("Error in savePainting:", error);
        return res.status(500).json({ message: error.message });
    }
}

module.exports = { createPainting, getAllPaintings, getPainting, savePainting, deletePainting, analyzeImage }
