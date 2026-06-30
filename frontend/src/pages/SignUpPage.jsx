import { useState, useEffect } from "react";
import authApi from "../api/authApi";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import GoogleAuth from '../components/GoogleAuth';

export default function SignUpPage({ setUser }) {
    const [username, setUsername] = useState('');
    const [password_hash, setPassWord_hash] = useState('');
    const [comfirmPassword, setComfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('user');
    const navgative = useNavigate();

    async function handleRegister() {
        try {
            await authApi.register(username, password_hash, email, role, comfirmPassword);
            const response = await authApi.login({ username, password_hash });
            const { token, role: userRole } = response;

            Cookies.set('token', token);
            Cookies.set('username', username);
            Cookies.set('role', userRole);

            setUser({ username, role: userRole });

            Swal.fire({
                title: 'Sign Successfully!',
                text: `register with the ${username} successfully .`,
                icon: 'success',
                confirmButtonText: 'Done'
            });

            navgative('/');
        } catch (error) {
            console.error('Error to register', error);

            let errorMessage = 'Something went wrong!';
            if (error.response && error.response.data) {
                if (Array.isArray(error.response.data.errors)) {
                    errorMessage = error.response.data.errors.map(err => err.message).join('\n');
                } else if (typeof error.response.data === 'string') {
                    errorMessage = error.response.data;
                } else if (error.response.data.message) {
                    errorMessage = error.response.data.message;
                }
            }

            Swal.fire({
                title: 'Failed to sign up!',
                html: errorMessage.replace(/\n/g, '<br/>'),
                icon: 'error',
                confirmButtonText: 'Done'
            });
        }

    };

    return (
        <>
            <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => { setUsername(e.target.value) }} />
            <input
                type="password"
                placeholder="Enter password"
                value={password_hash}
                onChange={(e) => { setPassWord_hash(e.target.value) }} />
            <input
                type="password"
                placeholder="Comfirm password"
                value={comfirmPassword}
                onChange={(e) => { setComfirmPassword(e.target.value) }} />
            <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => { setEmail(e.target.value) }} />
            <button onClick={handleRegister}>Sign Up</button>
            <GoogleAuth setUser={setUser}/>
        </>
    )
};

