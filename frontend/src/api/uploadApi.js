<<<<<<< HEAD
export const uploadImageApi = async (file) => {
    const formData = new FormData();
    formData.append('image', file); 

    const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
    });
    if (!response.ok) {
        throw new Error('Failed to upload image');
    }
    return await response.json();
};
=======
import axios from 'axios'
import Cookies from 'js-cookie'

async function uploadImage(file) {
    try {
        const token = Cookies.get('token');
        const formData = new FormData();
        formData.append('image', file);

        const response = await axios.post(
            'http://localhost:5000/api/upload',
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error upload', error);
        throw error;
    }
}

export default { uploadImage }
>>>>>>> origin/main
