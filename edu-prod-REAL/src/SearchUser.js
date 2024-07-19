import React, { useState } from 'react';

const styles = {
  searchContainer: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f7f7f7',
    color: '#000',
    padding: '20px',
    boxSizing: 'border-box',
  },
  filtersContainer: {
    flex: '0 0 auto',
    marginRight: '50px',
    marginLeft: '500px',
    width: '250px',
  },
  resultsContainer: {
    flex: '1 1 auto',
    marginLeft: '50px',
  },
  title: {
    fontSize: '2.5rem',
    color: '#000',
    marginBottom: '20px',
  },
  subtitle: {
    fontSize: '1.5rem',
    marginBottom: '20px',
    color: '#555',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    maxWidth: '250px',
    marginBottom: '20px',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '1rem',
  },
  button: {
    width: '100%',
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  results: {
    marginTop: '20px',
    width: '100%',
    maxWidth: '500px',
  },
  resultItem: {
    backgroundColor: '#fff',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    marginBottom: '10px',
  },
  profilePicture: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    marginRight: '10px',
  },
};

const SearchUsers = () => {
  const [name, setName] = useState('');
  const [academicInterests, setAcademicInterests] = useState('');
  const [courses, setCourses] = useState('');
  const [program, setProgram] = useState('');
  const [year, setYear] = useState('');
  const [results, setResults] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    const query = {
      ...(name && { name }),
      ...(academicInterests && { academicInterests }),
      ...(courses && { courses }),
      ...(program && { program }),
      ...(year && { year }),
    };

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/search-users', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(query),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSendFriendRequest = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/friend-request', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to send friend request');
      }

      setFriendRequests([...friendRequests, userId]);
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  return (
    <div style={styles.searchContainer}>
      <div style={styles.filtersContainer}>
        <h1 style={styles.title}>Search Filters</h1>
        <form style={styles.form} onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Academic Interests"
            value={academicInterests}
            onChange={(e) => setAcademicInterests(e.target.value)}
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Courses"
            value={courses}
            onChange={(e) => setCourses(e.target.value)}
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Program"
            value={program}
            onChange={(e) => setProgram(e.target.value)}
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Search</button>
        </form>
      </div>
      <div style={styles.resultsContainer}>
        <h1 style={styles.title}>Search Results</h1>
        <div style={styles.results}>
          {results.length > 0 ? (
            results.map((user, index) => (
              <div key={index} style={styles.resultItem}>
                {user.profilePicture && (
                  <img
                    src={`http://localhost:5000${user.profilePicture}`}
                    alt="Profile"
                    style={styles.profilePicture}
                  />
                )}
                <p><strong>Name:</strong> {user.fullName}</p>
                <p><strong>Academic Interests:</strong> {user.interests.join(', ')}</p>
                <p><strong>Courses:</strong> {user.courses.join(', ')}</p>
                <p><strong>Program:</strong> {user.programName}</p>
                <p><strong>Year:</strong> {user.yearOfStudy}</p>
                <button
                  onClick={() => handleSendFriendRequest(user._id)}
                  disabled={friendRequests.includes(user._id)}
                  style={styles.button}
                >
                  {friendRequests.includes(user._id) ? 'Request Sent' : 'Add Friend'}
                </button>
              </div>
            ))
          ) : (
            <p>No users found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchUsers;
