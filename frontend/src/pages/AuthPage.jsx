import { useState } from "react";
import authApi from "../api/authApi";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import GoogleAuth from '../components/GoogleAuth';
import '../themes/SignUpPage.css';
import PublicNavBar from '../components/PublicNavBar';

export default function AuthPage({ setUser }) {
    const [isLogin, setIsLogin] = useState(true);

    const [identifier, setIdentifier] = useState(''); // Email / Username when Login
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const navigate = useNavigate();

    // submit Login
    async function handleLogin() {
        try {
            const isEmail = identifier.includes('@');
            const payload = {
                password_hash: password,
                rememberMe
            };
            if (isEmail) payload.email = identifier;
            else payload.username = identifier;

            const response = await authApi.login(payload);

            if (response && response.token) {
                const { token, role } = response;
                const cookieOptions = rememberMe ? { expires: 30 } : {};
                Cookies.set('token', token, cookieOptions);
                Cookies.set('username', identifier, cookieOptions);
                Cookies.set('role', role, cookieOptions);

                setUser({ username: identifier, role });
                Swal.fire({
                    title: 'Login Successfully!',
                    text: `Welcome back, ${identifier}!`,
                    icon: 'success',
                    confirmButtonText: 'Done'
                });
                navigate('/gallery');
            }
        } catch (error) {
            Swal.fire({
                title: 'Login Error!',
                text: error.response?.data?.message || 'Incorrect username or password.',
                icon: 'error',
                confirmButtonText: 'Done'
            });
        }
    }

    // submit Register
    async function handleRegister() {
        try {
            await authApi.register(username, password, email, 'user', confirmPassword);
            const response = await authApi.login({ username, password_hash: password });
            const { token, role: userRole } = response;

            Cookies.set('token', token);
            Cookies.set('username', username);
            Cookies.set('role', userRole);

            setUser({ username, role: userRole });

            Swal.fire({
                title: 'Signed Up Successfully!',
                text: `User ${username} registered successfully!`,
                icon: 'success',
                confirmButtonText: 'Done'
            });
            navigate('/gallery');
        } catch (error) {
            Swal.fire({
                title: 'Failed to sign up!',
                text: error.response?.data?.message || 'Something went wrong!',
                icon: 'error',
                confirmButtonText: 'Done'
            });
        }
    }

    return (
        <>
            <PublicNavBar
                onLoginClick={() => setIsLogin(true)}
                onSignUpClick={() => setIsLogin(false)}
                isLoginActive={isLogin}
                isSignUpActive={!isLogin}
            />

            <section className="auth-page-main">
                {/* Giữ nguyên cột Art Showcase bên trái (không bị load lại) */}
                <div className="auth-showcase-container">
                    <h2 className="auth-showcase-title">Discover Your Creative Journey</h2>
                    <div className="auth-showcase-grid">
                        <div className="showcase-card tall">
                            <img src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop" alt="Art 1" />
                        </div>
                        <div className="showcase-card square">
                            <img src="https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600&auto=format&fit=crop" alt="Art 2" />
                        </div>
                        <div className="showcase-card wide">
                            <img src="https://i.pinimg.com/1200x/b1/31/99/b13199e4db5f1c83cce20b27d10ef9e1.jpg" alt="Art 3" />
                        </div>
                        <div className="showcase-card square">
                            <img src="https://i.pinimg.com/originals/8e/9f/de/8e9fdefb7413752f3c180049f6e34825.jpg" alt="Art 4" />
                        </div>
                        <div className="showcase-card tall">
                            <img src="https://images.unsplash.com/photo-1578926375605-eaf7559b1458?w=600&auto=format&fit=crop" alt="Art 5" />
                        </div>
                        <div className="showcase-card square">
                            <img src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=600&auto=format&fit=crop" alt="Art 6" />
                        </div>
                    </div>
                </div>

                {/* Cột Form bên phải: Render có điều kiện tùy thuộc vào isLogin */}
                <div className="auth-page-form">
                    <img src="/text.png" alt="Header Text" />

                    {isLogin ? (
                        /* LOGIN */
                        <div className="form-content">
                            <div className="input-group">
                                <p>Username or Email:</p>
                                <input
                                    type="text"
                                    placeholder="Enter Username or Email"
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                />
                            </div>
                            <div className="input-group">
                                <p>Password:</p>
                                <input
                                    type="password"
                                    placeholder="Enter Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div className="checkbox-group">
                                <input
                                    className="auth-page-check-box"
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                <span> Remember me for 30 days </span>
                            </div>

                            <button className="auth-page-sign-up-btn" onClick={handleLogin}>
                                Login
                            </button>

                            <p className="switch-auth-text">
                                Don't have an account?{' '}
                                <span onClick={() => setIsLogin(false)}>Sign Up</span>
                            </p>
                        </div>
                    ) : (
                        /* SIGN UP */
                        <div className="form-content">
                            <div className="input-group">
                                <p>Username:</p>
                                <input
                                    type="text"
                                    placeholder="Enter username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            <div className="input-group">
                                <p>Email:</p>
                                <input
                                    type="email"
                                    placeholder="Enter email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="input-group">
                                <p>Password:</p>
                                <input
                                    type="password"
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div className="input-group">
                                <p>Confirm Password:</p>
                                <input
                                    type="password"
                                    placeholder="Confirm password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>

                            <button className="auth-page-sign-up-btn" onClick={handleRegister}>
                                Sign Up
                            </button>

                            <p className="switch-auth-text">
                                Already have an account?{' '}
                                <span onClick={() => setIsLogin(true)}>Login</span>
                            </p>
                        </div>
                    )}

                    <GoogleAuth setUser={setUser} />
                </div>
            </section>

            <footer className="auth-page-footer">
                <img src="/TextLogo.png" alt="Footer Logo" />
                <p>㋑ Developed by OAC Team</p>
                <div className="Quick-link">
                    <a href="/contact">Contact</a>
                    <a href="/about.html">About</a>
                    <a href="/">Gallery</a>
                </div>
            </footer>
        </>
    )
}