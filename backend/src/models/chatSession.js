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
module.exports = ChatSession;