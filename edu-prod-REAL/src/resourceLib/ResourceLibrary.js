import React, { useEffect, useState } from 'react';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f7f7f7',
    padding: '20px',
    boxSizing: 'border-box',
  },
  header: {
    fontSize: '3rem',
    color: '#333',
    marginBottom: '20px',
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
    marginBottom: '20px',
  },
  searchBar: {
    width: '100%',
    maxWidth: '600px',
    padding: '10px',
    borderRadius: '20px',
    border: '1px solid #ccc',
    marginBottom: '20px',
    fontSize: '1rem',
  },
  resourceList: {
    width: '100%',
    maxWidth: '800px',
    listStyleType: 'none',
    padding: 0,
  },
  resourceItem: {
    border: '1px solid #ddd',
    padding: '15px',
    marginBottom: '10px',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9',
  },
};

const ResourceLibrary = () => {
  const [resources, setResources] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/resources', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch resources');
      }

      const data = await response.json();
      setResources(data);
    } catch (error) {
      console.error('Error fetching resources:', error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredResources = resources.filter(resource =>
    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Resource Library</h1>
      <button style={styles.button} onClick={() => window.location.href='/add-resource'}>Add New Resource</button>
      <input
        type="text"
        placeholder="Search resources by tags..."
        style={styles.searchBar}
        value={searchQuery}
        onChange={handleSearchChange}
      />
      <ul style={styles.resourceList}>
        {filteredResources.map(resource => (
          <li key={resource._id} style={styles.resourceItem}>
            <h3>{resource.title}</h3>
            <p>{resource.description}</p>
            <p>Tags: {resource.tags.join(', ')}</p>
            <a href={resource.link} target="_blank" rel="noopener noreferrer">Visit</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResourceLibrary;
