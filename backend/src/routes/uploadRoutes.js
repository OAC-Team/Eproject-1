const express = require('express');
const multer = require('multer');
const path = require('path');
const { auth } = require('../middlewares/auth');
const routes = express.Router();

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, path.join(__dirname,'../uploads'));
    },
    filename(req, file, cb) {
        cb(null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    }
});

const upload = multer({ storage });

routes.post('/', auth, upload.single('image'), (req, res) => {
    res.send(`upload/${ req.file.filename}`)
});

module.exports = routes;