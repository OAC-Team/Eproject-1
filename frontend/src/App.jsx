import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import Profile from './pages/Profile';
import { BrowserRouter, Routes, Route, Link, useNavigate, Outlet } from 'react-router-dom';
import Home from './pages/Home';
import GalleryView from './pages/GalleryView';
import { useState, useEffect } from 'react';
import './App.css';

function GalleryLayout() {
  return (
    <div className="root">
      <div className="wrapper">
        <aside>
          <a href="/">
            <img className="logo" src="https://i.postimg.cc/cLxRDMHf/image-1(1).png" alt="" />
          </a>
        </aside>
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

function App() {
  const [user, setUser] = useState(null);

  return (
    <>
      <Routes>
        <Route path='/login' element={<LoginPage setUser={setUser} />} />
        <Route path='/register' element={<SignUpPage setUser={setUser} />} />
        <Route element={<GalleryLayout />}>

          <Route path='/' element={<Home />} />
          <Route path='/gallery' element={<Home />} />
          <Route path='/profile' element={<Profile />} />
        </Route>
      </Routes>
    </>
  )
}

export default App;
