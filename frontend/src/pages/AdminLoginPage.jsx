
import { useState, useEffect } from "react";
import authApi from "../api/authApi";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie'
import '../themes/SignUpPage.css';

export default function AdminLoginPage({ setUser }) {
    const [username, setUsername] = useState('');
    const [password, setPassWord] = useState('');
    const navigate = useNavigate();

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
                        text: `Wellcome admin: ${username}!`,
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

    return (
        <>
            <section className="auth-page-main">
                <div className="auth-page-form">
                    <br />
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    <p>Admin:</p>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <input
                                        type="text"
                                        placeholder="Enter administrator name"
                                        value={username}
                                        onChange={(e) => {
                                            setUsername(e.target.value)
                                        }} />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <p>Password:</p>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <input
                                        type="password"
                                        placeholder="Enter Password"
                                        value={password}
                                        onChange={(e) => { setPassWord(e.target.value) }} />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <br />
                    <button
                        className="auth-page-sign-up-btn"
                        onClick={handleLogin}>
                        Login
                    </button>
                    <br />
                </div>
            </section>
        </>
    )
};

