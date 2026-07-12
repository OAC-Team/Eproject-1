require('dotenv').config();
const User = require('../models/user');
const Painting = require('../models/painting')
const jwt = require('jsonwebtoken');
const { errorHandler } = require('../middlewares/errorHandler');

async function getPendingPaintings(req, res) {
    try {
        const pendingPainting = await Painting.find({ status: 'pending' }).sort({ create_at: -1 })
        res.status(200).json(pendingPainting)
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching pending paintings', error: error.message });
    }
}

async function statusHandlePainting(req, res) {
    try {
        const { painting_id } = req.params
        const { status } = req.body
        const updateStatePainting = await Painting.findByIdAndUpdate(
            painting_id,
            {
                status: status,
            },
            {
                new: true
            }
        )
        if (!painting_id) {
            res.status(404).json({ message: 'Picture not found' })
        }

        res.status(200).json({ paintings: updateStatePainting })
    } catch (error) {
        return res.status(500).json({ message: 'Error approved paintings', error: error.message });
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

module.exports = { getPendingPaintings, statusHandlePainting, getAllPaintings};