import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export default function LogOut({ setUser }) {
    const navigate = useNavigate();

    async function handleLogout(e) {
        e.preventDefault();
        try {
            const check = await Swal.fire({
                title: 'Are you sure?',
                text: 'Are you sure to logout!',
                icon: 'warning',
                confirmButtonText: 'Log out',
                showCancelButton: true,
                cancelButtonText: 'Cancel'
            })

            if (check.isConfirmed) {
                Cookies.remove('token');
                Cookies.remove('username');
                Cookies.remove('email');
                Cookies.remove('role');
                setUser({username: "Guest User", profile_picture: ''});
                navigate('/')
            }
        } catch (error) {
            console.error('Error system', error);
        }
    };

    return(
        <a href="#" className="logout-btn" onClick={handleLogout}>Log Out</a>
    )
}