const express = require('express');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const uploadRoutes = require('./uploadRoutes');
const favoriteRoutes = require('./favoriteRoutes');
const boardRoutes = require('./boardRoutes');
const path = require('path');

const routes = express.Router();

routes.use('/auth', authRoutes);
routes.use('/user', userRoutes);
routes.use('/upload', uploadRoutes);
routes.use('/upload', express.static(path.join(__dirname, '../uploads')));
routes.use('/favorites', favoriteRoutes);
routes.use('/boards', boardRoutes);

// Health check
routes.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Server is running'
  });
});

module.exports = routes;
