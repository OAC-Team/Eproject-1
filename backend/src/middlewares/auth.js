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

>>>>>>> origin/main
module.exports = { auth };