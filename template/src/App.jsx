import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Templates from './pages/Templates.jsx';
import Signup from './components/Signup.jsx';
import Login from './components/Login.jsx';
import FavoritesPage from './pages/FavoritesPage.jsx';
import { FavoritesProvider } from './context/FavoritesContext.jsx';
import { AuthProvider } from './context/authContext.jsx';
import { MdFavorite } from "react-icons/md";
import './App.css';
import { useLocation } from 'react-router-dom';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorage = () => setIsAuthenticated(!!localStorage.getItem('token'));
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleLogin = () => setIsAuthenticated(true);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };
  const location = useLocation();
  const currentPath = location.pathname;
  return (
    <AuthProvider>
      <FavoritesProvider>
        <nav className="navbar" style={{justifyContent:'space-between', alignItems:'center'}}>
          <Link to="/">Templates Hub</Link>
          <div style={{display:'flex',gap:'20px', alignItems:'center'}}>
            {isAuthenticated && <Link to="/favorites">Favorites</Link>}
            {!isAuthenticated && (
              <>
                {currentPath==="/signup"?
                  <Link to="/login">Login</Link>:
                  <Link to="/signup">Signup</Link>
                }
              </>
            )}
            {isAuthenticated && (
              <button onClick={handleLogout} style={{ marginLeft: '1rem' }}>
                Logout
              </button>
            )}
          </div>
        </nav>
        <div className="app-main-container">
          <Routes>
            <Route path="/" element={<Templates isAuthenticated={isAuthenticated} />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/favorites" element={<FavoritesPage />} />
          </Routes>
        </div>
      </FavoritesProvider>
    </AuthProvider>
  );
}

export default App;
