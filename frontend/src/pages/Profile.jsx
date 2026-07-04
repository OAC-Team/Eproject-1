import { useState, useEffect } from "react";
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import userApi from '../api/userApi';
import uploadApi from '../api/uploadApi'
import Collections from "../components/Collections";
import UserUploads from "../components/UserUploads";
import paintingApi from '../api/paintingApi'

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

    useEffect(() => {
        const token = Cookies.get('token');

        (async () => {
            const responseData = await userApi.fetchUser(token);
            if (responseData.userData) {
                setUserData(responseData.userData);
                setUserPaintings(responseData.userPaintings);
            } else {
                setUserData({ username: 'Guest User', role: 'guest' });
                setUserPaintings([]);
            }

            const fetchedPaintings = await paintingApi.getAllPaintings()
            if (fetchedPaintings) {
                setPaintings(fetchedPaintings.paintings)
            }
        })()
    }, [])

    return (
        <div>
            <div className="profile-user">
                <img src={userData.profile_picture} alt="" />
                <div className="profile-user-info">
                    <h1>{userData.username}</h1>
                    <p>{String(userData.role).charAt(0).toUpperCase() + String(userData.role).slice(1)}</p>
                </div>
            </div>
            <UserUploads paintings={userPaintings}></UserUploads>
            {isGuest === false ? (
                <Collections collectionData={userData.collections} />
            ) : (
                <div>
                    <p>Cannot manage collections with current user.</p>
                </div>
            )}

            <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
                <h2>Uploading</h2>
                <form onSubmit={uploadFileHandle}>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                    />

                    {preview && (
                        <div style={{ marginTop: '15px' }}>
                            <p>Demo pic:</p>
                            <img
                                src={preview}
                                alt="Preview"
                                style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px' }}
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        style={{ marginTop: '15px', display: 'block', width: '100%', padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                    >
                        Upload pic
                    </button>
                </form>

                {message && <p style={{ marginTop: '10px', fontWeight: 'bold' }}>{message}</p>}
            </div>
        </div>
    )
}