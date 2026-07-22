import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/user';

export async function getAllPaintings(searchKeyword = '', filters = {}) {
    const { surface, medium, style } = filters;

    const response = await axios.get(`${BASE_URL}/gallery`, {
        params: {
            search: searchKeyword || undefined,
            surface: surface || undefined,
            medium: medium || undefined,
            style: style || undefined,
        }
    });

    return response.data;
}

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

// async function analyzeImage(token) {
//     try {
//         const response = await axios.post(`${BASE_URL}/api/analyze`)
//     } catch (error) {
        
//     }
// }

export default { getPainting, getAllPaintings, deletePainting };