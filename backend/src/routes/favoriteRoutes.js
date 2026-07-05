const express = require('express');
const router = express.Router();

const { auth } = require('../middlewares/auth');
const {
  addFavorite,
  removeFavorite,
  getFavorites,
  checkFavorite
} = require('../controllers/favoriteController');

// Dùng middleware auth
router.use(auth);

router.get('/', getFavorites);
router.get('/check/:paintingId', checkFavorite);
router.post('/', addFavorite);
router.delete('/:paintingId', removeFavorite);

module.exports = router;
