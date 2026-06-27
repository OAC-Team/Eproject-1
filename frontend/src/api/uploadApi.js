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