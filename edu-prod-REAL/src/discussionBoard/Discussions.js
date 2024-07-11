import React from 'react';
import { useNavigate } from 'react-router-dom';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f7f7f7',
    padding: '20px',
    boxSizing: 'border-box',
  },
  header: {
    fontSize: '3rem',
    color: '#333',
    marginBottom: '20px',
  },
  button: {
    padding: '10px 20px',
    borderRadius: '20px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  searchBar: {
    width: '100%',
    maxWidth: '600px',
    padding: '10px',
    borderRadius: '20px',
    border: '1px solid #ccc',
    marginBottom: '20px',
    fontSize: '1rem',
  },
};

const Discussions = () => {
  const navigate = useNavigate();

  const handleNewDiscussion = () => {
    // Navigate to the new discussion creation page (to be implemented)
    navigate('/new-discussion');
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Discussions</h1>
      <button style={styles.button} onClick={handleNewDiscussion}>New Discussion</button>
      <input type="text" placeholder="Search discussions..." style={styles.searchBar} />
    </div>
  );
};

export default Discussions;
