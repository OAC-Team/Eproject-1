const Painting = require('../models/painting');
const User = require('../models/user');
const { Vibrant } = require('node-vibrant/node');
const namer = require('color-namer');
const userService = require('../services/userService');
const { ImageAnalyzer, ImageInfoGenerator } = require('../services/aiService');
const fs = require('fs');
const path = require('path');

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

async function createPainting(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'You must choose a valid file to upload.' });
        }

        const localFilePath = req.file.path;
        const fileUrl = `/api/upload/${req.file.filename}`;

        const fileBuffer = fs.readFileSync(localFilePath);
        const base64Image = fileBuffer.toString('base64');
        const mimeType = req.file.mimetype || 'image/jpeg';
        const dataUrl = `data:${mimeType};base64,${base64Image}`;

        // 2. Run Vibrant color palette extraction
        const palette = await Vibrant.from(localFilePath).getPalette();
        const hexColors = Object.values(palette).map(swatch => swatch?.hex).filter(Boolean);
        const colorWords = hexColors.map(hex => ({
            hex: hex,
            name: hexToWord(hex)
        }));

        const analyzer = new ImageAnalyzer();
        await analyzer.analyzeImage(dataUrl);

        const _title = analyzer.getTitle();
        const _caption = analyzer.getCaption();
        const _tags = analyzer.getTags();
        const _surface_type = analyzer.getSurfaceType();
        const _color_medium = analyzer.getColorMedium();
        const _art_style = analyzer.getArtStyle();

        const finalTitle = req.body.title?.trim() || _title || 'Untitled';
        const finalDescription = req.body.description?.trim() || _caption || '';
        const finalSurfaceType = req.body.surface_type || _surface_type || 'Digital';
        const finalColorMedium = req.body.color_medium || _color_medium || 'Pixels';
        const finalArtStyle = req.body.artistic_style || _art_style || 'Freestyle'

        let finalTags = [];
        if (req.body.tags && req.body.tags.trim() !== '') {
            finalTags = req.body.tags.split(',').map(tag => tag.trim());
        } else if (Array.isArray(_tags) && _tags.length > 0) {
            finalTags = _tags;
        }

        // const richSummary = await ImageInfoGenerator.generateArtworkSummary(finalTitle, finalTags, finalDescription);

        const newPainting = new Painting({
            user_id: req.user.user_id,
            title: finalTitle,
            artist: req.user.username || 'Unknown Artist',
            image_url: fileUrl,
            description: finalDescription,
            surface_type: finalSurfaceType,
            color_medium: finalColorMedium,
            artistic_style: finalArtStyle,
            tags: finalTags,
            colors: colorWords
        });

        await newPainting.save();
        await addPaintingToUser(req.user.user_id, newPainting._id);

        return res.status(200).json({
            message: 'Successfully uploaded and saved to database.',
            url: fileUrl,
            painting: newPainting
        });

    } catch (error) {
        console.error("Upload Error:", error);
        return res.status(500).json({ message: 'Error saving painting', error: error.message });
    }
}

async function getAllPaintings(req, res) {
    try {
        const { search } = req.query;

        let queryCondition = {};

        if (search && search.trim() !== '') {
            queryCondition = {
                $or: [
                    { title: { $regex: search, $options: 'i' } },
                    { tags: { $regex: search, $options: 'i' } },
                    { artist: { $regex: search, $options: 'i' } },
                ]
            }
        }

        const paintings = await Painting.find(queryCondition).sort({ created_at: -1 });
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

module.exports = { createPainting, getAllPaintings, getPainting, deletePainting }