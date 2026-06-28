const express = require('express');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const routes = express.Router();

routes.use('/auth', authRoutes);
routes.use('/user', userRoutes);

module.exports = routes;
