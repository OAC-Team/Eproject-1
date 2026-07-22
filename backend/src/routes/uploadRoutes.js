const express = require('express');
const multer = require('multer');
const { auth } = require('../middlewares/auth');
const { createPainting, analyzeImage, uploadProfilePicture } = require('../controllers/paintingController');
const upload = require('../storage')
const routes = express.Router();

routes.post('/', auth, upload.single('image'), createPainting);
routes.post('/analyze', auth, upload.single('image'), analyzeImage);
routes.post('/settings/upload-profile-picture', auth, upload.single('image'), uploadProfilePicture)

module.exports = routes;