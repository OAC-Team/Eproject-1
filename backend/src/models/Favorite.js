// backend/src/models/Favorite.js

const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  paintingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Painting',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Mỗi user chỉ favorite 1 painting 1 lần
favoriteSchema.index({ userId: 1, paintingId: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);