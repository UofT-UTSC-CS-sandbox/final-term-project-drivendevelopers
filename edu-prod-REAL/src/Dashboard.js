import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

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
  navButtons: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    fontSize: '1.5rem',
    color: '#000',
  },
  navButton: {
    background: 'none',
    border: 'none',
    color: '#000',
    cursor: 'pointer',
    textDecoration: 'none',
    fontSize: 'inherit',
    padding: '0',
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
  const [friendRequests, setFriendRequests] = useState([]);

  useEffect(() => {
    fetchProfileData();
    fetchProjects();
    fetchFriendRequests();
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

  const fetchFriendRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/friend-requests', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch friend requests');
      }

      const data = await response.json();
      setFriendRequests(data);
    } catch (error) {
      console.error('Error fetching friend requests:', error);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear token from localStorage
    navigate('/'); // Redirect to login page after logout
  };

  return (
    <div style={styles.dashboardContainer}>
      <div style={styles.header}>
        <div>Edu Prodigi</div>
        <div style={styles.navButtons}>
          <button style={styles.navButton} onClick={() => handleNavigation('/profile-view')}>Profile</button>
          <button style={styles.navButton} onClick={() => handleNavigation('/connect')}>Connect</button>
          <button style={styles.navButton} onClick={() => handleNavigation('/project-list')}>Projects</button>
          <button style={styles.navButton} onClick={() => handleNavigation('/notifications')}>
            <i className="fas fa-bell"></i>
            {friendRequests.length > 0 && (
              <span style={{ color: 'red', marginLeft: '5px' }}>
                {friendRequests.length}
              </span>
            )}
          </button>
          <button style={styles.navButton} onClick={() => handleNavigation('/friend-list')}>Friends</button> {/* Add this line */}
          <button style={styles.navButton} onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </div>
      <h1 style={styles.mainTitle}>Hello, {userName || 'User'}!</h1>
      {friendRequests.length > 0 && (
        <div style={{ marginBottom: '20px', color: 'red' }}>
          You have {friendRequests.length} friend request(s)! Please go to Notifications.
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <div style={styles.column}>
          <h2 style={styles.subTitle}>Recommended Connections</h2>
          {/* Empty for now */}
        </div>
        <div style={styles.column}>
          <h2 style={styles.subTitle}>Tools</h2>
          <button style={styles.button} onClick={() => handleNavigation('/eventCalendar')}>Event Calendar</button>
          <button style={styles.button} onClick={() => handleNavigation('/coursePlanner')}>Course Planner</button>
          <button style={styles.button} onClick={() => handleNavigation('/gpaCalc')}>GPA Calculator</button>
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
