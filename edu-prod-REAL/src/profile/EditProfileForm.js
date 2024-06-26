import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const styles = {
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: '100vh',
    backgroundColor: '#f7f7f7',
    color: '#000',
    padding: '20px',
    boxSizing: 'border-box',
  },
  formTitle: {
    fontSize: '3rem',
    color: '#333',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    maxWidth: '500px',
  },
  formGroup: {
    marginBottom: '20px',
    width: '100%',
  },
  formLabel: {
    marginBottom: '10px',
    fontSize: '1.5rem',
    color: '#000',
  },
  formInput: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    width: '100%',
    fontSize: '1rem',
  },
  formTextarea: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    width: '100%',
    fontSize: '1rem',
    resize: 'vertical',
  },
  formButton: {
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
    marginBottom: '10px',
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
  interestCheckbox: {
    display: 'inline-flex',
    alignItems: 'center',
    marginBottom: '10px',
    fontSize: '1rem',
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
    backgroundColor: '#fff',
    borderRadius: '5px',
    padding: '5px 10px',
    border: '1px solid #ccc',
  },
  removeButton: {
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    padding: '5px 10px',
    cursor: 'pointer',
    fontSize: '0.9rem',
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
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [courses, setCourses] = useState('');
  const [coursesList, setCoursesList] = useState([]);
  const [profilePicture, setProfilePicture] = useState(null); // State to store profile picture file
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
      setSelectedInterests(data.interests || []);
      setCoursesList(data.courses || []);
      // Optionally, set profile picture state if available
      // setProfilePicture(data.profilePicture);
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

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    setProfilePicture(file);
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
            style={{ ...styles.formTextarea, height: '100px' }}
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
          <div style={{ marginBottom: '10px' }}>
            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={handleProfilePictureChange}
            />
          </div>
          {/* Optional: Show file name or other details */}
          {/* {profilePicture && (
            <div>
              <p>File selected: {profilePicture.name}</p>
            </div>
          )} */}
        </div>
        <button type="submit" style={styles.formButton}>
          Save Changes
        </button>
        <button type="button" onClick={handleBack} style={styles.backButton}>
          Back
        </button>
      </form>
    </div>
  );
};

export default EditProfileForm;
