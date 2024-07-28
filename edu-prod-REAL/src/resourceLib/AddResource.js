import React, { useState } from 'react';

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
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '600px',
    padding: '20px',
    borderRadius: '10px',
    backgroundColor: '#fff',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
  label: {
    marginBottom: '10px',
    fontSize: '1rem',
    color: '#333',
  },
  input: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    marginBottom: '20px',
    fontSize: '1rem',
    width: '100%',
  },
  textarea: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    marginBottom: '20px',
    fontSize: '1rem',
    width: '100%',
    height: '100px',
    resize: 'none',
  },
  button: {
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
    alignSelf: 'center',
  },
};

const AddResource = () => {
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/resources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, link, description, tags: tags.split(',').map(tag => tag.trim()) }),
      });

      if (!response.ok) {
        throw new Error('Failed to add resource');
      }

      // Redirect to resource library after successful submission
      window.location.href = '/resource-library';
    } catch (error) {
      console.error('Error adding resource:', error);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Add New Resource</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>
          Title:
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required style={styles.input} />
        </label>
        <label style={styles.label}>
          Link:
          <input type="url" value={link} onChange={(e) => setLink(e.target.value)} required style={styles.input} />
        </label>
        <label style={styles.label}>
          Description:
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required style={styles.textarea}></textarea>
        </label>
        <label style={styles.label}>
          Tags (comma-separated):
          <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} style={styles.input} />
        </label>
        <button type="submit" style={styles.button}>Add Resource</button>
      </form>
    </div>
  );
};

export default AddResource;
