// src/profile/ProfileView.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const styles = {
  profileContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f7f7f7',
    color: '#000',
    padding: '20px',
    boxSizing: 'border-box',
  },
  profilePanel: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '20px',
    maxWidth: '600px',
    width: '100%',
    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
  },
  profileTitle: {
    fontSize: '3rem',
    color: '#333',
    marginBottom: '20px',
  },
  profileDetails: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  profileItem: {
    marginBottom: '0.5rem',
    fontSize: '1.2rem',
    color: '#555',
  },
  profilePicture: {
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    marginBottom: '1rem',
  },
  profileButton: {
    marginTop: '1rem',
    padding: '10px 20px',
    borderRadius: '20px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: '1rem',
    padding: '10px 20px',
    borderRadius: '20px',
    border: 'none',
    backgroundColor: '#333',
    color: '#FFF',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
  },
};

const ProfileView = ({ readOnly = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = id ? `http://localhost:5000/api/profile/${id}` : 'http://localhost:5000/api/profile';
      const response = await fetch(url, {
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
      setProfileData(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <div style={styles.profileContainer}>
      <h1 style={styles.profileTitle}>Profile View</h1>
      {profileData ? (
        <div style={styles.profilePanel}>
          <div style={styles.profileDetails}>
            {profileData.profilePicture && (
              <img
                src={`http://localhost:5000${profileData.profilePicture}`}
                alt="Profile"
                style={styles.profilePicture}
              />
            )}
            <p style={styles.profileItem}><strong>Email:</strong> {profileData.email}</p>
            <p style={styles.profileItem}><strong>Full Name:</strong> {profileData.fullName}</p>
            <p style={styles.profileItem}><strong>Program:</strong> {profileData.programName}</p>
            <p style={styles.profileItem}><strong>Year of Study:</strong> {profileData.yearOfStudy}</p>
            <p style={styles.profileItem}><strong>GPA:</strong> {profileData.gpa}</p>
            <p style={styles.profileItem}><strong>Description:</strong> {profileData.description}</p>
            <p style={styles.profileItem}><strong>Academic Interests:</strong> {profileData.interests.join(', ')}</p>
            <p style={styles.profileItem}><strong>Courses:</strong> {profileData.courses.join(', ')}</p>
          </div>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
      {!readOnly && (
        <button style={styles.profileButton} onClick={() => navigate('/edit-profile')}>
          Edit Profile
        </button>
      )}
      <button style={styles.backButton} onClick={handleBack}>Back to Dashboard</button>
    </div>
  );
};

export default ProfileView;

