const express = require('express');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const uploadRoutes = require('./uploadRoutes');
const boardRoutes = require('./boardRoutes')
const adminRoutes = require('./adminRoutes');
const chatRoutes = require('./chatRoutes');
const contactRoutes = require('./contactRoutes');
const path = require('path')
const routes = express.Router();

routes.use('/auth', authRoutes);
routes.use('/user', userRoutes);
routes.use('/upload', uploadRoutes);
routes.use('/upload', express.static(path.join(__dirname, '../uploads')));
routes.use('/boards', boardRoutes);  
routes.use('/admin', adminRoutes);
routes.use('/assistant', chatRoutes);
routes.use('/contact', contactRoutes);

module.exports = routes;
