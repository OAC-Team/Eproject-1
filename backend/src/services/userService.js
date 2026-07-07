// userService talks to database with the request from userController
const User = require('../models/user');
const Painting = require('../models/painting');

async function getUser(criteria) {
    return await User.findOne(criteria)
        .select('-password_hash')
        .populate({
            path: 'collections.paintings',
            model: 'Painting',
            select: 'image_url'
        });
    ;
}

async function getUserBasicData(user_id) {
    return await User.findOne(user_id).select('username profile_picture -_id');
}

async function getUserPainting(user_id) {
    const user = await getUser({ _id: user_id });
    if (!user) return [];
    return await Painting.find({ _id: { $in: user.uploaded_paintings } });
}

async function updateUser(userId, updateData) {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        )

        if (!updateUser) {
            console.warn(`User with ID ${userId} not found.`);
            return null;
        }

        return updateUser;
    } catch (error) {
        console.error("User Service error: " + error.message)
        throw error
    }
}

module.exports = { getUser, updateUser, getUserPainting, getUserBasicData }