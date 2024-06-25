import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const styles = {
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: '100vh', // Ensure it covers the full viewport height
    backgroundColor: '#000',
    color: '#fff',
    padding: '20px', // Add padding for better spacing
    boxSizing: 'border-box',
  },
  formTitle: {
    fontFamily: 'Impact, sans-serif',
    fontSize: '5rem',
    color: '#ff4d4f',
    marginBottom: '1.5rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '300px',
  },
  formGroup: {
    marginBottom: '1rem',
    width: '100%',
  },
  formLabel: {
    marginBottom: '0.5rem',
    fontSize: '1.2rem',
    fontWeight: 'bold',
  },
  formInput: {
    padding: '10px',
    borderRadius: '20px',
    border: 'none',
    width: '100%',
    marginBottom: '0.5rem',
    backgroundColor: '#333',
    color: '#fff',
  },
  formButton: {
    padding: '10px 20px',
    borderRadius: '20px',
    border: 'none',
    backgroundColor: '#ff4d4f',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '1.5rem',
    marginTop: '1rem',
    fontWeight: 'bold',
  },
  backButton: {
    padding: '10px 20px',
    borderRadius: '20px',
    border: 'none',
    backgroundColor: '#333',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '1.5rem',
    marginTop: '1rem',
    fontWeight: 'bold',
  },
  interestCheckbox: {
    display: 'block',
    marginBottom: '5px',
  },
  courseContainer: {
    marginTop: '10px',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  courseItem: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '5px',
    justifyContent: 'space-between',
    backgroundColor: '#333',
    borderRadius: '10px',
    padding: '5px 10px',
  },
  removeButton: {
    backgroundColor: '#ff4d4f',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    padding: '5px 10px',
    cursor: 'pointer',
  },
  profilePicturePreview: {
    marginTop: '10px',
    width: '100px',
    height: '100px',
    borderRadius: '50%',
  },
};

const academicInterests = [
  'Computer Science',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
];

const EditProfileForm = () => {
  const [programName, setProgramName] = useState('');
  const [yearOfStudy, setYearOfStudy] = useState('');
  const [fullName, setFullName] = useState('');
  const [gpa, setGpa] = useState('');
  const [description, setDescription] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [courses, setCourses] = useState('');
  const [coursesList, setCoursesList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/profile', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile data');
      }

      const data = await response.json();
      setFullName(data.fullName);
      setProgramName(data.programName);
      setYearOfStudy(data.yearOfStudy);
      setGpa(data.gpa);
      setDescription(data.description);
      setProfilePictureUrl(data.profilePicture);
      setSelectedInterests(data.interests || []);
      setCoursesList(data.courses || []);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('fullName', fullName);
      formData.append('programName', programName);
      formData.append('yearOfStudy', yearOfStudy);
      formData.append('gpa', gpa);
      formData.append('description', description);
      formData.append('interests', JSON.stringify(selectedInterests));
      formData.append('courses', JSON.stringify(coursesList));

      if (profilePicture) {
        formData.append('profilePicture', profilePicture);
      }

      const response = await fetch('http://localhost:5000/api/profile', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to update profile: ${errorMessage}`);
      }

      navigate('/profile-view');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleFileChange = (event) => {
    setProfilePicture(event.target.files[0]);
  };

  const handleBack = () => {
    navigate('/profile-view');
  };

  const handleInterestChange = (event) => {
    const value = event.target.value;
    setSelectedInterests(
      selectedInterests.includes(value)
        ? selectedInterests.filter((interest) => interest !== value)
        : [...selectedInterests, value]
    );
  };

  const handleCoursesChange = (event) => {
    setCourses(event.target.value);
  };

  const handleCoursesKeyPress = (event) => {
    if (event.key === 'Enter' && courses.trim()) {
      setCoursesList([...coursesList, courses.trim()]);
      setCourses('');
      event.preventDefault();
    }
  };

  const handleCourseRemove = (index) => {
    setCoursesList(coursesList.filter((_, i) => i !== index));
  };

  return (
    <div style={styles.formContainer}>
      <h1 style={styles.formTitle}>Edit Profile</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.formLabel}>Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            style={styles.formInput}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.formLabel}>Program Name</label>
          <input
            type="text"
            value={programName}
            onChange={(e) => setProgramName(e.target.value)}
            style={styles.formInput}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.formLabel}>Year of Study</label>
          <input
            type="text"
            value={yearOfStudy}
            onChange={(e) => setYearOfStudy(e.target.value)}
            style={styles.formInput}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.formLabel}>GPA</label>
          <input
            type="text"
            value={gpa}
            onChange={(e) => setGpa(e.target.value)}
            style={styles.formInput}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.formLabel}>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ ...styles.formInput, height: '100px', resize: 'none' }}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.formLabel}>Academic Interests</label>
          <div>
            {academicInterests.map((interest) => (
              <label key={interest} style={styles.interestCheckbox}>
                <input
                  type="checkbox"
                  value={interest}
                  checked={selectedInterests.includes(interest)}
                  onChange={handleInterestChange}
                  style={{ marginRight: '10px' }}
                  />
                  {interest}
                </label>
              ))}
            </div>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Courses</label>
            <input
              type="text"
              value={courses}
              onChange={handleCoursesChange}
              onKeyPress={handleCoursesKeyPress}
              style={styles.formInput}
            />
            <div style={styles.courseContainer}>
              {coursesList.map((course, index) => (
                <div key={index} style={styles.courseItem}>
                  <span>{course}</span>
                  <button
                    type="button"
                    onClick={() => handleCourseRemove(index)}
                    style={styles.removeButton}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Profile Picture</label>
            <input type="file" onChange={handleFileChange} />
            {profilePictureUrl && (
              <img
                src={`http://localhost:5000${profilePictureUrl}`}
                alt="Profile"
                style={styles.profilePicturePreview}
              />
            )}
          </div>
          <button type="submit" style={styles.formButton}>
            Save
          </button>
          <button type="button" onClick={handleBack} style={styles.backButton}>
            Back to Profile
          </button>
        </form>
      </div>
    );
  };
  
  export default EditProfileForm;
  
