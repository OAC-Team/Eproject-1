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

async function getApprovePaintings(req, res) {
    try {
        const pendingPainting = await Painting.find({ status: 'approved' }).sort({ create_at: -1 })
        res.status(200).json(pendingPainting)
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching approved paintings', error: error.message });
    }
}

async function getRejectPaintings(req, res) {
    try {
        const pendingPainting = await Painting.find({ status: 'rejected' }).sort({ create_at: -1 })
        res.status(200).json(pendingPainting)
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching rejected paintings', error: error.message });
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

async function deletePainting (req, res) {
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

        if (painting.cloudinary_id) {
            const cloudinaryResponse = await cloudinary.uploader.destroy(painting.cloudinary_id)
            console.log('Cloudinary delete result:', cloudinaryResponse);
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

async function getAllPaintings(req, res) {
    try {
        const paintings = await Painting.find().sort({ created_at: -1 });
        return res.status(200).json({ paintings: paintings })
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching paintings', error: error.message });
    }
}

module.exports = { getPendingPaintings, statusHandlePainting, getAllPaintings, getApprovePaintings, getRejectPaintings, deletePainting };