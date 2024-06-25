import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const styles = {
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#000',
    color: '#fff',
  },
  formTitle: {
    fontFamily: 'Impact, sans-serif',
    fontSize: '4rem',
    color: '#28a745',
    marginBottom: '1.5rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '300px',
  },
  formGroup: {
    marginBottom: '15px',
    width: '100%',
  },
  formLabel: {
    marginBottom: '5px',
    fontSize: '1.2rem',
  },
  formInput: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  formButton: {
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#28a745',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '1rem',
    marginTop: '20px',
    marginRight: '10px',
  },
  cancelButton: {
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#333',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '1rem',
    marginTop: '20px',
  },
};

const AddProject = () => {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/projects', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectName, description, link }),
      });

      if (response.ok) {
        navigate('/project-list');
      } else {
        console.error('Failed to add project');
      }
    } catch (err) {
      console.error('Error adding project:', err);
    }
  };

  const handleCancel = () => {
    navigate('/project-list');
  };

  return (
    <div style={styles.formContainer}>
      <h1 style={styles.formTitle}>Add Project</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="projectName" style={styles.formLabel}>Project Name:</label>
          <input
            type="text"
            id="projectName"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            style={styles.formInput}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="description" style={styles.formLabel}>Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ ...styles.formInput, height: '100px', resize: 'none' }}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="link" style={styles.formLabel}>Link:</label>
          <input
            type="url"
            id="link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            style={styles.formInput}
            required
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <button type="submit" style={styles.formButton}>Submit</button>
          <button type="button" onClick={handleCancel} style={styles.cancelButton}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default AddProject;
