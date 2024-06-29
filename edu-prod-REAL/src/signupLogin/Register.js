// src/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!email.endsWith('@mail.utoronto.ca')) {
      alert('Email must be from the domain @mail.utoronto.ca');
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      await axios.post('http://localhost:5000/register', { email, password, confirmPassword });
      alert('Registration successful');
      navigate('/');
    } catch (err) {
      alert('Error registering user');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#000', color: '#fff' }}>
      <h1 style={{ fontFamily: 'Impact', fontSize: '5rem', color: '#ff4d4f', marginBottom: '.2rem' }}>Edu-Prodigi</h1>
      <h1 style={{ fontFamily: 'cursive', fontSize: '2rem', color: '#FFFFFF', marginBottom: '1.5rem' }}>A resource for students.</h1>
      <h2 style={{ marginBottom: '1.5rem' }}>Register</h2>
      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '300px' }}>
        <div style={{ marginBottom: '1rem', width: '100%' }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email (must be @mail.utoronto.ca)"
            style={{ padding: '10px', borderRadius: '20px', border: 'none', width: '100%', marginBottom: '0.5rem', backgroundColor: '#333', color: '#fff' }}
            required
          />
        </div>
        <div style={{ marginBottom: '1rem', width: '100%' }}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            style={{ padding: '10px', borderRadius: '20px', border: 'none', width: '100%', marginBottom: '0.5rem', backgroundColor: '#333', color: '#fff' }}
            required
          />
        </div>
        <div style={{ marginBottom: '1rem', width: '100%' }}>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            style={{ padding: '10px', borderRadius: '20px', border: 'none', width: '100%', marginBottom: '0.5rem', backgroundColor: '#333', color: '#fff' }}
            required
          />
        </div>
        <button type="submit" style={{ padding: '10px 20px', borderRadius: '20px', border: 'none', backgroundColor: '#ff4d4f', color: '#fff', cursor: 'pointer', fontSize: '1rem' }}>Register</button>
      </form>
      <button onClick={() => navigate('/')} style={{ marginTop: '1rem', padding: '10px 20px', borderRadius: '20px', border: 'none', backgroundColor: '#333', color: '#fff', cursor: 'pointer', fontSize: '1rem' }}>Back to Login</button>
    </div>
  );
};

export default Register;
