import axios from "axios";

async function getPendingPaintings(token) {
    try {
        const response = await axios.get('http://localhost:5000/api/admin/paintings/pending',
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        return response.data;
    } catch (error) {
        console.error('Error fetching pending paintings', error);
        throw error;
    }
};

async function getAllPaintings(token) {
    try {
        const response = await axios.get('http://localhost:5000/api/admin/paintings',
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        return response.data;
    } catch (error) {
        console.error('Error fetching all paintings', error);
        throw error;
    }
}

async function handleStatusPainting(painting_id, status, token) {
    try {
        const response = await axios.patch(`http://localhost:5000/api/admin/paintings/${painting_id}/handle`,
            { status },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        return response.data;
    } catch (error) {
        console.error('Error updating painting status', error);
        throw error;
    }
}

export default { getAllPaintings, getPendingPaintings, handleStatusPainting }