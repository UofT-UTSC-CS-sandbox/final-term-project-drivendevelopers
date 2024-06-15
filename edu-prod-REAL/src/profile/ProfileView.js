import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const styles = {
  profileContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#000',
    color: '#fff',
  },
  profileTitle: {
    fontFamily: 'Impact, sans-serif',
    fontSize: '4rem',
    color: '#ff4d4f',
    marginBottom: '1.5rem',
  },
  profileDetails: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  profileItem: {
    marginBottom: '1rem',
    fontSize: '1.2rem',
  },
  profileButton: {
    marginTop: '1rem',
    padding: '10px 20px',
    borderRadius: '20px',
    border: 'none',
    backgroundColor: '#ff4d4f',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '1.5rem',
  },
  backButton: {
    marginTop: '1rem',
    padding: '10px 20px',
    borderRadius: '20px',
    border: 'none',
    backgroundColor: '#ffd166',
    color: '#000',
    cursor: 'pointer',
    fontSize: '1.5rem',
  },
  profileImage: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    marginBottom: '1rem',
  },
};

const ProfileView = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile data');
      }

      const data = await response.json();
      setProfileData({
        email: data.email,
        yearOfStudy: data.yearOfStudy,
        fullName: data.fullName,
        gpa: data.gpa,
        program: data.programName,
        description: data.description,
        profilePicture: data.profilePicture,
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div style={styles.profileContainer}>
      <h1 style={styles.profileTitle}>Profile View</h1>
      {profileData ? (
        <div style={styles.profileDetails}>
          {profileData.profilePicture && (
            <img
              src={profileData.profilePicture}
              alt="Profile"
              style={styles.profileImage}
            />
          )}
          <p style={styles.profileItem}><strong>Email:</strong> {profileData.email}</p>
          <p style={styles.profileItem}><strong>Full Name:</strong> {profileData.fullName}</p>
          <p style={styles.profileItem}><strong>Program:</strong> {profileData.program}</p>
          <p style={styles.profileItem}><strong>Year of Study:</strong> {profileData.yearOfStudy}</p>
          <p style={styles.profileItem}><strong>GPA:</strong> {profileData.gpa}</p>
          <p style={styles.profileItem}><strong>Description:</strong> {profileData.description}</p>
          <button style={styles.profileButton} onClick={handleEditProfile}>Edit Profile</button>
          <button style={styles.backButton} onClick={handleBackToDashboard}>Back to Dashboard</button>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default ProfileView;
