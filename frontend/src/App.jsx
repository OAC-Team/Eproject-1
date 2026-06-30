import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import Profile from './pages/Profile';
import BoardManager from './components/BoardManager'; 
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
    // Kiểm tra cookie khi load trang
  useEffect(() => {
    const token = Cookies.get('token');
    const username = Cookies.get('username');
    if (token && username) {
      setUser({ username });
    }
  }, []);

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
        <Link to="/boards" style={{ marginRight: 15 }}>My Boards</Link>

         {user && (
          <button onClick={handleLogout} style={{ marginLeft: 10 }}>
            Logout ({user.username})
          </button>
        )}
      </div>
      <Routes>
        <Route path='/login' element={<LoginPage setUser={setUser} />} />
        <Route path='/register' element={<SignUpPage setUser={setUser} />} />
        <Route path='/profile' element={<Profile />} />
         <Route path='/boards' element={<BoardManager />} />

     {/* Trang chủ */}
        <Route path='/' element={
          <div style={{ padding: 20 }}>
            <h1>Welcome to ArtMind AI</h1>
            {user ? (
              <p>Hello, {user.username}! Explore your boards.</p>
            ) : (
              <p>Please login to manage your boards.</p>
            )}
          </div>
        } />
      </Routes>
    </>
  )
}

export default App;
