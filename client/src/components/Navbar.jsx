import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

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
      <Link to="/" className="navbar-brand" style={{ textDecoration: 'none' }}>
        Greetings
      </Link>
      
      <div className="navbar-actions">
        <Link 
          to="/profile" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            textDecoration: 'none', 
            color: 'inherit' 
          }}
          title="Go to Profile"
        >
          <img 
            src={user.profilePic || 'https://via.placeholder.com/32'} 
            alt="Profile" 
            className="nav-profile-pic" 
          />
          <span className="nav-username">{user.name}</span>
        </Link>
        
        <button className="btn btn-secondary" onClick={handleLogout}>Log out</button>
      </div>
    </nav>
  );
};

export default Navbar;