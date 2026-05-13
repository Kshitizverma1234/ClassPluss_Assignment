import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import './login.css';

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  
  const { loginUser, loginGuest } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const endpoint = isRegistering ? '/api/auth/register' : '/api/auth/login';
    
    try {
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        loginUser(data.user, data.token);
        navigate('/'); 
      } else {
        setError(data.message || 'Authentication failed');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      const data = await res.json();
      if (res.ok) {
        loginUser(data.user, data.token);
        navigate('/');
      } else {
        setError('Google authentication failed.');
      }
    } catch (err) {
      setError('Server error during Google authentication.');
    }
  };

  const handleGuest = () => {
    loginGuest();
    navigate('/');
  };

  return (
    <div className="auth-box">
      <h2>{isRegistering ? 'Create an Account' : 'Welcome to Greetings'}</h2>

      {error && <div className="error-text">{error}</div>}

      <button className="btn guest-btn" style={{width: '100%'}} onClick={handleGuest}>
        Continue as Guest
      </button>

      <form className="auth-form" onSubmit={handleSubmit}>
        {isRegistering && (
          <input type="text" name="name" placeholder="Full Name" className="auth-input" onChange={handleChange} required />
        )}
        <input type="email" name="email" placeholder="Email" className="auth-input" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" className="auth-input" onChange={handleChange} required />
        <button type="submit" className="btn">
          {isRegistering ? 'Sign Up' : 'Login with Email'}
        </button>
      </form>

      <p className="auth-switch" onClick={() => setIsRegistering(!isRegistering)}>
        {isRegistering ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
      </p>

      <hr className="divider" />

      <div className="google-wrapper">
        <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setError('Google Login was unsuccessful.')} />
      </div>
    </div>
  );
};

export default Login;