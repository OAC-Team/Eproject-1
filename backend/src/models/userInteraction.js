<<<<<<< HEAD
const mongoose = require('mongoose');

const userInteractionSchema = new mongoose.Schema({
    user_id: {type: mongoose.Schema.Types.ObjectId},
    painting_id: {type: mongoose.Schema.Types.ObjectId},
    interaction_type: {type: String, required: true},
    metadata: {type: mongoose.Schema.Types.Mixed},
    timestamp: {type: Date, default: Date.now}
});

const UserInteraction = mongoose.model("UserInteraction", userInteractionSchema);
=======
const mongoose = require('mongoose');

const userInteractionSchema = new mongoose.Schema({
    user_id: {type: mongoose.Schema.Types.ObjectId},
    painting_id: {type: mongoose.Schema.Types.ObjectId},
    interaction_type: {type: String, required: true},
    metadata: {type: mongoose.Schema.Types.Mixed},
    timestamp: {type: Date, default: Date.now}
});

const UserInteraction = mongoose.model("UserInteraction", userInteractionSchema);
<<<<<<< HEAD
module.exports = UserInteraction;
const mongoose = require('mongoose');

const userInteractionSchema = new mongoose.Schema({
    user_id: {type: mongoose.Schema.Types.ObjectId},
    painting_id: {type: mongoose.Schema.Types.ObjectId},
    interaction_type: {type: String, required: true},
    metadata: {type: mongoose.Schema.Types.Mixed},
    timestamp: {type: Date, default: Date.now}
});

const UserInteraction = mongoose.model("UserInteraction", userInteractionSchema);
>>>>>>> origin/main
=======
>>>>>>> 236bb33492b85e5d441e3e21651538d594798904
module.exports = UserInteraction;