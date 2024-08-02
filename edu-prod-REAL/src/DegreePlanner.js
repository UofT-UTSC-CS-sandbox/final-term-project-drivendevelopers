import React, { useState, useEffect } from 'react';

const DegreePlanner = () => {
  const [courses, setCourses] = useState([]);
  const [courseName, setCourseName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [credits, setCredits] = useState('');
  const [semester, setSemester] = useState('');
  const [year, setYear] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [hoveredButton, setHoveredButton] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/degree-planner', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }

      const data = await response.json();
      setCourses(data);
    } catch (err) {
      console.error('Error fetching courses:', err.message);
    }
  };

  const handleAddCourse = async () => {
    if (!courseName || !courseCode || !credits || !semester || !year) {
      setErrorMessage('All fields must be filled in');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/degree-planner', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseName,
          courseCode,
          credits,
          semester,
          year: `Year ${year}`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add course');
      }

      fetchCourses();
      setCourseName('');
      setCourseCode('');
      setCredits('');
      setSemester('');
      setYear('');
      setErrorMessage('');
    } catch (err) {
      console.error('Error adding course:', err.message);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/degree-planner/${courseId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete course');
      }

      fetchCourses();
    } catch (err) {
      console.error('Error deleting course:', err.message);
    }
  };

  const handleMouseEnter = (buttonName) => {
    setHoveredButton(buttonName);
  };

  const handleMouseLeave = () => {
    setHoveredButton('');
  };

  const renderCourseRows = (semester, year) => {
    return courses
      .filter(course => course.semester === semester && course.year === year)
      .map(course => (
        <div key={course._id} style={styles.courseRow}>
          <div style={styles.courseCell}>{course.courseName}</div>
          <div style={styles.courseCell}>{course.courseCode}</div>
          <div style={styles.courseCell}>{course.credits}</div>
          <button
            onClick={() => handleDeleteCourse(course._id)}
            style={hoveredButton === `delete-${course._id}` ? { ...styles.removeButton, ...styles.removeButtonHover } : styles.removeButton}
            onMouseEnter={() => handleMouseEnter(`delete-${course._id}`)}
            onMouseLeave={handleMouseLeave}
          >
            ✕
          </button>
        </div>
      ));
  };

  const renderYear = (year) => {
    return (
      <div key={year} style={styles.yearContainer}>
        <div style={styles.yearHeader}>{year}</div>
        <div style={styles.semesterContainer}>
          <div style={styles.semesterColumn}>
            <div style={styles.semesterHeader}>Fall</div>
            {renderCourseRows('Fall', year)}
          </div>
          <div style={styles.semesterColumn}>
            <div style={styles.semesterHeader}>Winter</div>
            {renderCourseRows('Winter', year)}
          </div>
          <div style={styles.semesterColumn}>
            <div style={styles.semesterHeader}>Spring</div>
            {renderCourseRows('Spring', year)}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <h1>Degree Planner</h1>
      <div style={styles.inputGroup}>
        <input
          type="text"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          placeholder="Course Name"
          style={styles.input}
        />
        <input
          type="text"
          value={courseCode}
          onChange={(e) => setCourseCode(e.target.value)}
          placeholder="Course Code"
          style={styles.input}
        />
        <input
          type="number"
          value={credits}
          onChange={(e) => setCredits(e.target.value)}
          placeholder="Credits"
          style={styles.input}
        />
        <select
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          style={styles.input}
        >
          <option value="">Select Semester</option>
          <option value="Fall">Fall</option>
          <option value="Winter">Winter</option>
          <option value="Spring">Spring</option>
        </select>
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          style={styles.input}
        >
          <option value="">Select Year</option>
          <option value="1">Year 1</option>
          <option value="2">Year 2</option>
          <option value="3">Year 3</option>
          <option value="4">Year 4</option>
        </select>
        <button
          onClick={handleAddCourse}
          style={hoveredButton === 'addCourse' ? { ...styles.button, ...styles.buttonHover } : styles.button}
          onMouseEnter={() => handleMouseEnter('addCourse')}
          onMouseLeave={handleMouseLeave}
        >
          Add Course
        </button>
        {errorMessage && <p style={styles.error}>{errorMessage}</p>}
      </div>
      <div style={styles.gridContainer}>
        <div style={styles.headerRow}>
          <div style={styles.headerCell}></div>
          <div style={styles.headerCell}>FALL</div>
          <div style={styles.headerCell}>WINTER</div>
          <div style={styles.headerCell}>SPRING</div>
        </div>
        {['Year 1', 'Year 2', 'Year 3', 'Year 4'].map(renderYear)}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    marginBottom: '20px',
  },
  input: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ced4da',
    flex: '1',
  },
  button: {
    padding: '12px 25px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
    marginTop: '10px',
    transition: 'background-color 0.3s ease',
  },
  buttonHover: {
    backgroundColor: '#0056b3',
  },
  removeButton: {
    padding: '10px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#dc3545',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.3s ease',
  },
  removeButtonHover: {
    backgroundColor: '#a71d2a',
  },
  error: {
    color: 'red',
    marginTop: '10px',
    fontWeight: 'bold',
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '10px',
    marginTop: '20px',
  },
  headerRow: {
    display: 'contents',
  },
  headerCell: {
    backgroundColor: '#f1f1f1',
    padding: '10px',
    border: '1px solid #ced4da',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  yearContainer: {
    gridColumn: '1 / span 4',
    marginTop: '10px',
  },
  yearHeader: {
    backgroundColor: '#e9ecef',
    padding: '10px',
    textAlign: 'center',
    fontWeight: 'bold',
    gridColumn: '1 / span 4',
  },
  semesterContainer: {
    display: 'contents',
  },
  semesterColumn: {
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid #ced4da',
  },
  semesterHeader: {
    backgroundColor: '#e9ecef',
    padding: '10px',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  courseRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px',
    borderBottom: '1px solid #ced4da',
  },
  courseCell: {
    flex: '1',
    textAlign: 'center',
  },
};

export default DegreePlanner;
