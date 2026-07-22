<<<<<<< HEAD
const express = require('express');
const { register, login } = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../validators/authValidators');

const routes = express.Router();

routes.post('/register', validateRegister, register);
routes.post('/login', validateLogin, login);

=======
const express = require('express');
const { register, login, googleLogin } = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../validators/authValidators');

const routes = express.Router();

routes.post('/register', validateRegister, register);
routes.post('/login', validateLogin, login);
routes.post('/google-login', googleLogin);

>>>>>>> origin/main
module.exports = routes;