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

async function updateUser(token, route, updateData) {
    try {
        const response = await axios.post('http://localhost:5000/api/user/collections',
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
        console.error("Frontend API update error: " + error.message)
        return null;
    }
}

export default { fetchUser, updateUser, fetchUserCollection }