import React, { useState, useEffect } from 'react';
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
    color: '#ff4d4f',
    marginBottom: '1.5rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '300px',
  },
  formGroup: {
    marginBottom: '1rem',
    width: '100%',
  },
  formLabel: {
    marginBottom: '0.5rem',
    fontSize: '1.2rem',
  },
  formInput: {
    padding: '10px',
    borderRadius: '20px',
    border: 'none',
    width: '100%',
    marginBottom: '0.5rem',
    backgroundColor: '#333',
    color: '#fff',
  },
  formButton: {
    padding: '10px 20px',
    borderRadius: '20px',
    border: 'none',
    backgroundColor: '#ff4d4f',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '1rem',
    marginTop: '1rem',
  },
  backButton: {
    padding: '10px 20px',
    borderRadius: '20px',
    border: 'none',
    backgroundColor: '#333',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '1rem',
    marginTop: '1rem',
  },
};

const EditProfileForm = () => {
  const [programName, setProgramName] = useState('');
  const [yearOfStudy, setYearOfStudy] = useState('');
  const [fullName, setFullName] = useState('');
  const [gpa, setGpa] = useState('');
  const [description, setDescription] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/profile', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile data');
      }

      const data = await response.json();
      setFullName(data.fullName);
      setProgramName(data.programName);
      setYearOfStudy(data.yearOfStudy);
      setGpa(data.gpa);
      setDescription(data.description);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('fullName', fullName);
      formData.append('programName', programName);
      formData.append('yearOfStudy', yearOfStudy);
      formData.append('gpa', gpa);
      formData.append('description', description);

      if (profilePicture) {
        formData.append('profilePicture', profilePicture);
      }

      const response = await fetch('http://localhost:5000/api/profile', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      navigate('/profile-view');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleFileChange = (event) => {
    setProfilePicture(event.target.files[0]);
  };

  const handleBack = () => {
    navigate('/profile-view');
  };

  return (
    <div style={styles.formContainer}>
      <h1 style={styles.formTitle}>Edit Profile</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.formLabel}>Full Name:</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            style={styles.formInput}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.formLabel}>Program Name:</label>
          <input
            type="text"
            value={programName}
            onChange={(e) => setProgramName(e.target.value)}
            style={styles.formInput}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.formLabel}>Year of Study:</label>
          <input
            type="text"
            value={yearOfStudy}
            onChange={(e) => setYearOfStudy(e.target.value)}
            style={styles.formInput}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.formLabel}>GPA:</label>
          <input
            type="text"
            value={gpa}
            onChange={(e) => setGpa(e.target.value)}
            style={styles.formInput}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.formLabel}>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ ...styles.formInput, height: '100px', resize: 'none' }}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.formLabel}>Profile Picture:</label>
          <input type="file" onChange={handleFileChange} />
        </div>
        <button type="submit" style={styles.formButton}>
          Save
        </button>
        <button type="button" onClick={handleBack} style={styles.backButton}>
          Back to Profile
        </button>
      </form>
    </div>
  );
};

export default EditProfileForm;
