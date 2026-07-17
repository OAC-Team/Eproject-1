const express = require('express');
const path = require('path');
const { auth } = require('../middlewares/auth')
const chatController = require('../controllers/chatController');

const routes = express.Router()

// routes.post('/chat', auth);

module.exports = routes