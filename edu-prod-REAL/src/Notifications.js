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
  const [eventInvites, setEventInvites] = useState([]);

  useEffect(() => {
    fetchFriendRequests();
    fetchEventInvites();
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
      console.log('Friend Requests:', data);
      setFriendRequests(data);
    } catch (error) {
      console.error('Error fetching friend requests:', error);
    }
  };

  const fetchEventInvites = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/events/invites', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch event invites');
      }

      const data = await response.json();
      console.log('Event Invites:', data);
      setEventInvites(data);
    } catch (error) {
      console.error('Error fetching event invites:', error);
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

  const handleAcceptEvent = async (eventId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/events/${eventId}/accept`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to accept event invite');
      }

      setEventInvites(eventInvites.filter(event => event._id !== eventId));

      // Refetch events to update the calendar
      fetchEvents();
    } catch (error) {
      console.error('Error accepting event invite:', error);
    }
  };

  const handleRejectEvent = async (eventId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/events/${eventId}/reject`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to reject event invite');
      }

      setEventInvites(eventInvites.filter(event => event._id !== eventId));
    } catch (error) {
      console.error('Error rejecting event invite:', error);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Notifications</h1>
      <div style={styles.notificationContainer}>
        <h2>Friend Requests</h2>
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
      <div style={styles.notificationContainer}>
        <h2>Event Invites</h2>
        {eventInvites.length > 0 ? (
          eventInvites.map((event) => (
            <div key={event._id} style={styles.notificationItem}>
              <p><strong>{event.title}</strong> on {new Date(event.start).toLocaleString()} at {event.location}</p>
              <button style={styles.button} onClick={() => handleAcceptEvent(event._id)}>Accept</button>
              <button style={styles.button} onClick={() => handleRejectEvent(event._id)}>Reject</button>
            </div>
          ))
        ) : (
          <p>No event invites</p>
        )}
      </div>
    </div>
  );
};

export default Notifications;
