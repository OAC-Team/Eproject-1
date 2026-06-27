const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password_hash: {type: String, required: true},
    role: {type: String, required: true, default: 'member'},
    favorites: [{type: mongoose.Schema.Types.ObjectId}],
    collections: [{
        name: {type: String, required: true},
        paintings: [{type: mongoose.Schema.Types.ObjectId}]
    }],
    created_at: {type: Date, default: Date.now}
})

const User = mongoose.model("User", userSchema)
module.exports = User