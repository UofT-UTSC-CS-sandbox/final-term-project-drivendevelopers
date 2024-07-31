import React, { useState } from 'react';
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
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '600px',
  },
  input: {
    padding: '10px',
    margin: '10px 0',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '1rem',
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
    marginTop: '20px',
  },
};

const NewDiscussion = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    images.forEach((image) => formData.append('images', image));

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/discussions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to create new discussion');
      }

      navigate('/discussions');
    } catch (error) {
      console.error('Error creating new discussion:', error);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>New Discussion</h1>
      <form style={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={styles.input}
          rows="5"
          required
        ></textarea>
        <input
          type="file"
          multiple
          onChange={handleImageChange}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Publish</button>
      </form>
    </div>
  );
};

export default NewDiscussion;
