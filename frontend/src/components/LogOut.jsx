import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export default function LogOut({ setUser }) {
    const navigate = useNavigate();

    async function handleLogout(e) {
        e.preventDefault();
        try {
            const check = await Swal.fire({
                title: 'Are you sure you want to log out?',
                text: "You will need to sign back in to access your account.",
                imageUrl: 'https://i.postimg.cc/Gmt3rPtD/attention-square-(1).png',
                imageHeight: 80,
                imageWidth: 80,
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Log out!',
                cancelButtonText: 'Cancel',
                customClass: {
                    popup: 'logout-popup',
                    confirmButton: 'logout-confirm-btn',
                    cancelButton: 'logout-cancel-btn'
                }
            })

            if (check.isConfirmed) {
                Cookies.remove('token');
                Cookies.remove('username');
                Cookies.remove('email');
                Cookies.remove('role');
                setUser({ username: "Guest User", profile_picture: '' });
                navigate('/')
            }
        } catch (error) {
            console.error('Error system', error);
        }
    };

    return (
        <a href="#" className="logout-btn" style={{ textDecoration: 'none', color: 'inherit' }} onClick={handleLogout}>Log Out</a>
    )
}