// src/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (err) {
      alert('Invalid credentials');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#000', color: '#fff' }}>
      <h1 style={{ fontFamily: 'Impact', fontSize: '5rem', color: '#ff4d4f', marginBottom: '1.5rem' }}>Edu-Prodigi</h1>
      <h2 style={{ marginBottom: '1.5rem' }}>Login</h2>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '300px' }}>
        <div style={{ marginBottom: '1rem', width: '100%' }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
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
        <button type="submit" style={{ padding: '10px 20px', borderRadius: '20px', border: 'none', backgroundColor: '#ff4d4f', color: '#fff', cursor: 'pointer', fontSize: '1rem' }}>Login</button>
      </form>
      <button onClick={() => navigate('/register')} style={{ marginTop: '1rem', padding: '10px 20px', borderRadius: '20px', border: 'none', backgroundColor: '#333', color: '#fff', cursor: 'pointer', fontSize: '1rem' }}>Register</button>
    </div>
  );
};

export default Login;
