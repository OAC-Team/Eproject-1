const express = require('express');
const { getUserProfile, addUserCollection } = require('../controllers/userController');
const { auth } = require('../middlewares/auth')

const routes = express.Router()

routes.get('/profile', auth, getUserProfile)
routes.post('/collections', auth, addUserCollection)

module.exports = routes