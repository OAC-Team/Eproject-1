const express = require('express');
const { register, login } = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../validators/authValidators');

const routes = express.Router();

routes.post('/register', validateRegister, register);
routes.post('/login', validateLogin, login);

module.exports = routes;