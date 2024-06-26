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
};

const SearchUsers = () => {
  const [name, setName] = useState('');
  const [interests, setInterests] = useState('');
  const [hobbies, setHobbies] = useState('');
  const [program, setProgram] = useState('');
  const [year, setYear] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();

    // Construct the search query
    const query = {
      ...(name && { name }),
      ...(interests && { interests }),
      ...(hobbies && { hobbies }),
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
            placeholder="Add Interests"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Add Interests and Hobbies"
            value={hobbies}
            onChange={(e) => setHobbies(e.target.value)}
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Add Program"
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
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Interests:</strong> {user.interests}</p>
                <p><strong>Hobbies:</strong> {user.hobbies}</p>
                <p><strong>Program:</strong> {user.program}</p>
                <p><strong>Year:</strong> {user.year}</p>
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
