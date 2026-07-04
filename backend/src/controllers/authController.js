require('dotenv').config();
const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const { errorHandler } = require('../middlewares/errorHandler');

async function register(req, res, next) {
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
        next(error);
        console.error('Error Authentication', error);
    }
};

async function login(req, res, next) {
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
        next(error);
        console.error('Error Authentication!', error);
    }
};

async function googleLogin(req, res, next) {
    try {
        const { token } = req.body

        const client = new OAuth2Client(process.env.VITE_GOOGLE_CLIENT_ID);
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.VITE_GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload();
        console.log(payload)
        const { email, name, picture } = payload;
        let user = await User.findOne({ email });

        if (!user) {
            let tempUsername = email.split('@')[0] + Math.floor(Math.random() * 1000);
            user = new User({
                username: tempUsername,
                email: email,
                password_hash: 'google-oauth-dummy-password',
                role: 'member',
                profile_picture: picture
            });

            await user.save();
        };

        const jwtPayload = {
            user_id: user._id,
            role: user.role
        }

        const secretKey = process.env.JWT_KEY;
        const expiresIn = '1h';

        jwt.sign(
            jwtPayload,
            secretKey,
            { expiresIn },
            (err, token) => {
                if (err) throw err;

                res.status(200).json({
                    message: 'Login Successfully!',
                    accessToken: token,
                    role: user.role,
                    username: user.username
                });
            }
        );
    } catch (error) {
        next(error);
        console.log('Error Google Auth!', error);
    }
}

module.exports = { register, login, googleLogin };