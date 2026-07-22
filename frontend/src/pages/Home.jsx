import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import userApi from '../api/userApi'
import paintingApi from '../api/paintingApi'
import { Link, Outlet } from 'react-router-dom'
import GalleryView from './GalleryView'
import LogOut from '../components/LogOut'
import NavBar from '../components/NavBar'

export default function Home() {
    const [userData, setUserData] = useState({})
    const [isOpen, setIsOpen] = useState(false);
    const [paintings, setPaintings] = useState([]);
    const token = Cookies.get('token');

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {

        (async () => {
            const responseData = await userApi.fetchUser(token);
            if (responseData.userData) {
                setUserData(responseData.userData);
                {/* setUserPaintings(responseData.userPaintings); */}
            } else {
                setUserData({ username: 'Guest User', role: 'guest' });
            }

            const fetchedPaintings = await paintingApi.getAllPaintings()
            if (fetchedPaintings) {
                setPaintings(fetchedPaintings.paintings)
            }
        })()
    }, [])

    return (
        <>
            <main className="main">
                {/* Utility bar */}
                {/* <NavBar /> */}

                {/* Images Gallery */}
                {userData && <GalleryView paintings={paintings} user={userData} token={token} />}
            </main>
        </>
    )
}