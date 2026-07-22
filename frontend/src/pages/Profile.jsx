import { useState, useEffect } from "react";
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import userApi from '../api/userApi';
import uploadApi from '../api/uploadApi'
import Collections from "../components/Collections";
import UserUploads from "../components/UserUploads";
import paintingApi from '../api/paintingApi'
import '../themes/Profile.css'

export default function Profile() {
    const [userData, setUserData] = useState({});
    const [isGuest, setIsGuest] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState('');
    const [message, setMessage] = useState('');
    const [userPaintings, setUserPaintings] = useState([]);

    const handleFileChange = (e) => {

        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const uploadFileHandle = async (e) => {
        e.preventDefault();

        if (selectedFile) {
            try {
                console.log(selectedFile);
                const imagePath = await uploadApi.uploadImage(selectedFile);
                setMessage(imagePath.url);

                Swal.fire({
                    title: 'Success!',
                    text: 'Image uploaded sucessfully!',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });

            } catch (error) {

                const errorMessage = error.response?.data ? error.response.data?.message : 'Something went wrong';

                Swal.fire({
                    title: 'Error!',
                    text: errorMessage,
                    icon: 'error',
                    confirmButtonText: 'Done'
                });
            }
        } else {
            Swal.fire({
                title: 'Warning!',
                text: 'Please select a file.',
                icon: 'warning',
                confirmButtonText: 'OK'
            });
        }
    };

    const token = Cookies.get('token');
    useEffect(() => {

        (async () => {
            const responseData = await userApi.fetchUser(token);
            if (responseData.userData) {
                setUserData(responseData.userData);
                setUserPaintings(responseData.userPaintings);
            } else {
                setUserData({ username: 'Guest User', role: 'guest' });
                setUserPaintings([]);
            }
        })()
    }, [])

    const handleRefreshData = async () => {
        const updatedUser = await userApi.fetchUser(token);
        setUserData(updatedUser);
    };

    return (
        <div>
            <div className="profile-user">
                <img src={userData.profile_picture} alt="" />
                <div className="profile-user-info">
                    <h1>{userData.username}</h1>
                    <p className="profile-user-role">{String(userData.role).charAt(0).toUpperCase() + String(userData.role).slice(1)}</p>
                    {userData?.bio?.length > 0 && <p className="profile-user-bio">"{String(userData.bio)}"</p>}
                </div>
            </div>
            <UserUploads paintings={userPaintings} user={userData}></UserUploads>
            {isGuest === false ? (
                <Collections collectionData={userData.collections} onCollectionAdded={handleRefreshData} />
            ) : (
                <div>
                    <p>Cannot manage collections with current user.</p>
                </div>
            )}

        </div>
    )
}