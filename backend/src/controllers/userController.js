const userService = require('../services/userService');

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

module.exports = {
    getUserProfile,
    addUserCollection,
    getUserProfilePicture,
    getUserCollection
}