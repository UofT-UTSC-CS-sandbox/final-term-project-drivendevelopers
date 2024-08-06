import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
//import axios from 'axios';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f7f7f7',  // Matched background color with Dashboard and Login
    color: '#000',  // Matched text color with Dashboard and Login
    padding: '20px',
    boxSizing: 'border-box',
  },
  title: {
    fontFamily: 'Impact',
    fontSize: '5rem',
    color: '#007bff',  // Adjusted color for title
    marginBottom: '0.2rem',
  },
  subtitle: {
    fontFamily: 'cursive',
    fontSize: '2rem',
    color: '#555',  // Matched subtitle color with Dashboard and Login
    marginBottom: '1.5rem',
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '300px',
  },
  input: {
    padding: '10px',
    borderRadius: '20px',
    border: 'none',
    width: '100%',
    marginBottom: '1rem',
    backgroundColor: '#fff',  // Matched input background with Dashboard and Login
    color: '#000',  // Matched input text color with Dashboard and Login
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',  // Added slight shadow for depth
  },
  button: {
    padding: '10px 20px',
    borderRadius: '20px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '1rem',
    marginTop: '1rem',
    width: '100%',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',  // Added slight shadow for consistency
  },
  loginButton: {
    marginTop: '1rem',
    padding: '10px 20px',
    borderRadius: '20px',
    border: 'none',
    backgroundColor: '#555',  // Matched color with Dashboard and Login theme
    color: '#fff',
    cursor: 'pointer',
    fontSize: '1rem',
    width: '15%',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',  // Added slight shadow for consistency
  },
};

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
    <div style={styles.container}>
      <h1 style={styles.title}>Edu-Prodigi</h1>
      <h1 style={styles.subtitle}>A resource for students.</h1>
      <h2>Register</h2>
      <form onSubmit={handleRegister} style={styles.formContainer}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email (must be @mail.utoronto.ca)"
          style={styles.input}
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          style={styles.input}
          required
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          style={styles.input}
          required
        />
        <button type="submit" style={styles.button}>Register</button>
      </form>
      <button onClick={() => navigate('/')} style={styles.loginButton}>Back to Login</button>
    </div>
  );
};

export default Register;
