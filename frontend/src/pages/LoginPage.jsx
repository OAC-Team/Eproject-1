
import { useState, useEffect } from "react";
import authApi from "../api/authApi";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie'
import { GoogleLogin } from '@react-oauth/google';

export default function LoginPage({ setUser }) {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassWord] = useState('');
    const navigate = useNavigate();
    const [rememberMe, setRememberMe] = useState(false);

    async function handleLogin() {
        try {
            const isEmail = identifier.includes('@');
            const payload = {
                password_hash: password,
                rememberMe
            };

            if (isEmail) {
                payload.email = identifier;
            } else {
                payload.username = identifier;
            };

            const response = await authApi.login(payload)

            if (response && response.token) {
                const { token, role } = response;

                const cookieOptions = rememberMe ? { expires: 30 } : {};
                Cookies.set('token', token, cookieOptions);
                Cookies.set('username', identifier, cookieOptions);
                Cookies.set('role', role, cookieOptions);

                setUser({ username: identifier, role });
                Swal.fire({
                    title: 'Login Successfully!',
                    text: `Logined in ${identifier} account!`,
                    icon: 'success',
                    confirmButtonText: 'Done'
                })

                navigate('/');
            }
        } catch (error) {
            console.error('Error to login!', error);
            Swal.fire({
                title: 'Login Error!',
                text: `Incorrect username or password.`,
                icon: 'error',
                confirmButtonText: 'Done'
            })
        }
    };

    async function handleGoogleLoginSuccess(credentialResponse) {
        try {
            const googleToken = credentialResponse.credential;
            const response = await authApi.googleLogin(googleToken)

            if (response && response.token) {
                const { token, role, username } = response;

                Cookies.set('token', token);
                Cookies.set('username', username);
                Cookies.set('role', role);

                setUser({ username, role });
                Swal.fire({
                    title: 'Login Successfully With Google!',
                    text: `Wellcome ${username}!`,
                    icon: 'success',
                    confirmButtonText: 'Done'
                })

                navigate('/');
            }
        } catch (error) {
            console.error('Error to login with Google!', error);
            Swal.fire({
                title: 'Login Error!',
                text: `Google Login failed.`,
                icon: 'error',
                confirmButtonText: 'Done'
            })
        }
    };

    async function handleGoogleLoginError() {
        console.error('Google Login Failed');
    };

    return (
        <>
            <input
                type="text"
                placeholder="Enter Username or Email"
                value={identifier}
                onChange={(e) => {
                    setIdentifier(e.target.value)
                }} />
            <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => { setPassWord(e.target.value) }} />
            <p><input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)} />Remember me for 30 day</p>
            <button onClick={handleLogin}>Login</button>
            <GoogleLogin 
                onSuccess={handleGoogleLoginSuccess}
                onError={handleGoogleLoginError}        
            />
        </>
    )
};

