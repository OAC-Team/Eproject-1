<<<<<<< HEAD
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
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
        <Link to="/login" >Login </Link>
        <Link to="/register" >Sign Up</Link>
      </div>
      <Routes>
        <Route path='/login' element={<LoginPage setUser={setUser} />} />
        <Route path='/register' element={<SignUpPage setUser={setUser} />} />
      </Routes>
    </>
  )
}

export default App;
=======
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import Profile from './pages/Profile';
import BoardManager from './components/BoardManager';
import PaintingView from './pages/PaintingView';
import { BrowserRouter, Routes, Route, Link, useNavigate, Outlet } from 'react-router-dom';
import Home from './pages/Home';
import GalleryView from './pages/GalleryView';
import NavBar from './components/NavBar';
import ContactPage from './pages/ContactPage';
import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  return (
    <>
      <Routes>
        <Route path='/login' element={<LoginPage setUser={setUser} />} />
        <Route path='/register' element={<SignUpPage setUser={setUser} />} />
        <Route path='/contact' element={<ContactPage />} />
        <Route element={<GalleryLayout />}>

          <Route path='/' element={<Home />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/boards' element={<BoardManager />} />
          <Route path='/gallery/:painting_id' element={<PaintingView />} />

        </Route>
      </Routes>
    </>
  )
}

function GalleryLayout() {
  return (
    <div className="root">
      <div className="wrapper">
        <aside>
          <a href="/">
            <img className="logo" src="https://i.postimg.cc/cLxRDMHf/image-1(1).png" alt="" />
          </a>
          <div className="sidebar-icon">
            <a href="/">
              <img className="home-icon" src="/home.svg" alt="" />
            </a>
            <a href="/">
              <img className="favorite-icon" src="/favorite.svg" alt="" />
            </a>
            <a href="/">
              <img className="add-icon" src="/add.svg" alt="" />
            </a>
          </div>
        </aside>
        <main>
          <div>
            <NavBar />
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}


export default App;
>>>>>>> origin/main
