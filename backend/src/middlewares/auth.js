<<<<<<< HEAD
const jwt = require('jsonwebtoken');
require('dotenv').config();
async function auth(req, res, callback) {
    try {
        const authHeader = req.header('Authorization');

        if (authHeader && authHeader.startsWith('Bearer')) {
            const token = authHeader.split(' ')[1];
            const decodeInfo = await jwt.verify(token, process.env.JWT_KEY);
            req.user = decodeInfo;
        } else {
            return res.status(401).json({ message: 'Deny access!' });
        }
        callback();
    } catch (error) {
        console.error('Deny access!', error);
        res.status(401).send('Deny access!');
    }
}

=======
const jwt = require('jsonwebtoken');
require('dotenv').config();

async function auth(req, res, callback) {
    try {
        const authHeader = req.header('Authorization');

        if (authHeader && authHeader.startsWith('Bearer')) {
            const token = authHeader.split(' ')[1];
            const decodeInfo = await jwt.verify(token, process.env.JWT_KEY);
            req.user = decodeInfo;
        } else {
            return res.status(401).json({ message: 'Deny access!' });
        }
        callback();
    } catch (error) {
        console.error('Deny access!', error);
        res.status(401).send('Deny access!');
    }
}

async function isAdmin(req, res, next) {
    try {
        const role = req.user.role
        if (role === 'admin') {
            next()
        } else {
            return res.status(403).json({ message: 'Access denied. Admins only!' });
        }
    } catch (error) {
        console.error('Access denied. Admins only!', error);
        res.status(403).send('Access denied. Admins only!');
    }
}
module.exports = { auth, isAdmin };