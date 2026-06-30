import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';

export default function LogOut({ setUser }) {
    const navigate = useNavigate();

    async function handleLogout() {
        try {
            const check = Swal.fire({
                title: 'Are you sure?',
                text: 'Are you sure to logout!',
                icon: 'warning',
                confirmButtonText: 'Log out',
                showCancelButton: true,
                cancelButtonText: 'Cancel'
            })

            if ((await check).isConfirmed) {
                Cookies.remove('token');
                Cookies.remove('username');
                Cookies.remove('email');
                Cookies.remove('role');
                setUser(null);
                navigate('/');
            }
        } catch (error) {
            console.error('Error system', error);
        }
    };
    
    return(
        <button onClick={handleLogout}>Log Out</button>
    )
}