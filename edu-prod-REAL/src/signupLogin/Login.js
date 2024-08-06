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
    backgroundColor: '#f7f7f7',  // Matched background color with Dashboard
    color: '#000',  // Matched text color with Dashboard
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
    color: '#555',  // Matched subtitle color with Dashboard
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
    backgroundColor: '#fff',  // Matched input background with Dashboard
    color: '#000',  // Matched input text color with Dashboard
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
  registerButton: {
    marginTop: '1rem',
    padding: '10px 20px',
    borderRadius: '20px',
    border: 'none',
    backgroundColor: '#555',  // Matched color with Dashboard theme
    color: '#fff',
    cursor: 'pointer',
    fontSize: '1rem',
    width: '15%',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',  // Added slight shadow for consistency
  },
};

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
    <div style={styles.container}>
      <h1 style={styles.title}>Edu-Prodigi</h1>
      <h2 style={styles.subtitle}>A resource for students.</h2>
      <h2>Login</h2>
      <form onSubmit={handleLogin} style={styles.formContainer}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
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
        <button type="submit" style={styles.button}>Login</button>
      </form>
      <button onClick={() => navigate('/register')} style={styles.registerButton}>Register</button>
    </div>
  );
};

export default Login;
