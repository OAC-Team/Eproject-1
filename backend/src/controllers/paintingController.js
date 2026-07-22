const Painting = require('../models/painting');
const User = require('../models/user');
const { Vibrant } = require('node-vibrant/node');
const namer = require('color-namer');
const userService = require('../services/userService');
const { v2: cloudinary } = require('cloudinary')
const UserLog = require('../models/userLog');

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

        const newPainting = new Painting({
            user_id: req.user.user_id,
            title: req.body.title || 'Untitled',
            artist: req.body.artist || req.user.username || 'Unknown Artist',
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
        return res.status(500).json({ message: 'Error saving painting', error: error.message });
    }
}

async function getAllPaintings(req, res) {
    try {
        const paintings = await Painting.find({status: 'approved'}).sort({ created_at: -1 });
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

        await UserLog.create({
            userId: userId,
            category: 'PAINTING',
            action: 'upload_painting',
            description: `Uploaded new painting ${title}`
        });

        return res.status(201).json({
            message: 'Saved work successfully!',
            painting: savedPainting
        });

    } catch (error) {
        console.error("Error in savePainting:", error);
        return res.status(500).json({ message: error.message });
    }
}

module.exports = { createPainting, getAllPaintings, getPainting, savePainting}