import axios from 'axios';

async function fetchUser(token) {
    try {
        const response = await axios.get('http://localhost:5000/api/user/profile', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        // console.log("Backend response data: ", response.data);
        return response.data;
    } catch (error) {
        console.log("Failed to fetch user data from database. " + error.message);
    }
}

async function fetchUserCollection(token, collection_id) {
    try {
        const response = await axios.get(`http://localhost:5000/api/user/collections/${collection_id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })

        return response.data
    } catch (error) {
        console.error(error.message)
    }
}

async function updateUserCollection(token, collectionId, updateData) {
    if (!collectionId) {
        console.error("Cannot update: collectionId is undefined.");
        return;
    }

    try {
        const response = await axios.put(
            `http://localhost:5000/api/user/collections/${collectionId}`,
            updateData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Frontend API update error:", error.response?.data || error.message);
        throw error;
    }
}

async function updateUser(token, updateData) {
    try {
        const response = await axios.post('http://localhost:5000/api/user/profile/',
            updateData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        )

        return response.data
    } catch (error) {
        console.error(error.message)
    }
}

async function likePicture(painting_id, token) {
    try {
        const response = await axios.post(`http://localhost:5000/api/user/like/${painting_id}`,
            {},
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        )

        return response.data
    } catch (error) {
        console.error("Frontend API like error: " + error.message)
        throw error;
    }
}

async function saveToCollection(collectionName, painting_id, token) {
    try {
        const response = await axios.post(`http://localhost:5000/api/user/collections/add`,
            { collectionName, painting_id },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        )

        return response.data
    } catch (error) {
        console.error("Frontend API save error: " + error.message)
        throw error;
    }
}

async function addUserCollection(token, collectionData) {
    try {
        const response = await axios.post(`http://localhost:5000/api/user/collections`,
            collectionData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Frontend API add collection error: " + error.message);
        throw error;
    }
}

async function deleteUserCollection(token, collectionId) {
    try {
        const response = await axios.delete(
            `http://localhost:5000/api/user/collections/${collectionId}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Frontend API delete collection error:", error.response?.data || error.message);
        throw error;
    }
}

export default {
    fetchUser, updateUserCollection, updateUser, likePicture,
    saveToCollection, fetchUserCollection, addUserCollection, deleteUserCollection
}