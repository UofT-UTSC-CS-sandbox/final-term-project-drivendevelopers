import React, { useEffect, useState } from 'react';

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
  notificationContainer: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '20px',
    maxWidth: '600px',
    width: '100%',
    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
  },
  notificationItem: {
    marginBottom: '10px',
    fontSize: '1.2rem',
    color: '#555',
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
    marginRight: '10px',
  },
};

const Notifications = () => {
  const [friendRequests, setFriendRequests] = useState([]);

  useEffect(() => {
    fetchFriendRequests();
  }, []);

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

  const handleAccept = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/friend-request/accept/${id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to accept friend request');
      }

      setFriendRequests(friendRequests.filter(request => request._id !== id));
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  const handleReject = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/friend-request/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to reject friend request');
      }

      setFriendRequests(friendRequests.filter(request => request._id !== id));
    } catch (error) {
      console.error('Error rejecting friend request:', error);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Notifications</h1>
      <div style={styles.notificationContainer}>
        {friendRequests.length > 0 ? (
          friendRequests.map((request) => (
            <div key={request._id} style={styles.notificationItem}>
              <p><strong>{request.fullName}</strong> sent you a friend request.</p>
              <button style={styles.button} onClick={() => handleAccept(request._id)}>Accept</button>
              <button style={styles.button} onClick={() => handleReject(request._id)}>Reject</button>
            </div>
          ))
        ) : (
          <p>No friend requests</p>
        )}
      </div>
    </div>
  );
};

export default Notifications;
