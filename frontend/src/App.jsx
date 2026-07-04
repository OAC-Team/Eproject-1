import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import Profile from './pages/Profile';
import BoardManager from './components/BoardManager';
import { BrowserRouter, Routes, Route, Link, useNavigate, Outlet } from 'react-router-dom';
import Home from './pages/Home';
import GalleryView from './pages/GalleryView';
import ContactPage from './pages/ContactPage';
import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  return (
    <>
      <div>


        {user
          ? (
            <div>
              <span>Hi {user.username}</span>
              <Link to="/profile">Your Profile</Link>
              <LogOut setUser={setUser} />
            </div>
          ) : (
            <div>
              <Link to="/login">Login </Link>
              <Link to="/register">Sign Up</Link>
            </div>
          )}
      </div>
      <Routes>
        <Route path='/login' element={<LoginPage setUser={setUser} />} />
        <Route path='/register' element={<SignUpPage setUser={setUser} />} />
        <Route path='/contact' element={<ContactPage />} />
        <Route element={<GalleryLayout />}>

          <Route path='/' element={<Home />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/boards' element={<BoardManager />} />
        </Route>
      </Routes>
    </>
  )
}

export default App;
