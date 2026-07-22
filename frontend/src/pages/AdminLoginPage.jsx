import { useState, useEffect } from "react";
import authApi from "../api/authApi";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie'
import '../themes/AdminLogin.css';

export default function AdminLoginPage({ setUser }) {
    const [username, setUsername] = useState('');
    const [password, setPassWord] = useState('');
    const navigate = useNavigate();
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    async function handleLogin() {
        try {
            const payload = {
                password_hash: password,
                username: username
            };

            const response = await authApi.login(payload)

            if (response && response.token) {
                const { token, role } = response;

                if (role === 'admin') {
                    const cookieOptions = {};
                    Cookies.set('token', token, cookieOptions);
                    Cookies.set('username', username, cookieOptions);
                    Cookies.set('role', role, cookieOptions);

                    setUser({ username, role });
                    Swal.fire({
                        title: 'Login Successfully!',
                        text: `Welcome admin: ${username}!`,
                        icon: 'success',
                        confirmButtonText: 'Done'
                    })

                    navigate('/admin/dashboard');
                } else {
                    Cookies.remove('token', token)
                    Swal.fire({
                        title: 'Deny access!',
                        text: `You do not have access to the administration page!`,
                        icon: 'warning',
                        confirmButtonText: 'Done'
                    })
                    navigate('/');
                }
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

    const togglePasswordVisible = () => {
        setIsPasswordVisible((prev) => !prev)
    }

    return (
        <section className="admin-login-wrapper">
            <div className="admin-login-card">
                <img src="/Logo(black).png" alt="Admin Logo" className="admin-login-logo" />
                <h2>Admin Login</h2>
                <p className="subtitle">Sign in to manage Only Art Collection</p>

                <div className="admin-form-group">
                    <label>Administrator Username</label>
                    <div className="admin-input-wrapper">
                        <i className="bi bi-person"></i>
                        <input
                            type="text"
                            placeholder="Enter username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                </div>

                <div className="admin-form-group">
                    <label>Password</label>
                    <div className="admin-input-wrapper">
                        <i className="bi bi-shield-lock"></i>
                        <input
                            type={isPasswordVisible ? "text" : "password"}
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassWord(e.target.value)}
                        />
                        <button
                            onClick={togglePasswordVisible}>
                            {isPasswordVisible ? <i className="bi bi-eye-slash"></i> : <i className="bi bi-eye-fill"></i>}
                            </button>
                    </div>
                </div>

                <button
                    className="admin-login-btn"
                    onClick={handleLogin}
                >
                    <i className="bi bi-box-arrow-in-right"></i>
                    Login to Dashboard
                </button>
            </div>
        </section>
    )
};
