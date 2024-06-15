import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch profile data when component mounts
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/profile', {
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
      setProfileData(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Handle error (show error message, redirect, etc.)
    }
  };

  const handleProfileView = () => {
    navigate('/profile-view');
  };

  const handleConnect = () => {
    // Handle connect button click
    console.log('Connect button clicked');
  };

  const handleProjects = () => {
    // Handle projects button click
    console.log('Projects button clicked');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f0f2f5' }}>
      {/* Side panel */}
      <div style={{ width: isCollapsed ? '60px' : '250px', backgroundColor: '#000', color: '#fff', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'width 0.3s ease' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '20px' }}>
          <h2 style={{ margin: 0 }}>{isCollapsed ? '' : 'Dashboard'}</h2>
          <button onClick={toggleCollapse} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#fff', fontSize: '1.5rem', marginBottom: '1rem' }}>
            {isCollapsed ? '▶' : '◀'}
          </button>
        </div>
        {!isCollapsed && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <button onClick={handleProfileView} style={{ marginBottom: '1rem', padding: '10px 20px', borderRadius: '20px', border: 'none', backgroundColor: '#ff4d4f', color: '#fff', cursor: 'pointer', fontSize: '1.5rem' }}>View Profile</button>
            <button onClick={handleConnect} style={{ marginBottom: '1rem', padding: '10px 20px', borderRadius: '20px', border: 'none', backgroundColor: '#ff4d4f', color: '#fff', cursor: 'pointer', fontSize: '1.5rem' }}>Connect</button>
            <button onClick={handleProjects} style={{ marginBottom: '1rem', padding: '10px 20px', borderRadius: '20px', border: 'none', backgroundColor: '#ff4d4f', color: '#fff', cursor: 'pointer', fontSize: '1.5rem' }}>Projects</button>
            <button onClick={handleLogout} style={{ padding: '10px 20px', borderRadius: '20px', border: 'none', backgroundColor: '#ffd166', color: '#333', cursor: 'pointer', fontSize: '1.5rem' }}>Logout</button>
          </div>
        )}
      </div>
      {/* Main content */}
      <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundImage: 'url("https://c4.wallpaperflare.com/wallpaper/839/50/541/library-cartoon-books-candles-wallpaper-preview.jpg")', backgroundSize: 'cover', backgroundPosition: 'center', color: '#333' }}>
        <h1 style={{ fontFamily: 'Impact', fontSize: '5rem', textAlign: 'center', marginBottom: '2rem', color: '#FFFFFF' }}>Welcome to Edu Prodigi</h1>
        {profileData && (
          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: '20px', borderRadius: '10px', maxWidth: '400px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Your Profile</h2>
            <p><strong>Program Name:</strong> {profileData.programName}</p>
            <p><strong>Year of Study:</strong> {profileData.yearOfStudy}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
