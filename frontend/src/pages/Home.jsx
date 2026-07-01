import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import userApi from '../api/userApi'
import paintingApi from '../api/paintingApi'
import { Link, Outlet } from 'react-router-dom'
import GalleryView from './GalleryView'
import LogOut from '../components/LogOut'

export default function Home() {
    const [userData, setUserData] = useState({})
    const [isOpen, setIsOpen] = useState(false);
    const [paintings, setPaintings] = useState([])

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const token = Cookies.get('token');

        (async () => {
            const newUserData = await userApi.fetchUser(token);
            if (newUserData) {
                setUserData(newUserData);
            } else {
                setUserData({ username: 'Guest User', role: 'guest' });
            }

            const fetchedPaintings = await paintingApi.getAllPaintings()
            if (fetchedPaintings) {
                setPaintings(fetchedPaintings)
            }
        })()
    }, [])

    return (
        <>
            <main className="main">
                {/* Utility bar */}
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
                                <LogOut setUser={setUserData}/>
                            </div>
                            :
                            <div className={`dropdown-menu ${isOpen ? 'show' : ''}`}>
                                <a href="/login">Log In</a>
                                <a href="/register">Sign Up</a>
                            </div>
                        }
                    </div>
                </div>

                {/* Images Gallery */}
                {userData && <GalleryView paintings={paintings} />}
            </main>
        </>
    )
}