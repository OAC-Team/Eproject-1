const mongoose = require('mongoose');

const userLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },

    action: {
        type: String,
        required: true
    },

    category: {
        type: String,
        enum: ['AUTH', 'PAINTING', 'COLLECTION', 'ACCOUNT', 'INTERACTION'],
        default: 'ACCOUNT'
    },

    description: { type: String },
    targetId: { type: mongoose.Schema.Types.ObjectId },
    targetType: { type: String },

    metadata: {
        type: mongoose.Schema.Types.Mixed
    },

    //ipAddress: { type: String },
    //device: { type: String } // Ví dụ: 'Chrome / Windows', 'Safari / iOS'

}, {
    timestamps: true
});

const UserLog = mongoose.model("UserLog", userLogSchema)
module.exports = UserLog