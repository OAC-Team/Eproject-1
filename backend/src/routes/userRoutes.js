const express = require('express');
const path = require('path');
const { 
    getUserProfile, 
    addUserCollection, 
    getUserProfilePicture, 
    getUserCollection, 
    likePicture, 
    savePaintingToCollection, 
    updateUser,
    updateUserCollection,
    deleteUserCollection
} = require('../controllers/userController');
const { getAllPaintings, getPainting, deletePainting } = require('../controllers/paintingController')
const { auth } = require('../middlewares/auth')
const uploadRoutes = require('../routes/uploadRoutes');

const routes = express.Router()

// Get
routes.get('/profile', auth, getUserProfile)
routes.get('/profile_picture', auth, getUserProfilePicture)
routes.get('/gallery', getAllPaintings)
routes.get('/gallery/:painting_id', getPainting)
routes.get('/collections/:collection_id', auth, getUserCollection)

// Post
routes.post('/profile', auth, updateUser)
routes.post('/collections', auth, addUserCollection)
routes.post('/like/:painting_id', auth, likePicture)
routes.post('/collections/add', auth, savePaintingToCollection)

// Put
routes.put('/collections/:collection_id', auth, updateUserCollection)

// Delete
routes.delete('/gallery/:painting_id', auth, deletePainting)
routes.delete('/collections/:collection_id', auth, deleteUserCollection)

// Use
routes.use('/upload', auth, uploadRoutes);
routes.use('/uploads', express.static(path.join(__dirname, '../uploads')));

module.exports = routes