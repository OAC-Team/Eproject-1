const express = require('express');
const path = require('path');
const { auth } = require('../middlewares/auth')
const {chat} = require('../controllers/chatController');

const routes = express.Router()

routes.post('/chat', auth, chat);

module.exports = routes