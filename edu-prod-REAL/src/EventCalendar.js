import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

const EventCalendar = () => {
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventTitle, setEventTitle] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [friends, setFriends] = useState([]);
  const [invitedFriends, setInvitedFriends] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currentMonthYear, setCurrentMonthYear] = useState('');
  const [eventInvites, setEventInvites] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchCurrentUser();
    fetchFriends();
    fetchEvents();
    fetchEventInvites();
  }, []);

  const fetchCurrentUser = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch current user');
      }

      const data = await response.json();
      setCurrentUser(data);
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  const fetchFriends = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/friends', {
        headers: {
          Authorization: `Bearer ${token}`,
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

  const fetchEvents = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/events', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const data = await response.json();
      setEvents(data.map(event => ({
        id: event._id,
        title: event.title,
        start: event.start,
        end: event.end,
        createdBy: event.createdBy,
        location: event.location,
        attendees: event.attendees,
      })));
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const fetchEventInvites = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/events/invites', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch event invites');
      }

      const data = await response.json();
      setEventInvites(data);
    } catch (error) {
      console.error('Error fetching event invites:', error);
    }
  };

  const handleSelect = (info) => {
    setSelectedEvent(null);
    setStartDate(info.startStr);
    setEndDate(info.endStr);
    setModalOpen(true);
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/events', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: eventTitle,
          location: eventLocation,
          start: startDate,
          end: endDate,
          friends: invitedFriends,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create event');
      }

      const newEvent = await response.json();
      setEvents([...events, {
        id: newEvent._id,
        title: newEvent.title,
        start: newEvent.start,
        end: newEvent.end,
        createdBy: newEvent.createdBy,
        location: newEvent.location,
        attendees: newEvent.attendees,
      }]);
      setModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const resetForm = () => {
    setEventTitle('');
    setEventLocation('');
    setInvitedFriends([]);
    setStartDate(null);
    setEndDate(null);
  };

  const handleCancel = () => {
    setModalOpen(false);
    resetForm();
  };

  const handleInviteFriend = (friendId) => {
    setInvitedFriends((prev) =>
      prev.includes(friendId) ? prev.filter((id) => id !== friendId) : [...prev, friendId]
    );
  };

  const handleDatesSet = (dateInfo) => {
    const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(dateInfo.start);
    const year = dateInfo.start.getFullYear();
    setCurrentMonthYear(`${month} ${year}`);
  };

  const handleEventClick = (info) => {
    const event = events.find(e => e.id === info.event.id);
    setSelectedEvent(event);
    setStartDate(null);
    setEndDate(null);
    setModalOpen(true);
  };

  const handleDeleteEvent = async (eventId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete event');
      }

      setEvents(events.filter(event => event.id !== eventId));
      setModalOpen(false);
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleRemoveAttendee = async (eventId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/events/${eventId}/remove-attendee`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to remove attendee');
      }

      fetchEvents(); // Refresh events after removing attendee
      setModalOpen(false);
    } catch (error) {
      console.error('Error removing attendee:', error);
    }
  };

  const handleAcceptInvite = async (eventId, inviteId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/events/${eventId}/accept/${inviteId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to accept invite');
      }

      fetchEvents(); // Refresh events after accepting
      fetchEventInvites(); // Refresh invites after accepting
    } catch (error) {
      console.error('Error accepting invite:', error);
    }
  };

  const handleRejectInvite = async (eventId, inviteId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/events/${eventId}/reject/${inviteId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to reject invite');
      }

      fetchEvents(); // Refresh events after rejecting
      fetchEventInvites(); // Refresh invites after rejecting
    } catch (error) {
      console.error('Error rejecting invite:', error);
    }
  };

  return (
    <div>
      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        <h2>{currentMonthYear}</h2>
      </div>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        selectable
        events={events}
        select={handleSelect}
        datesSet={handleDatesSet}
        eventClick={handleEventClick}
        headerToolbar={{
          start: 'today prev,next',
          end: 'dayGridMonth,dayGridWeek,dayGridDay',
        }}
      />

      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            {selectedEvent ? (
              <>
                <h2>Event Details</h2>
                <p><strong>Title:</strong> {selectedEvent.title}</p>
                <p><strong>Location:</strong> {selectedEvent.location}</p>
                <p><strong>Start:</strong> {new Date(selectedEvent.start).toLocaleString()}</p>
                <p><strong>End:</strong> {new Date(selectedEvent.end).toLocaleString()}</p>
                <p><strong>Attendees:</strong></p>
                <ul>
                  {selectedEvent.attendees.map((attendee) => (
                    <li key={attendee._id}>{attendee.fullName}</li>
                  ))}
                </ul>
                {currentUser && selectedEvent.createdBy._id === currentUser._id ? (
                  <button onClick={() => handleDeleteEvent(selectedEvent.id)} style={{ marginRight: '10px' }}>
                    Delete Event
                  </button>
                ) : (
                  <button onClick={() => handleRemoveAttendee(selectedEvent.id)} style={{ marginRight: '10px' }}>
                    Remove Myself
                  </button>
                )}
                <button onClick={() => setModalOpen(false)}>Close</button>
              </>
            ) : (
              <>
                <h2>Create Event</h2>
                <form onSubmit={handleCreateEvent}>
                  <input
                    type="text"
                    placeholder="Event Title"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    style={{ marginBottom: '10px' }}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Event Location"
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    style={{ marginBottom: '10px' }}
                    required
                  />
                  <div>
                    <label>Invite Friends:</label>
                    <select multiple value={invitedFriends} onChange={(e) => handleInviteFriend(e.target.value)}>
                      {friends.map((friend) => (
                        <option key={friend._id} value={friend._id}>
                          {friend.fullName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button type="submit" style={{ marginRight: '10px' }}>
                    Create Event
                  </button>
                  <button type="button" onClick={handleCancel}>Cancel</button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      <div>
        <h2>Event Invites</h2>
        {eventInvites.map((invite) => (
          <div key={invite._id}>
            <p>
              {invite.title} on {new Date(invite.start).toLocaleString()} at {invite.location}
            </p>
            <button onClick={() => handleAcceptInvite(invite._id, invite.inviteId)}>Accept</button>
            <button onClick={() => handleRejectInvite(invite._id, invite.inviteId)}>Reject</button>
          </div>
        ))}
      </div>

      <style jsx>{`
        .modal-overlay {
          display: flex;
          justify-content: center;
          align-items: center;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 1000;
        }
        .modal-content {
          background-color: #fff;
          padding: 20px;
          border-radius: 4px;
          width: 300px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          position: relative;
        }
        .modal-content h2 {
          margin-top: 0;
        }
        .modal-content input,
        .modal-content select {
          width: 100%;
          padding: 8px;
          margin-bottom: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .modal-content button {
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .modal-content button:first-of-type {
          background-color: #007bff;
          color: #fff;
        }
        .modal-content button:last-of-type {
          background-color: #dc3545;
          color: #fff;
        }
      `}</style>
    </div>
  );
};

export default EventCalendar;
