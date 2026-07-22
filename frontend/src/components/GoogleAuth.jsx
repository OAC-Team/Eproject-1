import authApi from "../api/authApi";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie'
import { GoogleLogin } from '@react-oauth/google';


export default function GoogleAuth({setUser}) {
    const navigate = useNavigate();

    async function handleGoogleLoginSuccess(credentialResponse) {
        try {
            const googleToken = credentialResponse.credential;
            const response = await authApi.googleLogin(googleToken)

            if (response && response.token) {
                const { token, role, username } = response;

                Cookies.set('token', token);
                Cookies.set('username', username);
                Cookies.set('role', role);

                setUser({ username, role });
                Swal.fire({
                    title: 'Login Successfully With Google!',
                    text: `Wellcome ${username}!`,
                    icon: 'success',
                    confirmButtonText: 'Done'
                })

                navigate('/');
            }
        } catch (error) {
            console.error('Error to login with Google!', error);
            Swal.fire({
                title: 'Login Error!',
                text: error.response?.data?.message || `Google Login failed.`,
                icon: 'error',
                confirmButtonText: 'Done'
            })
        }
    };

    async function handleGoogleLoginError() {
        console.error('Google Login Failed');
    };

    return (
        <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={handleGoogleLoginError}
            theme="filled"
            size="large"
            width="330"
            text="continue_with"
            logo_alignment="center"
            locale="en"
            ux_mode="popup"
            shape="pill"
            useOneTap="true"/>
    )
}