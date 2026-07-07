const Painting = require('../models/painting');
const User = require('../models/user');
const { Vibrant } = require('node-vibrant/node');
const namer = require('color-namer');
const userService = require('../services/userService');

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

        const localFilePath = req.file.path;
        const fileUrl = `/api/upload/${req.file.filename}`;
        const palette = await Vibrant.from(localFilePath).getPalette();

        const hexColors = Object.values(palette).map(swatch => swatch?.hex).filter(Boolean);

        const colorWords = hexColors.map(hex => ({
            hex: hex,
            name: hexToWord(hex)
        }))

        const newPainting = new Painting({
            user_id: req.user.user_id,
            title: req.body.title || 'Untitled',
            artist: req.user.username || 'Unknown Artist',
            image_url: fileUrl,
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
        const paintings = await Painting.find().sort({ created_at: -1 });
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

module.exports = { createPainting, getAllPaintings, getPainting }