import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const EditProfileForm = () => {
  const [programName, setProgramName] = useState('');
  const [yearOfStudy, setYearOfStudy] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch existing profile data to prefill the form
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
      setProgramName(data.programName);
      setYearOfStudy(data.yearOfStudy);
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Handle error (show error message, etc.)
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem('token');
      console.log('token='+token);
      const response = await fetch('http://localhost:5000/api/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ programName, yearOfStudy }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      // Handle successful update (e.g., redirect to profile view, show success message)
      navigate('/profile-view');
    } catch (error) {
      console.error('Error updating profile:', error);
      // Handle error (show error message, etc.)
    }
  };

  return (
    <div>
      <h1>Edit Profile</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Program Name:</label>
          <input
            type="text"
            value={programName}
            onChange={(e) => setProgramName(e.target.value)}
          />
        </div>
        <div>
          <label>Year of Study:</label>
          <input
            type="text"
            value={yearOfStudy}
            onChange={(e) => setYearOfStudy(e.target.value)}
          />
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default EditProfileForm;
