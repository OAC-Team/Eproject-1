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
import CollectionPage from './pages/CollectionPage';
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
          <Route path='/collections/:collection_id' element={<CollectionPage />}/>

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
