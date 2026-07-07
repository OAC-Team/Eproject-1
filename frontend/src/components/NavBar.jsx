import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import userApi from '../api/userApi'
import { Link } from 'react-router-dom'
import LogOut from '../components/LogOut'

export default function NavBar() {
    const [userData, setUserData] = useState({})
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const token = Cookies.get('token');

        (async () => {
            const responseData = await userApi.fetchUser(token);
            if (responseData && responseData.userData) {
                setUserData(responseData.userData);
            } else {
                setUserData({ username: 'Guest User', role: 'guest' });
            }
        })()
    }, [])

    return (
        <div className="access-bar">
            <input className="search-bar" type="text" placeholder="Search..." />

            <div className="profile-root">
                <div className="profile-frame" onClick={toggleDropdown}>
                    <img className="profile-picture" src={userData?.profile_picture} alt="" />
                    <p className="profile-name">{userData?.username}</p>

                    <button className={`expand-btn ${isOpen ? 'active' : ''}`}>
                        <img className="expand-btn-arrow" src="/arrow.png" alt="" />
                    </button>
                </div>
                {userData?.username !== 'Guest User' ?
                    <div className={`dropdown-menu ${isOpen ? 'show' : ''}`}>
                        <Link to="/profile">My Profile</Link>
                        <a href="#">Settings</a>
                        <a href="#">Something</a>
                        <hr />
                        <LogOut setUser={setUserData} />
                    </div>
                    :
                    <div className={`dropdown-menu ${isOpen ? 'show' : ''}`}>
                        <a href="/login">Log In</a>
                        <a href="/register">Sign Up</a>
                    </div>
                }
            </div>
        </div>
    )
}