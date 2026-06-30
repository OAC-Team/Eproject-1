import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import Profile from './pages/Profile';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import LogOut from './components/LogOut';
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
        <Route path='/profile' element={<Profile />} />
      </Routes>
    </>
  )
}

export default App;
