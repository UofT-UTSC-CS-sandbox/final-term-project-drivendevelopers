import React, { useState, useEffect } from 'react';

const GRADE_VALUES = {
  'A+ (90-100)': 4.0,
  'A (85-89)': 4.0,
  'A- (80-84)': 3.7,
  'B+ (77-79)': 3.3,
  'B (73-76)': 3.0,
  'B- (70-72)': 2.7,
  'C+ (67-69)': 2.3,
  'C (63-66)': 2.0,
  'C- (60-62)': 1.7,
  'D+ (57-59)': 1.3,
  'D (53-56)': 1.0,
  'D- (50-52)': 0.7,
  'F (0-49)': 0.0,
};

const GpaCalculator = () => {
  const [courses, setCourses] = useState([{ name: '', weight: '0.5', grade: '' }]);
  const [potentialCourses, setPotentialCourses] = useState([{ name: '', weight: '0.5', grade: '' }]);
  const [currentGpa, setCurrentGpa] = useState('');
  const [currentCgpa, setCurrentCgpa] = useState('');
  const [completedCredits, setCompletedCredits] = useState('');
  const [potentialGpa, setPotentialGpa] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [savedGpas, setSavedGpas] = useState([]);
  const [hoveredButton, setHoveredButton] = useState('');

  useEffect(() => {
    fetchSavedGpas();
  }, []);

  const fetchSavedGpas = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/gpa', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch saved GPAs');
      }

      const data = await response.json();
      setSavedGpas(data);
    } catch (err) {
      console.error('Error fetching saved GPAs:', err.message);
    }
  };

  const handleCourseChange = (index, field, value) => {
    const newCourses = [...courses];
    newCourses[index][field] = value;
    setCourses(newCourses);
  };

  const handlePotentialCourseChange = (index, field, value) => {
    const newPotentialCourses = [...potentialCourses];
    newPotentialCourses[index][field] = value;
    setPotentialCourses(newPotentialCourses);
  };

  const handleAddCourse = () => {
    setCourses([...courses, { name: '', weight: '0.5', grade: '' }]);
  };

  const handleAddPotentialCourse = () => {
    setPotentialCourses([...potentialCourses, { name: '', weight: '0.5', grade: '' }]);
  };

  const handleRemoveCourse = (index) => {
    const newCourses = courses.filter((_, i) => i !== index);
    setCourses(newCourses);
  };

  const handleRemovePotentialCourse = (index) => {
    const newPotentialCourses = potentialCourses.filter((_, i) => i !== index);
    setPotentialCourses(newPotentialCourses);
  };

  const calculateGpa = (courses) => {
    const totalWeight = courses.reduce((acc, course) => acc + parseFloat(course.weight || 0), 0);
    const totalGradePoints = courses.reduce(
      (acc, course) => acc + (parseFloat(course.weight || 0) * GRADE_VALUES[course.grade]),
      0
    );
    return (totalGradePoints / totalWeight).toFixed(2);
  };

  const handleSaveGpa = async (type) => {
    const token = localStorage.getItem('token');
    const gpa = type === 'current' ? calculateGpa(courses) : potentialGpa;

    try {
      const response = await fetch('http://localhost:5000/api/gpa', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courses: type === 'current' ? courses : potentialCourses,
          gpa,
          type,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save GPA calculation');
      }

      setSavedGpas([...savedGpas, { courses: type === 'current' ? [...courses] : [...potentialCourses], gpa, type }]);
      setCourses([{ name: '', weight: '0.5', grade: '' }]);
      setPotentialCourses([{ name: '', weight: '0.5', grade: '' }]);
    } catch (err) {
      console.error('Error saving GPA calculation:', err.message);
    }
  };

  const handleDeleteGpa = async (index) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/gpa/${index}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete saved GPA');
      }

      const updatedSavedGpas = savedGpas.filter((_, i) => i !== index);
      setSavedGpas(updatedSavedGpas);
    } catch (err) {
      console.error('Error deleting saved GPA:', err.message);
    }
  };

  const handleCalculateGpa = () => {
    if (courses.some(course => !course.name || !course.weight || !course.grade)) {
      setErrorMessage('All fields must be filled in');
      return;
    }

    const calculatedGpa = calculateGpa(courses);
    setCurrentGpa(calculatedGpa);
    setErrorMessage('');
  };

  const handleCalculatePotentialGpa = () => {
    if (currentGpa === '' && currentCgpa === '') {
      setErrorMessage('Please enter either calculated GPA or current CGPA');
      return;
    }

    if (completedCredits === '' || potentialCourses.some(course => !course.name || !course.weight || !course.grade)) {
      setErrorMessage('All fields must be filled in');
      return;
    }

    const currentGpaPoints = currentCgpa ? parseFloat(currentCgpa) * parseFloat(completedCredits) : parseFloat(currentGpa) * parseFloat(completedCredits);
    const futureGpaPoints = potentialCourses.reduce(
      (acc, course) => acc + (parseFloat(course.weight) * GRADE_VALUES[course.grade]),
      0
    );
    const totalCredits = parseFloat(completedCredits) + potentialCourses.reduce((acc, course) => acc + parseFloat(course.weight), 0);
    const calculatedPotentialGpa = ((currentGpaPoints + futureGpaPoints) / totalCredits).toFixed(2);

    setPotentialGpa(calculatedPotentialGpa);
    setErrorMessage('');
  };

  const handleReset = () => {
    setCourses([{ name: '', weight: '0.5', grade: '' }]);
    setPotentialCourses([{ name: '', weight: '0.5', grade: '' }]);
    setCurrentGpa('');
    setCurrentCgpa('');
    setCompletedCredits('');
    setPotentialGpa('');
    setErrorMessage('');
  };

  const handleMouseEnter = (buttonType) => {
    setHoveredButton(buttonType);
  };

  const handleMouseLeave = () => {
    setHoveredButton('');
  };

  return (
    <div style={styles.container}>
      <h1>GPA Calculator</h1>
      <div style={styles.inputGroup}>
        <h2>Current GPA Calculation</h2>
        {courses.map((course, index) => (
          <div key={index} style={styles.courseRow}>
            <input
              type="text"
              value={course.name}
              onChange={(e) => handleCourseChange(index, 'name', e.target.value)}
              placeholder="Course Name"
              style={styles.input}
            />
            <select
              value={course.weight}
              onChange={(e) => handleCourseChange(index, 'weight', e.target.value)}
              style={styles.input}
            >
              <option value="0.5">0.5</option>
              <option value="1">1</option>
            </select>
            <select
              value={course.grade}
              onChange={(e) => handleCourseChange(index, 'grade', e.target.value)}
              style={styles.input}
            >
              <option value="">Select a grade</option>
              {Object.keys(GRADE_VALUES).map((grade) => (
                <option key={grade} value={grade}>
                  {grade}
                </option>
              ))}
            </select>
            <button
              onClick={() => handleRemoveCourse(index)}
              style={hoveredButton === `remove-${index}` ? { ...styles.removeButton, ...styles.removeButtonHover } : styles.removeButton}
              onMouseEnter={() => handleMouseEnter(`remove-${index}`)}
              onMouseLeave={handleMouseLeave}
            >
              ✕
            </button>
          </div>
        ))}
        <button
          onClick={handleAddCourse}
          style={hoveredButton === 'addCourse' ? { ...styles.addButton, ...styles.addButtonHover } : styles.addButton}
          onMouseEnter={() => handleMouseEnter('addCourse')}
          onMouseLeave={handleMouseLeave}
        >
          Add Course
        </button>
        <button
          onClick={handleCalculateGpa}
          style={hoveredButton === 'calculateGpa' ? { ...styles.button, ...styles.buttonHover } : styles.button}
          onMouseEnter={() => handleMouseEnter('calculateGpa')}
          onMouseLeave={handleMouseLeave}
        >
          Calculate GPA
        </button>
        {errorMessage && <p style={styles.error}>{errorMessage}</p>}
        {currentGpa && <h2>Current GPA: {currentGpa}</h2>}
      </div>
      <div style={styles.inputGroup}>
        <h2>Potential GPA Calculation</h2>
        <div style={styles.courseRow}>
          <input
            type="text"
            value={completedCredits}
            onChange={(e) => setCompletedCredits(e.target.value)}
            placeholder="Completed Credits"
            style={styles.input}
          />
        </div>
        <div style={styles.courseRow}>
          <input
            type="text"
            value={currentCgpa}
            onChange={(e) => setCurrentCgpa(e.target.value)}
            placeholder="Current CGPA (optional)"
            style={styles.input}
          />
        </div>
        {potentialCourses.map((course, index) => (
          <div key={index} style={styles.courseRow}>
            <input
              type="text"
              value={course.name}
              onChange={(e) => handlePotentialCourseChange(index, 'name', e.target.value)}
              placeholder="Course Name"
              style={styles.input}
            />
            <select
              value={course.weight}
              onChange={(e) => handlePotentialCourseChange(index, 'weight', e.target.value)}
              style={styles.input}
            >
              <option value="0.5">0.5</option>
              <option value="1">1</option>
            </select>
            <select
              value={course.grade}
              onChange={(e) => handlePotentialCourseChange(index, 'grade', e.target.value)}
              style={styles.input}
            >
              <option value="">Select a grade</option>
              {Object.keys(GRADE_VALUES).map((grade) => (
                <option key={grade} value={grade}>
                  {grade}
                </option>
              ))}
            </select>
            <button
              onClick={() => handleRemovePotentialCourse(index)}
              style={hoveredButton === `removePotential-${index}` ? { ...styles.removeButton, ...styles.removeButtonHover } : styles.removeButton}
              onMouseEnter={() => handleMouseEnter(`removePotential-${index}`)}
              onMouseLeave={handleMouseLeave}
            >
              ✕
            </button>
          </div>
        ))}
        <button
          onClick={handleAddPotentialCourse}
          style={hoveredButton === 'addPotentialCourse' ? { ...styles.addButton, ...styles.addButtonHover } : styles.addButton}
          onMouseEnter={() => handleMouseEnter('addPotentialCourse')}
          onMouseLeave={handleMouseLeave}
        >
          Add Course
        </button>
        <button
          onClick={handleCalculatePotentialGpa}
          style={hoveredButton === 'calculatePotentialGpa' ? { ...styles.button, ...styles.buttonHover } : styles.button}
          onMouseEnter={() => handleMouseEnter('calculatePotentialGpa')}
          onMouseLeave={handleMouseLeave}
        >
          Calculate Potential GPA
        </button>
        {errorMessage && <p style={styles.error}>{errorMessage}</p>}
        {potentialGpa && <h2>Potential GPA: {potentialGpa}</h2>}
      </div>
      <button
        onClick={() => handleSaveGpa('potential')}
        style={hoveredButton === 'savePotentialGpa' ? { ...styles.button, ...styles.buttonHover } : styles.button}
        onMouseEnter={() => handleMouseEnter('savePotentialGpa')}
        onMouseLeave={handleMouseLeave}
      >
        Save Potential GPA
      </button>
      <button
        onClick={handleReset}
        style={hoveredButton === 'reset' ? { ...styles.resetButton, ...styles.resetButtonHover } : styles.resetButton}
        onMouseEnter={() => handleMouseEnter('reset')}
        onMouseLeave={handleMouseLeave}
      >
        Reset
      </button>
      {savedGpas.length > 0 && (
        <div>
          <h2>Saved GPAs</h2>
          {savedGpas.map((entry, index) => (
            <div key={index} style={styles.savedGpa}>
              <p>GPA ({entry.type === 'current' ? 'Current' : 'Potential'}): {entry.gpa}</p>
              <ul>
                {entry.courses.map((course, idx) => (
                  <li key={idx}>
                    {course.name}: {course.grade} ({course.weight})
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleDeleteGpa(index)}
                style={hoveredButton === `delete-${index}` ? { ...styles.deleteButton, ...styles.deleteButtonHover } : styles.deleteButton}
                onMouseEnter={() => handleMouseEnter(`delete-${index}`)}
                onMouseLeave={handleMouseLeave}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
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
  },
  courseRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
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
  resetButton: {
    padding: '12px 25px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#dc3545',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
    marginTop: '10px',
    transition: 'background-color 0.3s ease',
  },
  resetButtonHover: {
    backgroundColor: '#a71d2a',
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
  addButton: {
    padding: '12px 25px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#28a745',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    transition: 'background-color 0.3s ease',
  },
  addButtonHover: {
    backgroundColor: '#218838',
  },
  error: {
    color: 'red',
    marginTop: '10px',
    fontWeight: 'bold',
  },
  savedGpa: {
    border: '1px solid #ced4da',
    borderRadius: '5px',
    padding: '15px',
    marginBottom: '15px',
    backgroundColor: '#fff',
  },
  deleteButton: {
    padding: '12px 25px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#dc3545',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
    marginTop: '10px',
    transition: 'background-color 0.3s ease',
  },
  deleteButtonHover: {
    backgroundColor: '#a71d2a',
  },
};

export default GpaCalculator;