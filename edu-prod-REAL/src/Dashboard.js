import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const styles = {
  dashboardContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: '100vh',
    backgroundColor: '#f7f7f7',
    color: '#000',
    padding: '20px',
    boxSizing: 'border-box',
  },
  header: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    fontSize: '2.5rem',
    color: '#000',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#e6e6e6',
    padding: '20px',
    borderRadius: '10px',
    width: '30%',
    margin: '10px',
  },
  mainTitle: {
    fontSize: '3rem',
    color: '#333',
    marginBottom: '20px',
  },
  subTitle: {
    fontSize: '2rem',
    marginBottom: '20px',
    color: '#555',
  },
  projectCard: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '15px',
    marginBottom: '10px',
    width: '100%',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  projectTitle: {
    fontSize: '1.5rem',
    marginBottom: '10px',
  },
  projectDescription: {
    fontSize: '1rem',
    marginBottom: '10px',
    color: '#777',
  },
  projectMembers: {
    fontSize: '1rem',
    color: '#777',
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
    marginBottom: '10px',
  },
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    fetchProfileData();
    fetchProjects();
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
      setUserName(data.fullName);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/projects', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }

      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div style={styles.dashboardContainer}>
      <div style={styles.header}>
        <div>Edu Prodigi</div>
        <div>
          <span>Hello, {userName || 'User'}!</span>
          <span>Profile | Connect | Projects</span>
        </div>
      </div>
      <h1 style={styles.mainTitle}>Hello, {userName || 'User'}!</h1>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <div style={styles.column}>
          <h2 style={styles.subTitle}>Connect With</h2>
          {/* Empty for now */}
        </div>
        <div style={styles.column}>
          <h2 style={styles.subTitle}>Quick Actions</h2>
          <button style={styles.button} onClick={() => handleNavigation('/connect')}>Connect</button>
          <button style={styles.button} onClick={() => handleNavigation('/add-project')}>Create Project</button>
          <button style={styles.button} onClick={() => handleNavigation('/project-list')}>View Projects</button>
          <button style={styles.button} onClick={() => handleNavigation('/profile-view')}>My Profile</button>
          <button style={styles.button} onClick={() => handleNavigation('/notifications')}>Notifications</button>
        </div>
        <div style={styles.column}>
          <h2 style={styles.subTitle}>Current Projects</h2>
          {projects.length > 0 ? (
            projects.map((project) => (
              <div key={project._id} style={styles.projectCard}>
                <h3 style={styles.projectTitle}>{project.projectName}</h3>
                <p style={styles.projectDescription}>{project.description}</p>
                <p style={styles.projectMembers}>Number of members: {project.members || 1}</p>
              </div>
            ))
          ) : (
            <p>No projects found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
