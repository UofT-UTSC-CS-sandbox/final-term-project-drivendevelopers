import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './signupLogin/Login';
import Register from './signupLogin/Register';
import Dashboard from './Dashboard';
import ProfileView from './profile/ProfileView';
import EditProfileForm from './profile/EditProfileForm';
import ProjectList from './projects/ProjectList';
import AddProject from './projects/AddProject';
import SearchUser from './SearchUser';
import Notifications from './Notifications';
import FriendList from './FriendList';
import Discussions from './discussionBoard/Discussions';
import NewDiscussion from './discussionBoard/NewDiscussion';
import DiscussionDetail from './discussionBoard/DiscussionDetail';
import GpaCalculator from './GpaCalculator'; 
import EventCalendar from './EventCalendar';
import ResourceLibrary from './resourceLib/ResourceLibrary';
import AddResource from './resourceLib/AddResource';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile-view" element={<ProfileView />} />
        <Route path="/profile-view/:id" element={<ProfileView readOnly={true} />} />
        <Route path="/edit-profile" element={<EditProfileForm />} />
        <Route path="/project-list" element={<ProjectList />} />
        <Route path="/add-project" element={<AddProject />} />
        <Route path="/connect" element={<SearchUser />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/friend-list" element={<FriendList />} />
        <Route path="/discussions" element={<Discussions />} />
        <Route path="/new-discussion" element={<NewDiscussion />} />
        <Route path="/discussion/:discussionId" element={<DiscussionDetail />} />
        <Route path="/gpa-calc" element={<GpaCalculator />} />
        <Route path="/eventCalendar" element={<EventCalendar />} />
        <Route path="/resource-library" element={<ResourceLibrary />} />
        <Route path="/add-resource" element={<AddResource />} />
      </Routes>
    </Router>
  );
};

export default App;
