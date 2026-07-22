const mongoose = require('mongoose');

const adminLogSchema = new mongoose.Schema(
    {
        adminName: { type: String, required: true, trim: true },
        targetUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        action: { type: String, required: true },
        reason: { type: String, required: true, trim: true }
    },
    {
        timestamps: { createdAt: 'createdAt', updatedAt: false }
    }
)

const AdminLog = mongoose.model("AdminLog", adminLogSchema)
module.exports = AdminLog