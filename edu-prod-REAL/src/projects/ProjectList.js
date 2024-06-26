import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#f7f7f7',  // Matched background color with Dashboard
    color: '#000',  // Matched text color with Dashboard
    minHeight: '100vh',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  header: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    fontSize: '2.5rem',
    color: '#007bff',  // Adjusted header color
  },
  addButton: {
    padding: '10px 20px',
    borderRadius: '20px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  backButton: {
    padding: '10px 20px',
    borderRadius: '20px',
    border: 'none',
    backgroundColor: '#333',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  projectListContainer: {
    width: '100%',
    maxHeight: 'calc(100vh - 180px)',
    overflowY: 'auto',
    marginTop: '20px',
  },
  projectPanel: {
    position: 'relative',
    padding: '20px',
    borderRadius: '10px',
    backgroundColor: '#fff',  // Matched background color with Dashboard
    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
    cursor: 'default',
    transition: 'background-color 0.3s ease',
  },
  deleteButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    padding: '5px 10px',
    borderRadius: '20px',
    border: 'none',
    backgroundColor: '#dc3545',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  projectName: {
    fontSize: '1.5rem',
    marginBottom: '10px',
    fontWeight: 'bold',
    color: '#333',  // Adjusted text color for project name
  },
  projectDetailsPanel: {
    marginBottom: '10px',
  },
  projectDetailsSection: {
    backgroundColor: '#eee',  // Matched background color with Dashboard
    padding: '10px',
    borderRadius: '8px',
    marginTop: '10px',
  },
  projectDescription: {
    marginBottom: '10px',
    fontSize: '1rem',
    color: '#555',  // Matched text color with Dashboard
  },
  projectLink: {
    display: 'block',
    color: '#007bff',
    textDecoration: 'underline',
    marginBottom: '10px',
    fontSize: '1rem',
  },
  projectImage: {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: '5px',
    marginTop: '10px',
  },
};

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

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

  const handleAddProject = () => {
    navigate('/add-project');
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleDeleteProject = async (projectId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete project');
      }

      setProjects(projects.filter((project) => project._id !== projectId));
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={handleBackToDashboard} style={styles.backButton}>
          Back to Dashboard
        </button>
        <h1 style={{ margin: 0, fontFamily: 'Impact, sans-serif' }}>Project List</h1>
        <button onClick={handleAddProject} style={styles.addButton}>
          Add Project
        </button>
      </div>
      <div style={styles.projectListContainer}>
        {projects.length > 0 ? (
          projects.map((project) => (
            <div key={project._id} style={styles.projectPanel}>
              <button
                style={styles.deleteButton}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteProject(project._id);
                }}
              >
                Delete
              </button>
              <h2 style={styles.projectName}>{project.projectName}</h2>
              <div style={styles.projectDetailsPanel}>
                <div style={styles.projectDetailsSection}>
                  <p style={styles.projectDescription}>{project.description}</p>
                </div>
                <div style={styles.projectDetailsSection}>
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.projectLink}
                  >
                    {project.link}
                  </a>
                </div>
              </div>
              {project.profilePicture && (
                <div>
                  <img
                    src={`http://localhost:5000${project.profilePicture}`}
                    alt={project.projectName}
                    style={styles.projectImage}
                  />
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No projects found</p>
        )}
      </div>
    </div>
  );
};

export default ProjectList;
