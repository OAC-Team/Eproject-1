const Painting = require('../models/painting');

async function createPainting(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({message: 'You must choose a valid file to upload.'});
        }

        const fileUrl = `/api/upload/${req.file.filename}`;

        const newPainting = new Painting({
            user_id: req.user.user_id,
            title: req.body.title || 'Untitled',
            artist: req.user.username || 'Unknown Artist',
            image_url: fileUrl,
            description: req.body.description || '',
            surface_type: req.body.surface_type || 'Digital',
            color_medium: req.body.color_medium || 'Pixels',
            artistic_style: req.body.artistic_style || 'Freestyle',
            tags: req.body.tags ? req.body.tags.split(',') : []
        });

        await newPainting.save();

        return res.status(200).json({
            message: 'Successfully upload and save to database.',
            url: fileUrl,
            painting: newPainting
        });
    } catch (error) {
        return res.status(500).json({message: 'Error saving painting', error: error.message});
    }
}

async function getAllPaintings(req, res) {
    try {
        const paintings = await Painting.find().sort({ created_at: -1 });
        return res.status(200).json({ paintings: paintings })
    } catch (error) {
        return res.status(500).json({message: 'Error fetching paintings', error: error.message});
    }
}

async function getPainting(req, res) {
    try {
        const painting_id = req.params.painting_id;
        const painting = await Painting.findOne({_id: painting_id});
        res.status(200).json({ painting: painting });
        return;
    } catch (error) {
        res.status(500).json({message: 'Error fetching painting', error: error.message});
        return;
    }
}

module.exports = {createPainting, getAllPaintings, getPainting}