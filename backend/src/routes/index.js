const express = require('express');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const boardRoutes = require('./boardRoutes')
const routes = express.Router();

routes.use('/auth', authRoutes);
routes.use('/user', userRoutes);
routes.use('/boards', boardRoutes);  


module.exports = routes;
