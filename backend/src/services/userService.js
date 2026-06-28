// userService talks to database with the request from userController

const User = require('../models/user');

async function getUser(criteria) {
    return await User.findOne(criteria).select('-password_hash');
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

module.exports = { getUser, updateUser }