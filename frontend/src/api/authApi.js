import axios from 'axios';

async function login(payload) {
    try {
        const response = await axios.post('http://localhost:5000/api/auth/login', payload);
        const token = response.data.accessToken;
        const role = response.data.role;

        return { token, role };
    } catch (error) {
        console.error('Error system', error);
        throw error;
    }
};

async function register(username, password_hash, email, role, comfirmPassword) {
    try {
        const response = await axios.post('http://localhost:5000/api/auth/register', { username, password_hash, email, role, comfirmPassword });
        return response.data;
    } catch (error) {
        console.error('Error system', error);
        throw error;
    }
};

async function googleLogin(token) {
    try {        
        const response = await axios.post('http://localhost:5000/api/auth/google-login', { token });
        const accessToken = response.data.accessToken;
        const role = response.data.role;
        const username = response.data.username;

        return { token: accessToken, role, username  };
    } catch (error) {
        console.error('Error system', error);
        throw error;
    }
}

export default { login, register, googleLogin };