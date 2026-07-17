const express = require('express');
const path = require('path');
const { getUserProfile, addUserCollection, getUserProfilePicture, likePicture, savePaintingToCollection } = require('../controllers/userController');
const { getAllPaintings, getPainting, savePainting } = require('../controllers/paintingController')
const { auth } = require('../middlewares/auth')
const uploadRoutes = require('../routes/uploadRoutes');

const routes = express.Router()

// Get
routes.get('/profile', auth, getUserProfile)
routes.get('/profile_picture', auth, getUserProfilePicture)
routes.get('/gallery', getAllPaintings)
routes.get('/gallery/:painting_id', getPainting)

// Post
routes.post('/collections', auth, addUserCollection)
routes.post('/like/:painting_id', auth, likePicture)
routes.post('/add', auth, savePainting)

// Use
routes.use('/upload', auth, uploadRoutes);
routes.use('/uploads', express.static(path.join(__dirname, '../uploads')));

module.exports = routes