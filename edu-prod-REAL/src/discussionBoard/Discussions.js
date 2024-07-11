import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
  },
  discussionImages: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px',
  },
  discussionImage: {
    maxWidth: '100px',
    borderRadius: '5px',
  },
};

const Discussions = () => {
  const navigate = useNavigate();
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Discussions</h1>
      <button style={styles.button} onClick={handleNewDiscussion}>New Discussion</button>
      <input type="text" placeholder="Search discussions..." style={styles.searchBar} />
      {loading ? (
        <p>Loading discussions...</p>
      ) : (
        <ul style={styles.discussionList}>
          {discussions.map(discussion => (
            <li key={discussion._id} style={styles.discussionItem}>
              <h2>{discussion.title}</h2>
              <p>{discussion.description}</p>
              {discussion.images && discussion.images.length > 0 && (
                <div style={styles.discussionImages}>
                  {discussion.images.map((image, index) => (
                    <img key={index} src={`http://localhost:5000/${image}`} alt={`Discussion ${index}`} style={styles.discussionImage} />
                  ))}
                </div>
              )}
              <p>Posted by: {discussion.userId.email}</p>
              <p>Date: {new Date(discussion.createdAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Discussions;
