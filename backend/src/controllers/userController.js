const userService = require('../services/userService');
const Painting = require('../models/painting');
const User = require('../models/user');
const UserLog = require('../models/userLog');
async function getUserProfile(req, res) {
    try {
        // console.log(req)
        const userId = req.user.user_id;
        const userData = await userService.getUser({ _id: userId })

        // console.log("Server returned with " + userData)

        if (!userData) {
            return res.status(404).json({ message: "User not found." });
        }

        const userPaintings = await userService.getUserPainting(userId);

        return res.status(200).json({ userData, userPaintings })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

async function addUserCollection(req, res) {
    // console.log("Received body: " + req.body.stringify());
    try {
        const userId = req.user.user_id;
        const { name } = req.body

        if (!name) {
            return res.status(400).json({ message: "Collection name is required." })
        }

        const updatePayload = {
            $push: { collections: { name: name, paintings: [] } }
        }

        const updatedUser = await userService.updateUser(userId, updatePayload);

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found." });
        }

        await UserLog.create({
            userId: userId,
            category: 'COLLECTION',
            action: 'create_collection',
            description: `Created collection "${name}"`
        });

        return res.status(200).json(
            {
                message: "Collection saved successfully.",
                collections: updatedUser.collections
            });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function getUserProfilePicture(req, res) {
    try {
        // console.log(req)
        const userId = req.user.user_id;
        const userData = await userService.getUser({ _id: userId })
        // console.log("Server returned with " + userData)
        if (!userData) {
            return res.status(404).json({ message: "User not found." });
        }

        const userProfilePicture = userData.profile_picture

        return res.status(200).json(userProfilePicture)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

async function getUserCollection(req, res) {
    try {
        const collectionId = req.params.collection_id;
        const userId = req.user.user_id;
        const userData = await userService.getUser({ _id: userId })

        if (!userData) {
            return res.status(404).json({ message: "User not found." });
        }

        const userCollection = userData.collections.find(
            (col) => col._id.toString() === collectionId
        );

        return res.status(200).json({ userCollection })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

async function likePicture(req, res) {
    try {
        const userId = req.user.user_id;
        const { painting_id } = req.params;

        const user = await userService.getUser({ _id: userId });
        const isLiked = user.favorites.includes(painting_id);

        let updatePayload;
        let countDiff;
        let liked;

        if (!isLiked) {
            updatePayload = { $addToSet: { favorites: painting_id } };
            countDiff = +1;
            liked = true
        } else {
            updatePayload = { $pull: { favorites: painting_id } };
            countDiff = -1;
            liked = false
        }

        await userService.updateUser(userId, updatePayload);
        const updatePainting = await Painting.findByIdAndUpdate(
            painting_id,
            { $inc: { favorites_count: countDiff } },
            { new: true }
        );

        await UserLog.create({
            userId: userId,
            category: 'INTERACTION',
            action: 'like_painting',
            description: `Like painting "${updatePainting?.title || 'Painting'}"`
        });

        return res.status(200).json({
            message: liked ? 'Liked successfully' : 'Unliked successfully',
            like: liked,
            favorites_count: updatePainting ? updatePainting.favorites_count : 0
        })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

async function savePaintingToCollection(req, res, next) {
    try {
        const userId = req.user.user_id;
        const { painting_id, collectionName } = req.body;
        const saveToCollection = await User.findOneAndUpdate(
            {
                _id: userId,
                'collections.name': collectionName
            },
            {
                $addToSet: {
                    'collections.$.paintings': painting_id
                }
            },
            {
                new: true,
                runValidators: true
            }
        )

        // console.log(saveToCollection.collections)

        res.status(200).json({
            message: 'Save successfully',
            userCollections: saveToCollection.collections
        })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

async function updateUser(req, res) {
    try {
        const userId = req.user.user_id;
        const { username, bio, profile_picture } = req.body
        const updateData = { username, bio, profile_picture };

        const updatedUser = await userService.updateUser(userId, updateData);

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            })
        }

        return res.status(200).json({ message: "User profile updated successfully.", updatedUser })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

async function updateUserCollection(req, res) {
    try {
        const { collection_id } = req.params;
        const userId = req.user?.user_id || req.user?._id || req.user?.id;
        
        const updatedCollection = await userService.updateCollection(
            userId, 
            collection_id, 
            req.body
        );

        res.json({ 
            message: "Collection updated successfully.", 
            collection: updatedCollection 
        });
    } catch (err) {
        console.error("Update Collection Error:", err);
        res.status(err.message.includes("not found") ? 404 : 500).json({ 
            error: err.message || "Failed to update collection." 
        });
    }
};

async function deleteUserCollection(req, res) {
    try {
        const { collection_id } = req.params;
        const userId = req.user?.user_id || req.user?._id || req.user?.id;

        await userService.deleteCollection(userId, collection_id);

        res.json({ message: "Collection deleted successfully." });
    } catch (err) {
        console.error("Delete Collection Error:", err);
        res.status(err.message.includes("not found") ? 404 : 500).json({ 
            error: err.message || "Failed to delete collection." 
        });
    }
};

module.exports = {
    getUserProfile,
    addUserCollection,
    getUserProfilePicture,
    likePicture,
    getUserCollection,
    savePaintingToCollection,
    updateUser,
    updateUserCollection,
    deleteUserCollection
}
