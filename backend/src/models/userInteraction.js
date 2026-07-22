const mongoose = require('mongoose');

const userInteractionSchema = new mongoose.Schema({
    user_id: {type: mongoose.Schema.Types.ObjectId},
    painting_id: {type: mongoose.Schema.Types.ObjectId},
    interaction_type: {type: String, required: true},
    metadata: {type: mongoose.Schema.Types.Mixed},
    timestamp: {type: Date, default: Date.now}
});

const UserInteraction = mongoose.model("UserInteraction", userInteractionSchema);
module.exports = UserInteraction;