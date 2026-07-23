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
    return await User.findOne(user_id).select('username profile_picture _id');
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

        if (!updatedUser) {
            console.warn(`User with ID ${userId} not found.`);
            return null;
        }

        return updatedUser;
    } catch (error) {
        console.error("User Service error: " + error.message)
        throw error
    }
}

async function updateCollection(userId, collectionId, updateData) {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error("User not found.");
    }

    const collection = user.collections.id(collectionId);
    if (!collection) {
        throw new Error("Collection not found.");
    }

    if (updateData.name !== undefined) collection.name = updateData.name;
    if (updateData.description !== undefined) collection.description = updateData.description;

    await user.save();
    return collection;
};

const deleteUserCollection = async (userId, collectionId) => {
    const User = require('../models/user'); // Adjust path to your User model if needed

    const result = await User.updateOne(
        { _id: userId },
        { $pull: { collections: { _id: collectionId } } }
    );

    if (result.modifiedCount === 0) {
        throw new Error("Collection not found or already deleted.");
    }

    return true;
};

module.exports = {
    getUser, updateUser, getUserPainting, getUserBasicData, updateCollection,
    deleteUserCollection
}