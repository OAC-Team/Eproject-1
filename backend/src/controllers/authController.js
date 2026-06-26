require('dotenv').config();
const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function register(req, res) {
    try {
        const { username, password_hash, email, role } = req.body;

        const user = await User.findOne({ $or: [{ username: username }, { email: email }] });
        if (user) {
            res.status(400).send('Username or email already have!');
            return;
        };

        const hashPw = await bcryptjs.hash(password_hash, 10);
        const newUser = new User({
            username: username,
            password_hash: hashPw,
            email: email,
            role: role || 'user'
        });

        await newUser.save();
        res.status(201).send('Sign up successfully!');
    } catch (error) {
        res.status(500).send('Error Authentication!');
        console.error('Error Authentication', error);
    }
};

async function login(req, res) {
    try {
        const { username, password_hash, email, rememberMe } = req.body;
        const user = await User.findOne({ $or: [{ username: username }, { email: email }] });

        if (!user) {
            res.status(401).send('Username or password is incorrect!');
            return;
        };

        const isMatch = await bcryptjs.compare(password_hash, user.password_hash);
        if (!isMatch) {
            res.status(401).send('Username or password is incorrect!');
            return;
        };

        const payload = {
            user_id: user._id,
            role: user.role
        }

        const secretKey = process.env.JWT_KEY;
        const expiresIn = rememberMe ? '30d' : '1h';

        jwt.sign(
            payload,
            secretKey,
            { expiresIn },
            (err, token) => {
                if (err) throw err;

                res.status(200).json({
                    message: 'Login Successfully!',
                    accessToken: token,
                    role: user.role
                });
            }
        );
    } catch (error) {
        res.status(500).send('Error Authentication!');
        console.error('Error Authentication!');
    }
};

module.exports = { register, login };