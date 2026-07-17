const express = require('express');
const multer = require('multer');
const { auth } = require('../middlewares/auth');
const { createPainting } = require('../controllers/paintingController');
const upload = require('../storage')
const routes = express.Router();

routes.post('/', auth, upload.single('image'), createPainting);

module.exports = routes;