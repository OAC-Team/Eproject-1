<<<<<<< HEAD
const mongoose = require('mongoose');

const chatSessionSchema = new mongoose.Schema({
    user_id: {type: mongoose.Schema.Types.ObjectId},
    messages: [{
        sender: String,
        message_text: String,
        timestamp: Date
    }],
    started_at: {type: Date, default: Date.now}
});

const ChatSession = mongoose.model("ChatSession", chatSessionSchema);
=======
const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, default: "Art Inquiry" },
    messages: [
        {
            sender: { type: String, enum: ['user', 'ai'], required: true },
            text: { type: String, required: true },
            timestamp: { type: Date, default: Date.now }
        }
    ]
}, { timestamps: true });

<<<<<<< HEAD
const ChatSession = mongoose.model("ChatSession", chatSessionSchema);
module.exports = ChatSession;
const mongoose = require('mongoose');

const chatSessionSchema = new mongoose.Schema({
    user_id: {type: mongoose.Schema.Types.ObjectId},
    messages: [{
        sender: String,
        message_text: String,
        timestamp: Date
    }],
    started_at: {type: Date, default: Date.now}
});

const ChatSession = mongoose.model("ChatSession", chatSessionSchema);
>>>>>>> origin/main
module.exports = ChatSession;
=======
module.exports = mongoose.model('ChatSession', chatSchema);
>>>>>>> 236bb33492b85e5d441e3e21651538d594798904
