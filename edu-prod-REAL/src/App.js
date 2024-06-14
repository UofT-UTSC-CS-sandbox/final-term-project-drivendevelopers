// App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './signupLogin/Login';
import Register from './signupLogin/Register';
import Dashboard from './Dashboard';
import ProfileView from './profile/ProfileView';
import EditProfileForm from './profile/EditProfileForm';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile-view" element={<ProfileView />} />
        <Route path="/edit-profile" element={<EditProfileForm />} />
      </Routes>
    </Router>
  );
};

export default App;
