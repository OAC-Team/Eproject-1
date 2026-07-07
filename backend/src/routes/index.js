<<<<<<< HEAD
const express = require('express');
const authRoutes = require('./authRoutes');
const routes = express.Router();

routes.use('/auth', authRoutes);

module.exports = routes;
=======
const express = require('express');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const uploadRoutes = require('./uploadRoutes');
const boardRoutes = require('./boardRoutes')
const path = require('path')
const routes = express.Router();

routes.use('/auth', authRoutes);
routes.use('/user', userRoutes);
routes.use('/upload', uploadRoutes);
routes.use('/upload', express.static(path.join(__dirname, '../uploads')));
routes.use('/boards', boardRoutes);  


module.exports = routes;
>>>>>>> origin/main
