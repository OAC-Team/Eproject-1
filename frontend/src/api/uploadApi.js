import Cookies from 'js-cookie';
import axios from 'axios';

const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const token = Cookies.get('token');

    const response = await axios.post('http://localhost:5000/api/user/upload', formData, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    return response.data;
};


export default { uploadImage };