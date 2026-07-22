require('dotenv').config();
const User = require('../models/user');
const Painting = require('../models/painting');
const AdminLog = require('../models/adminLog');
const jwt = require('jsonwebtoken');
const { errorHandler } = require('../middlewares/errorHandler');
const cloudinary = require('cloudinary').v2;
const bcryptjs = require('bcryptjs');
const UserLog = require('../models/userLog');

//User
async function getAllUser(req, res) {
    try {
        const users = await User.find().sort({ created_at: -1 });
        // console.log(users)
        return res.status(200).json({ users: users })
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
}

async function getUser(req, res) {
    try {
        const userId = req.params.user_id
        const user = await User.findOne({ _id: userId })

        if (!user) {
            return res.status(404).json({ message: 'User not found!' });
        }

        res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({ message: 'User not found!', error: error.message });
    }
}

async function updateStatusUser(req, res) {
    try {
        const { user_id } = req.params;
        const { active, reason, adminName } = req.body;

        if (!active || !reason || !adminName) {
            return res.status(400).json({
                message: 'Active status, reason, and admin name are required.'
            });
        }

        const updateUserStatus = await User.findByIdAndUpdate(
            user_id,
            { active: active },
            { new: true }
        )

        if (!updateUserStatus) {
            return res.status(404).json({ message: 'User not found' });
        }

        await AdminLog.create({
            adminName: adminName,
            targetUserId: user_id,
            action: `Change status to ${active}`,
            reason: reason,
            createdAt: new Date()
        });

        res.status(200).json({ message: `Account ${updateStatusUser.username || 'user'} has been updated to ${active}`, updateUserStatus });
    } catch (error) {
        return res.status(500).json({ message: 'Error updating user status', error: error.message });
    }
}

async function getUserLog(req, res) {
    try {
        const { user_id } = req.params;
        const logs = await UserLog.find({ userId: user_id }).sort({ createdAt: -1 })
        return res.status(200).json({ logs });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

//Admin
async function verifyAdminPassword(req, res) {
    try {
        const adminId = req.user.user_id;
        const { password } = req.body;
        const admin = await User.findById(adminId);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        const isMatch = await bcryptjs.compare(password, admin.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect password!' });
        }
        return res.status(200).json({ verified: true });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function getAdminLog(req, res) {
    try {
        const { targetUserId } = req.params;
        const log = await AdminLog.find({ targetUserId }).sort({ createdAt: -1 })
        return res.status(200).json({ log });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function resetUserPassword(req, res) {
    try {
        const { user_id } = req.params;
        const { newPassword, adminName, reason } = req.body;

        if (!adminName || !reason) {
            return res.status(400).json({
                message: 'Reason and admin name are required.'
            });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters!' })
        }

        const user = await User.findById(user_id)

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const salt = await bcryptjs.genSalt(10)
        user.password_hash = await bcryptjs.hash(newPassword, salt);

        await AdminLog.create({
            adminName: adminName,
            targetUserId: user_id,
            action: 'ResetPw',
            reason: reason,
            createdAt: new Date()
        });

        await user.save();
        res.status(200).json({ message: `Account ${user.username || 'user'} has been reseted password`, user });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

//Painting
async function getPendingPaintings(req, res) {
    try {
        const pendingPainting = await Painting.find({ status: 'pending' }).sort({ create_at: -1 })
        res.status(200).json(pendingPainting)
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching pending paintings', error: error.message });
    }
}

async function getApprovePaintings(req, res) {
    try {
        const pendingPainting = await Painting.find({ status: 'approved' }).sort({ create_at: -1 })
        res.status(200).json(pendingPainting)
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching approved paintings', error: error.message });
    }
}

async function getRejectPaintings(req, res) {
    try {
        const pendingPainting = await Painting.find({ status: 'rejected' }).sort({ create_at: -1 })
        res.status(200).json(pendingPainting)
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching rejected paintings', error: error.message });
    }
}

async function statusHandlePainting(req, res) {
    try {
        const { painting_id } = req.params
        const { status, reject_reason } = req.body

        const updateFields = { status };
        if (status === 'rejected' && reject_reason) {
            updateFields.reject_reason = reject_reason;
        }

        const updateStatePainting = await Painting.findByIdAndUpdate(
            painting_id,
            updateFields,
            { new: true }
        )
        if (!updateStatePainting) {
            return res.status(404).json({ message: 'Picture not found' })
        }

        res.status(200).json({ paintings: updateStatePainting })
    } catch (error) {
        return res.status(500).json({ message: 'Error approved paintings', error: error.message });
    }
}

async function deletePainting(req, res) {
    try {
        const { painting_id } = req.params;

        const userId = req.user?.user_id || req.user?._id || req.user?.id;

        const painting = await Painting.findById(painting_id);
        if (!painting) {
            return res.status(404).json({ error: "Painting not found." });
        }

        const creatorId = painting.uploader || painting.user_id || painting.userId;

        if (!creatorId || (creatorId.toString() !== userId?.toString() && req.user?.role !== 'admin')) {
            return res.status(403).json({ error: "You can't delete someone else's art." });
        }

        if (painting.cloudinary_id) {
            const cloudinaryResponse = await cloudinary.uploader.destroy(painting.cloudinary_id)
            console.log('Cloudinary delete result:', cloudinaryResponse);
        }

        await User.updateMany(
            {
                $or: [
                    { uploaded_paintings: painting_id },
                    { favorites: painting_id },
                    { "collections.paintings": painting_id }
                ]
            },
            {
                $pull: {
                    uploaded_paintings: painting_id,
                    favorites: painting_id,
                    "collections.$[].paintings": painting_id
                }
            }
        );

        await Painting.findByIdAndDelete(painting_id);

        res.json({ message: "Painting removed from database successfully." });
    } catch (err) {
        console.error("Delete Painting Error:", err);
        res.status(500).json({ error: "Failed to delete painting." });
    }
};

async function getAllPaintings(req, res) {
    try {
        const paintings = await Painting.find().sort({ created_at: -1 });
        return res.status(200).json({ paintings: paintings })
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching paintings', error: error.message });
    }
}

async function getRejectedPaintingsByUser(req, res) {
    try {
        const { user_id } = req.params;
        const paintings = await Painting.find({ user_id, status: 'rejected' }).sort({ created_at: -1 });
        return res.status(200).json({ paintings });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function updateUserProfileByAdmin(req, res) {
    try {
        const { user_id } = req.params;
        const { username, email, role, bio, adminName } = req.body;

        if (!adminName) {
            return res.status(400).json({ message: 'Admin name is required for verification.' });
        }

        const user = await User.findById(user_id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Check if username/email is already taken by another user
        if (username && username !== user.username) {
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return res.status(400).json({ message: 'Username is already taken.' });
            }
        }

        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'Email is already taken.' });
            }
        }

        user.username = username || user.username;
        user.email = email || user.email;
        user.role = role || user.role;
        user.bio = bio !== undefined ? bio : user.bio;

        await user.save();

        await AdminLog.create({
            adminName: adminName,
            targetUserId: user_id,
            action: 'Edit Profile',
            reason: `Admin updated profile (username, email, role, bio)`,
            createdAt: new Date()
        });

        return res.status(200).json({ message: 'User profile updated successfully.', user });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function getAllUserLogs(req, res) {
    try {
        const logs = await UserLog.find()
            .populate('userId', 'username profile_picture')
            .sort({ createdAt: -1 })
            .limit(30);
        return res.status(200).json({ logs });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function deleteUserLog(req, res) {
    try {
        const { log_id } = req.params;
        await UserLog.findByIdAndDelete(log_id);
        return res.status(200).json({ message: 'Log deleted successfully.' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getPendingPaintings,
    statusHandlePainting,
    getAllPaintings,
    getApprovePaintings,
    getRejectPaintings,
    deletePainting,
    getAllUser,
    getUser,
    updateStatusUser,
    verifyAdminPassword,
    getAdminLog,
    resetUserPassword,
    getUserLog,
    updateUserProfileByAdmin,
    getAllUserLogs,
    deleteUserLog,
    getRejectedPaintingsByUser
};