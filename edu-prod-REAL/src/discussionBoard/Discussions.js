import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
//import axios from 'axios';

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
  filterContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    maxWidth: '600px',
    marginBottom: '20px',
  },
  filterText: {
    marginRight: '10px',
    fontSize: '1rem',
  },
  filterSelect: {
    padding: '10px',
    borderRadius: '20px',
    border: '1px solid #ccc',
    fontSize: '1rem',
  },
  discussionList: {
    width: '100%',
    maxWidth: '800px',
    listStyleType: 'none',
    padding: 0,
  },
  discussionItem: {
    border: '1px solid #ddd',
    padding: '15px',
    marginBottom: '10px',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9',
    cursor: 'pointer',
  },
};

const Discussions = () => {
  const navigate = useNavigate();
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortCriteria, setSortCriteria] = useState('newest');

  useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/discussions', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Handle authentication
          }
        });
        setDiscussions(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch discussions:', error);
        setLoading(false);
      }
    };

    fetchDiscussions();
  }, []);

  const handleNewDiscussion = () => {
    navigate('/new-discussion');
  };

  const handleDiscussionClick = (discussionId) => {
    navigate(`/discussion/${discussionId}`);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortCriteria(event.target.value);
  };

  const filteredDiscussions = discussions
    .filter(discussion =>
      discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      discussion.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortCriteria) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'alphaAsc':
          return a.title.localeCompare(b.title);
        case 'alphaDesc':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Discussions</h1>
      <button style={styles.button} onClick={handleNewDiscussion}>New Discussion</button>
      <input
        type="text"
        placeholder="Search discussions..."
        style={styles.searchBar}
        value={searchQuery}
        onChange={handleSearchChange}
      />
      <div style={styles.filterContainer}>
        <span style={styles.filterText}>Filter by:</span>
        <select value={sortCriteria} onChange={handleSortChange} style={styles.filterSelect}>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="alphaAsc">Alphabetical (A-Z)</option>
          <option value="alphaDesc">Alphabetical (Z-A)</option>
        </select>
      </div>
      {loading ? (
        <p>Loading discussions...</p>
      ) : (
        <ul style={styles.discussionList}>
          {filteredDiscussions.map(discussion => (
            <li
              key={discussion._id}
              style={styles.discussionItem}
              onClick={() => handleDiscussionClick(discussion._id)}
            >
              <h2>{discussion.title}</h2>
              <p>Posted by: {discussion.userId?.email}</p>
              <p>Date: {new Date(discussion.createdAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Discussions;
