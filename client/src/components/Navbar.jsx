import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './navbar.css';

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <Link to="/" style={{textDecoration: 'none'}}>
        <h2>Custom Greetings</h2>
      </Link>
      <div className="nav-profile">
        {user.isPremium && <span style={{color: '#d4af37', fontWeight: 'bold'}}>👑 Premium</span>}
        
        {/* Clickable profile section */}
        <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'inherit' }}>
          <img src={user.profilePic} alt="Profile" className="profile-img" />
          <span style={{fontWeight: 'bold'}}>{user.name}</span>
        </Link>
        
        <button className="btn" onClick={handleLogout} style={{background: '#dc3545', padding: '6px 12px'}}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;