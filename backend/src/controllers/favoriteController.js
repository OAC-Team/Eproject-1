const Favorite = require('../models/Favorite');
const Painting = require('../models/Painting');

exports.addFavorite = async (req, res) => {
  try {
    const { paintingId } = req.body;
    const userId = req.user._id;

    const exist = await Favorite.findOne({ userId, paintingId });
    if (exist) {
      return res.status(400).json({ success: false, message: 'Already in favorite' });
    }

    const favorite = await Favorite.create({ userId, paintingId });

    await Painting.findByIdAndUpdate(paintingId, { $inc: { likesCount: 1 } });

    res.status(201).json({ success: true, message: 'Added to favorite', data: favorite });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.removeFavorite = async (req, res) => {
  try {
    const { paintingId } = req.params;
    const userId = req.user._id;

    const result = await Favorite.findOneAndDelete({ userId, paintingId });
    if (!result) {
      return res.status(404).json({ success: false, message: 'Favorite not found' });
    }

    await Painting.findByIdAndUpdate(paintingId, { $inc: { likesCount: -1 } });

    res.json({ success: true, message: 'Removed from favorites' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getFavorites = async (req, res) => {
  try {
    const userId = req.user._id;
    const sortBy = req.query.sortBy || 'createdAt';
    const order = req.query.order || 'desc';
    const groupBy = req.query.groupBy || null;

    let favorites = await Favorite.find({ userId })
      .populate({
        path: 'paintingId',
        populate: [
          { path: 'artistId', select: 'artistName' },
          { path: 'categoryId', select: 'categoryName' }
        ]
      })
      .lean();

    favorites = favorites.filter(f => f.paintingId);

    // Sắp xếp
    if (sortBy === 'artist') {
      favorites.sort((a, b) => {
        const artistA = a.paintingId?.artistId?.artistName || '';
        const artistB = b.paintingId?.artistId?.artistName || '';
        return order === 'desc'
          ? artistB.localeCompare(artistA)
          : artistA.localeCompare(artistB);
      });
    } else {
      favorites.sort((a, b) => {
        return order === 'desc'
          ? new Date(b.createdAt) - new Date(a.createdAt)
          : new Date(a.createdAt) - new Date(b.createdAt);
      });
    }

    let result = favorites;
    if (groupBy === 'category') {
      result = favorites.reduce((groups, fav) => {
        const key = fav.paintingId?.categoryId?.categoryName || 'Uncategorized';
        if (!groups[key]) groups[key] = [];
        groups[key].push(fav);
        return groups;
      }, {});
    } else if (groupBy === 'artist') {
      result = favorites.reduce((groups, fav) => {
        const key = fav.paintingId?.artistId?.artistName || 'Unknown Artist';
        if (!groups[key]) groups[key] = [];
        groups[key].push(fav);
        return groups;
      }, {});
    }

    res.json({ success: true, total: favorites.length, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.checkFavorite = async (req, res) => {
  try {
    const { paintingId } = req.params;
    const userId = req.user._id;

    const favorite = await Favorite.findOne({ userId, paintingId });
    res.json({ success: true, isFavorite: !!favorite });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
