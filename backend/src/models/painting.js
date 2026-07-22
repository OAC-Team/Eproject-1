<<<<<<< HEAD
const mongoose = require('mongoose');

const paintingSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, required: true },

    title: { type: String, required: true },
    artist: { type: String, required: true },
    image_url: { type: String, required: true },
    description: { type: String },

    surface_type: { type: String },
    color_medium: { type: String },
    artistic_style: { type: String },

    favorites_count: { type: Number, default: 0 },
    tags: [{ type: String }],

    created_at: { type: Date, default: Date.now }
});

const Painting = mongoose.model("Painting", paintingSchema);
module.exports = Painting;
=======
const mongoose = require('mongoose');

const paintingSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, required: true },

    title: { type: String, required: true },
    artist: { type: String, required: true },
    image_url: { type: String, required: true },
    cloudinary_id: { type: String, required: true },
    description: { type: String },

    surface_type: { type: String, index: true },
    color_medium: { type: String, index: true },
    artistic_style: { type: String, index: true },
    
    colors: [{
        hex: { type: String, required: true },
        name: { type: String, required: true }
    }],

    favorites_count: { type: Number, default: 0 },
    tags: [{ type: String, trim: true }],

    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    reject_reason: { type: String, default: '' },

    created_at: { type: Date, default: Date.now }
});

const Painting = mongoose.model("Painting", paintingSchema);
module.exports = Painting;
>>>>>>> origin/main
