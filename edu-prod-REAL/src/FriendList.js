import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f7f7f7',
    color: '#000',
    padding: '20px',
    boxSizing: 'border-box',
  },
  title: {
    fontSize: '3rem',
    color: '#333',
    marginBottom: '20px',
  },
  friendContainer: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '20px',
    maxWidth: '600px',
    width: '100%',
    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
  },
  friendItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between', // Align items to the ends
    marginBottom: '10px',
    fontSize: '1.2rem',
    color: '#555',
  },
  profilePicture: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    marginRight: '10px',
  },
  friendInfo: {
    display: 'flex',
    alignItems: 'center',
  },
  buttonsContainer: {
    display: 'flex',
    gap: '10px', // Add gap between buttons
  },
  button: {
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  removeButton: {
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#dc3545',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  backButton: {
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#333',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
  },
};

const FriendList = () => {
  const navigate = useNavigate();
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/friends', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch friends');
      }

      const data = await response.json();
      setFriends(data);
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  const handleRemoveFriend = async (friendId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/friends/${friendId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to remove friend');
      }

      setFriends(friends.filter(friend => friend._id !== friendId));
    } catch (error) {
      console.error('Error removing friend:', error);
    }
  };

  const handleViewProfile = (id) => {
    navigate(`/profile-view/${id}`);
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Friend List</h1>
      <div style={styles.friendContainer}>
        {friends.length > 0 ? (
          friends.map((friend) => (
            <div key={friend._id} style={styles.friendItem}>
              <div style={styles.friendInfo}>
                {friend.profilePicture && (
                  <img
                    src={`http://localhost:5000${friend.profilePicture}`}
                    alt="Profile"
                    style={styles.profilePicture}
                  />
                )}
                <p><strong>{friend.fullName}</strong></p>
              </div>
              <div style={styles.buttonsContainer}>
                <button style={styles.button} onClick={() => handleViewProfile(friend._id)}>View Profile</button>
                <button style={styles.removeButton} onClick={() => handleRemoveFriend(friend._id)}>Remove</button>
              </div>
            </div>
          ))
        ) : (
          <p>No friends found</p>
        )}
      </div>
      <button style={styles.backButton} onClick={handleBack}>Back to Dashboard</button>
    </div>
  );
};

export default FriendList;
