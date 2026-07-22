<<<<<<< HEAD
import { useState, useEffect } from "react";
import authApi from "../api/authApi";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

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
        </>
    )
};

=======
import { useState, useEffect } from "react";
import authApi from "../api/authApi";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import GoogleAuth from '../components/GoogleAuth';
import { useLocation } from "react-router-dom";
import '../themes/SignUpPage.css';

export default function SignUpPage({ setUser }) {
    const [username, setUsername] = useState('');
    const [password_hash, setPassWord_hash] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('user');
    const navigative = useNavigate();
    const location = useLocation();

    async function handleRegister() {
        try {
            await authApi.register(username, password_hash, email, role, confirmPassword);
            const response = await authApi.login({ username, password_hash });
            const { token, role: userRole } = response;

            Cookies.set('token', token);
            Cookies.set('username', username);
            Cookies.set('role', userRole);

            setUser({ username, role: userRole });

            Swal.fire({
                title: 'Sign Successfully!',
                text: `User ${username} has been registered successfully .`,
                icon: 'success',
                confirmButtonText: 'Done'
            });

            navigative('/');
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
            <header className="auth-page-header">
                <a href="/">
                    <img className="auth-page-logo" src="/Logo.png" />
                </a>
                <nav className="auth-page-nav">
                    <a
                        href="/">
                        Gallery
                    </a>

                    <input
                        className="auth-page-search-bar"
                        type="search"
                        placeholder="Search . . ." />

                    <a
                        href="/about.html">
                        About
                    </a>

                    <a
                        href="/contact">
                        Contact
                    </a>

                    <a
                        className={location.pathname === '/login' ? 'active' : ''}
                        href="/login">
                        Login
                    </a>

                    <a
                        className={location.pathname === '/register' ? 'active' : ''}
                        href="/register">
                        Sign Up
                    </a>
                </nav>
            </header>

            <section className="auth-page-main">
                <div className="auth-page-form">
                    <img src="/text.png" />
                    <br />
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    <p>Username:</p>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <input
                                        className="auth-page-input-username"
                                        type="text"
                                        placeholder="Enter username"
                                        value={username}
                                        onChange={(e) => { setUsername(e.target.value) }} /> <br />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <p>Email:</p>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <input
                                        className="auth-page-input-email"
                                        type="email"
                                        placeholder="Enter email"
                                        value={email}
                                        onChange={(e) => { setEmail(e.target.value) }} /> <br />
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
                                        className="auth-page-input-password"
                                        type="password"
                                        placeholder="Enter password"
                                        value={password_hash}
                                        onChange={(e) => { setPassWord_hash(e.target.value) }} /> <br />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <p>Comfirm Password:</p>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <input
                                        className="auth-page-input-password"
                                        type="password"
                                        placeholder="Comfirm password"
                                        value={confirmPassword}
                                        onChange={(e) => { setConfirmPassword(e.target.value) }} /> <br />
                                </td>
                            </tr>
                        </tbody>
                    </table> <br />
                    <button
                        className="auth-page-sign-up-btn"
                        onClick={handleRegister}>
                        Sign Up
                    </button>
                    <br />
                    <GoogleAuth setUser={setUser} />
                </div>
            </section>

            <footer className="auth-page-footer">
                <img src="/TextLogo.png" />
                <p>㋑ Deverlop by OAC Team</p>
                <div className="Quick-link">
                    <h2>Link</h2>
                    <a href="/contact">Contact</a>
                    <a href="/about.html">About</a>
                    <a href="/">Gallery</a>
                </div>
            </footer>
        </>
    )
};

>>>>>>> origin/main
