import { Link, NavLink, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useState, useEffect } from 'react';

/**
 * PublicNavBar — Navigation bar for public routes with state toggle support.
 */
export default function PublicNavBar({
    onLoginClick,
    onSignUpClick,
    isLoginActive,
    isSignUpActive,
}) {
    const location = useLocation();

    const token = Cookies.get('token');
    const isLoggedIn = Boolean(token && token !== 'undefined' && token !== 'null' && token.trim() !== '');

    // Helper for non-NavLink items (like custom buttons)
    const isActivePath = (path) => location.pathname === path;

    return (
        <header className="pub-nav-header">
            <div className="pub-nav-container">
                {/* Logo */}
                <Link to="/" className="pub-nav-logo-link">
                    <img className="pub-nav-logo" src="/Logo.png" alt="OnlyArtCollection Logo" />
                </Link>

                {/* Nav links */}
                <nav className="pub-nav-links">
                    <NavLink
                        to="/gallery"
                        className={({ isActive }) => `pub-nav-link ${isActive ? 'active' : ''}`}
                    >
                        Gallery
                    </NavLink>
                    <NavLink
                        to="/"
                        end
                        className={({ isActive }) => `pub-nav-link ${isActive ? 'active' : ''}`}
                    >
                        About
                    </NavLink>
                    <NavLink
                        to="/contact"
                        className={({ isActive }) => `pub-nav-link ${isActive ? 'active' : ''}`}
                    >
                        Contact
                    </NavLink>
                </nav>

                {/* Auth buttons */}
                <div className="pub-nav-auth">
                    {isLoggedIn ? (
                        <Link to="/gallery" className="pub-nav-btn pub-nav-btn--primary">
                            Go to Gallery
                        </Link>
                    ) : (
                        <>
                            {/* Login Button / Link */}
                            {onLoginClick ? (
                                <button
                                    type="button"
                                    className={`pub-nav-btn ${isLoginActive ? 'active' : ''}`}
                                    onClick={onLoginClick}
                                >
                                    Login
                                </button>
                            ) : (
                                <Link
                                    to="/register"
                                    className={`pub-nav-btn ${isActivePath('/register') ? 'active' : ''}`}
                                >
                                    Login
                                </Link>
                            )}

                            {/* Sign Up Button / Link */}
                            {onSignUpClick ? (
                                <button
                                    type="button"
                                    className={`pub-nav-btn ${isSignUpActive ? 'active' : ''}`}
                                    onClick={onSignUpClick}
                                >
                                    Sign Up
                                </button>
                            ) : (
                                <Link
                                    to="/register"
                                    className={`pub-nav-btn ${isActivePath('/register') ? 'active' : ''}`}
                                >
                                    Sign Up
                                </Link>
                            )}
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}