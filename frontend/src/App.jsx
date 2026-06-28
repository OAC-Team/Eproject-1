import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import Profile from './pages/Profile';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';

function App() {
  const [user, setUser] = useState(null);
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
        Cookies.remove('role');
        setUser(null);
        navigate('/');
      }
    } catch (error) {
      console.error('Error system', error);
    }
  };

  return (
    <>
      <div>
        <Link to="/login">Login </Link>
        <Link to="/register">Sign Up</Link>
        <Link to="/profile">Your Profile</Link>
      </div>
      <Routes>
        <Route path='/login' element={<LoginPage setUser={setUser} />} />
        <Route path='/register' element={<SignUpPage setUser={setUser} />} />
        <Route path='/profile' element={<Profile />} />
      </Routes>
    </>
  )
}

export default App;
