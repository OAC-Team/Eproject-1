<<<<<<< HEAD
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
=======
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password_hash: { type: String, required: true },
    role: { type: String, required: true, default: 'member' },
    bio: { type: String, default: "", maxLength: [500, "Bio cannot be longer than 500 characters."] },
    profile_picture: { type: String, required: true, default: "https://upload.wikimedia.org/wikipedia/commons/0/03/Twitter_default_profile_400x400.png?_=20240121032759" },
    favorites: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Painting'
        }
    ],
    uploaded_paintings: [{ type: mongoose.Schema.Types.ObjectId }],
    collections: [{
        name: { type: String, required: true },
        paintings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Painting' }]
    }],
    created_at: {type: Date, default: Date.now},
    active: {type: String, enum: ['active', 'deactive'], default: 'active'},
})

const User = mongoose.model("User", userSchema)
>>>>>>> origin/main
module.exports = User