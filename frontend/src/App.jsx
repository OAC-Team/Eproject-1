import SignUpPage from './pages/SignUpPage';
import AboutOnlyArtCollectionPage from './pages/AboutOnlyArtCollectionPage';
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
import AdminLoginPage from './pages/AdminLoginPage'
import PendingListPage from './pages/PendingListPage';
import '@fontsource/cascadia-code';
import './App.css';
import AdminDashboardPage from './pages/AdminDashboardPage';
import 'bootstrap-icons/font/bootstrap-icons.css';
import CreatePaintingPage from './pages/CreatePaintingPage';
import RejectedListPage from './pages/RejectedListPage';
import SettingsPage from './pages/SettingsPage';
import ChatWidget from './components/ChatWidget';
import ViewUser from './components/ViewUser';


function App() {
  const [user, setUser] = useState(null);

  return (
    <>
      <Routes>
        <Route path='/admin/login' element={<AdminLoginPage setUser={setUser} />} />
        <Route path='/admin/dashboard' element={<AdminDashboardPage setUser={setUser} />}>
          <Route path='/admin/dashboard/pendingList' element={<PendingListPage />} />
          <Route path='/admin/dashboard/rejectList' element={<RejectedListPage />} />
        </Route>

        <Route path='/viewUserProfile/:user_id' element={<ViewUser />} />
        <Route path='/login' element={<LoginPage setUser={setUser} />} />
        <Route path='/register' element={<SignUpPage setUser={setUser} />} />
        <Route path='/contact' element={<ContactPage />} />
        <Route path='/' element={<AboutOnlyArtCollectionPage />} />
        <Route element={<GalleryLayout />}>


          <Route path='/gallery' element={<Home />} />
          <Route path='/createPainting' element={<CreatePaintingPage />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/boards' element={<BoardManager />} />
          <Route path='/gallery/:painting_id' element={<PaintingView />} />
          <Route path='/collections/:collection_id' element={<CollectionPage />} />

        </Route>

        <Route element={<SettingsLayout />}>

          <Route path='/profile/settings' element={<SettingsPage />} />

        </Route>

      </Routes>
      <ChatWidget></ChatWidget>
    </>
  )
}

function GalleryLayout() {
  return (
    <div className="root">
      <div className="wrapper">
        <aside>
          <Link to="/">
            <img className="logo" src="https://i.postimg.cc/cLxRDMHf/image-1(1).png" alt="" />
          </Link>
          <div className="sidebar-icon">
            <Link to="/gallery">
              <i className='bi bi-house'></i>
            </Link>
            <Link to="/gallery">
              <img className="favorite-icon" src="/favorite.svg" alt="" />
            </Link>
            <Link to="/createPainting">
              <i className="bi bi-plus-square"></i>
            </Link>
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

function SettingsLayout() {
  return (
    <div>
      <div className="wrapper">
        <aside>
          <Link to="/">
            <img className="logo" src="https://i.postimg.cc/cLxRDMHf/image-1(1).png" alt="" />
          </Link>
          <div className="sidebar-icon">
            <Link to="/gallery">
              <i className='bi bi-house'></i>
            </Link>
            <Link to="/gallery">
              <img className="favorite-icon" src="/favorite.svg" alt="" />
            </Link>
            <Link to="/createPainting">
              <i className="bi bi-plus-square"></i>
            </Link>
          </div>
        </aside>
        <main className="settings-main">
          <div>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}



export default App;
