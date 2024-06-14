import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileView = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    // Fetch existing profile data to prefill the form
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      console.log('ta');
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
      console.log(data);
      setProfileData({ email: data.email, yearOfStudy: data.yearOfStudy, fullName: data.fullName, gpa: data.gpa});

    } catch (error) {
      console.error('Error fetching profile:', error);
      // Handle error (show error message, etc.)
    }
  };

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  return (
    <div>
      <h1>Profile View</h1>
      <p>{profileData?.email}</p>
      <p>{profileData?.yearOfStudy}</p>
      
      <button onClick={handleEditProfile}>Edit Profile</button>
    </div>
  );
};

export default ProfileView;
