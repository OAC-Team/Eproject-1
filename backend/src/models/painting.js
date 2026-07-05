const mongoose = require('mongoose');

const paintingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },

  title: { type: String, required: true },
  artist: { type: String, required: true },
  imageUrl: { type: String, required: true },
  description: { type: String },

  surfaceType: { type: String },
  colorMedium: { type: String },
  artisticStyle: { type: String },

  favoritesCount: { type: Number, default: 0 },
  tags: [{ type: String }],

  artistId: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist' },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },

  createdAt: { type: Date, default: Date.now }
});

// Tránh OverwriteModelError
module.exports = mongoose.models.Painting || mongoose.model("Painting", paintingSchema);
