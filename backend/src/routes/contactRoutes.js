const express = require('express');
const routes = express.Router();
const Contact = require('../models/contact');

routes.post('/', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ message: "All fields are required." });
        }
        
        const newContact = new Contact({
            name,
            email,
            subject,
            message
        });

        await newContact.save();
        return res.status(201).json({ message: "Contact message saved successfully." });
    } catch (error) {
        return res.status(500).json({ message: "Server error saving contact message.", error: error.message });
    }
});

module.exports = routes;
