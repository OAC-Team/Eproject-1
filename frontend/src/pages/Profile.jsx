import { useState, useEffect } from "react";
import Cookies from 'js-cookie'
import userApi from '../api/userApi'
import Collections from "../components/Collections";

export default function Profile() {
    const [userData, setUserData] = useState({});
    const [isGuest, setIsGuest] = useState(false)

    useEffect(() => {
        const token = Cookies.get('token');
    
        (async () => {
            const newUserData = await userApi.fetchUser(token);
            // console.log(newUserData);
            // console.log(newUserData.collections);
            if (newUserData) {
                setUserData(newUserData);
                setIsGuest(false);
            } else {
                setUserData({ username: 'Guest User', role: 'guest' });
                setIsGuest(true);
            }
        })()
    }, [])

    return (
        <div>
            <h4>{userData.username} ({userData.role})</h4>
            {isGuest === false ? (
                <Collections collectionData={userData.collections} />
            ) : (
                <div>
                    <p>Cannot manage collections with current user.</p>
                </div>
            )}
        </div>
    )
}