import AboutOnlyArtCollectionPage from './pages/AboutOnlyArtCollectionPage';
import Profile from './pages/Profile';
import BoardManager from './components/BoardManager';
import PaintingView from './pages/PaintingView';
import { Routes, Route, Link, Outlet } from 'react-router-dom';
import Home from './pages/Home';
import NavBar from './components/NavBar';
import ContactPage from './pages/ContactPage';
import CollectionPage from './pages/CollectionPage';
import { useState } from 'react';
import AdminLoginPage from './pages/AdminLoginPage';
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
import UserFavorites from './pages/UserFavorites';
import ProtectedRoute from './components/ProtectedRoutes';
import AuthPage from './pages/AuthPage';

function App() {
  const [user, setUser] = useState(null);

  return (
    <Routes>
      {/* Admin Routes */}
      <Route path='/admin/login' element={<AdminLoginPage setUser={setUser} />} />
      <Route path='/admin/dashboard' element={<AdminDashboardPage setUser={setUser} />}>
        <Route path='/admin/dashboard/pendingList' element={<PendingListPage />} />
        <Route path='/admin/dashboard/rejectList' element={<RejectedListPage />} />
      </Route>

      {/* Public Routes */}
      <Route path='/register' element={<AuthPage setUser={setUser} />} />
      <Route path='/contact' element={<ContactPage />} />
      <Route path='/' element={<AboutOnlyArtCollectionPage />} />

      {/* Protected Routes (Yêu cầu đăng nhập) */}
      <Route element={<ProtectedRoute />}>
        <Route path='/viewUserProfile/:user_id' element={<ViewUser />} />
        
        {/* Layout ứng dụng chính */}
        <Route element={<GalleryLayout />}>
          <Route path='/gallery' element={<Home />} />
          <Route path='/createPainting' element={<CreatePaintingPage />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/boards' element={<BoardManager />} />
          <Route path='/gallery/favorites' element={<UserFavorites />} />
          <Route path='/gallery/:painting_id' element={<PaintingView />} />
          <Route path='/collections/:collection_id' element={<CollectionPage />} />
        </Route>

        {/* Layout Cài đặt */}
        <Route element={<SettingsLayout />}>
          <Route path='/profile/settings' element={<SettingsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

function GalleryLayout() {
  return (
    <div className="root">
      <div className="wrapper">
        <aside>
          <Link to="/">
            <img className="logo" src="https://i.postimg.cc/cLxRDMHf/image-1(1).png" alt="Logo" />
          </Link>
          <div className="sidebar-icon">
            <Link to="/gallery">
              <i className='bi bi-house'></i>
            </Link>
            <Link to="/gallery/favorites">
              <img className="favorite-icon" src="/favorite.svg" alt="Favorites" />
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
      {/* ChatWidget được đặt ở đây để hiển thị riêng trong các trang đã đăng nhập */}
      <ChatWidget />
    </div>
  );
}

function SettingsLayout() {
  return (
    <div className="wrapper">
      <aside>
        <Link to="/">
          <img className="logo" src="https://i.postimg.cc/cLxRDMHf/image-1(1).png" alt="Logo" />
        </Link>
        <div className="sidebar-icon">
          <Link to="/gallery">
            <i className='bi bi-house'></i>
          </Link>
          <Link to="/gallery/favorites">
            <img className="favorite-icon" src="/favorite.svg" alt="Favorites" />
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
      <ChatWidget />
    </div>
  );
}

export default App;