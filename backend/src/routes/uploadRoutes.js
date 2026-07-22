const express = require('express');
const multer = require('multer');
const { auth } = require('../middlewares/auth');
const { createPainting, analyzeImage } = require('../controllers/paintingController');
const upload = require('../storage')
const routes = express.Router();

routes.post('/', auth, upload.single('image'), createPainting);
routes.post('/analyze', auth, upload.single('image'), analyzeImage)

module.exports = routes;