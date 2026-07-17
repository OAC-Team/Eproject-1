import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import userApi from '../api/userApi'
import { Link } from 'react-router-dom'
import LogOut from '../components/LogOut'
import { useNavigate, useLocation } from 'react-router-dom'

export default function NavBar() {
    const [userData, setUserData] = useState({})
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState('')

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

    function handleSearchKeyDown(e) {
        if (e.key === 'Enter') {
            const query = searchQuery.trim();
            if (query.includes("/collections")) {
                navigate(`${location.pathname}?search=${encodeURIComponent(query)}`);
            } else {
                navigate(`/?search=${encodeURIComponent(query)}`);
            }
        }
    }

    return (
        <div className="access-bar">
            <input
                className="search-bar"
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                onFocus={(e) => {
                    if (e.target.value !== "") {
                        e.target.value = ""
                    }
                }}
            />

            <div className="profile-root">
                <div className="profile-frame" onClick={toggleDropdown}>
                    <img className="profile-picture" src={userData?.profile_picture} alt="" />
                    <p className="mb-0 profile-name">{userData?.username}</p>

                    <button className={`expand-btn ${isOpen ? 'active' : ''}`}>
                        <img className="expand-btn-arrow" src="/arrow.png" alt="" />
                    </button>
                </div>
                {userData?.username !== 'Guest User' ?
                    <div className={`dropdown-menu ${isOpen ? 'show' : ''}`}>
                        <Link to="/profile">My Profile</Link>
                        <Link to="/profile/settings">Settings</Link>
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