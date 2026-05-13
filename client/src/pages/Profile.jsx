import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './profile.css';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user.name || '',
    profilePic: user.profilePic || ''
  });
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser(formData);
    setSuccessMsg('Profile updated successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="container">
      <div className="profile-container">
        <div className="profile-header">
          <img src={formData.profilePic || 'https://via.placeholder.com/150'} alt="Profile" />
          <div>
            <h2>My Profile</h2>
            <p>Manage your account settings</p>
          </div>
        </div>

        {successMsg && <div style={{color: 'green', marginBottom: '15px', fontWeight: 'bold'}}>{successMsg}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Display Name</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Profile Picture URL</label>
            <input 
              type="url" 
              name="profilePic" 
              value={formData.profilePic} 
              onChange={handleChange} 
              placeholder="https://example.com/my-image.jpg"
            />
          </div>
          <button type="submit" className="btn" style={{width: '100%'}}>Save Changes</button>
        </form>
      </div>
    </div>
  );
};

export default Profile;