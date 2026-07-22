<<<<<<< HEAD

import { useState, useEffect } from "react";
import authApi from "../api/authApi";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie'

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
        </>
    )
};

=======

import { useState, useEffect } from "react";
import authApi from "../api/authApi";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie'
import GoogleAuth from "../components/GoogleAuth";
import '../themes/SignUpPage.css';
import { useLocation } from "react-router-dom";

export default function LoginPage({ setUser }) {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassWord] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
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
                    text: `Logged in ${identifier} account!`,
                    icon: 'success',
                    confirmButtonText: 'Done'
                })

                navigate('/');
            }
        } catch (error) {
            console.error('Error to login!', error);
            Swal.fire({
                title: 'Login Error!',
                text: error.response?.data?.message || `Incorrect username or password.`,
                icon: 'error',
                confirmButtonText: 'Done'
            })
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
                                    <p>Username or Email:</p>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <input
                                        type="text"
                                        placeholder="Enter Username or Email"
                                        value={identifier}
                                        onChange={(e) => {
                                            setIdentifier(e.target.value)
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
                            <tr>
                                <td>
                                    <input
                                        className="auth-page-check-box"
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)} />
                                    <span> Remember me for 30 day </span>
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
