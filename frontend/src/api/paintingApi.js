import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/user';

async function getAllPaintings(searchKeyword) {
    const response = await axios.get(`${BASE_URL}/gallery?search=${encodeURIComponent(searchKeyword)}`);
    return response.data;
};

async function getPainting(painting_id) {
    const response = await axios.get(`${BASE_URL}/gallery/${painting_id}`);
    return response.data;
}

async function deletePainting(painting_id, token) {
    try {
        const response = await axios.delete(`${BASE_URL}/gallery/${painting_id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        return response.data;
    } catch (error) {
        console.error("Delete Error:", error);
        throw error;
    }
}

export default { getPainting, getAllPaintings, deletePainting };