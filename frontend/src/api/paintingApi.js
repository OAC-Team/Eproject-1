import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/user';

async function getAllPaintings(searchKeyword) {
    const response = await axios.get(`${BASE_URL}/gallery?search=${encodeURIComponent(searchKeyword)}`);
    return response.data;
};

async function getAllCollectionPaintings() {
    const response = await axios.get(`${BASE_URL}/gallery?search=${encodeURIComponent(searchKeyword)}`);
    return response.data;
}

async function getPainting(painting_id) {
    const response = await axios.get(`${BASE_URL}/gallery/${painting_id}`);
    return response.data;
}

export default { getPainting, getAllPaintings };