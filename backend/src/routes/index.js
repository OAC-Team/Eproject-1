const express = require('express');
const authRoutes = require('./authRoutes');
const routes = express.Router();

routes.use('/auth', authRoutes);

module.exports = routes;
