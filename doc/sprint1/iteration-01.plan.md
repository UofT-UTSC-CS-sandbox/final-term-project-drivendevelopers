# Edu Prodigi

## Iteration 01
**Start date:** June 7th, 2024  
**End date:** June 14th, 2024

### Roles & Responsibilities
- **Tamam Makki**: Responsible for the implementation of user profile and assisting with projects feature.
- **Shahrokh Artaman**: Responsible for database configuration.
- **Harish Thevakumaran**: Responsible for projects feature.
- **Hamza Khalid**: Responsible for Signup and Login.

#### Events
**Online Meetings on Zoom:**
- **When:** Every weekday at 5:30 pm
- **Where:** Online via Zoom
- **Purpose:**
  - To understand each other's roles and responsibilities.
  - To identify and resolve blockers.
  - To track progress and ensure alignment with iteration goals.
  - To discuss any issues or challenges encountered during development.

**Additional Events:**
- **Coding Sessions:** Ad-hoc coding sessions as needed to pair program or tackle complex issues.
- **Standups:**
  - **Weekly Sync Meeting:** Quick sync meetings every Monday morning at 9:00 am to plan the week’s tasks.

### Artifacts
**To-do Lists:**
- **Purpose:** To keep track of individual tasks and ensure nothing is overlooked.

**Task Boards:**
- **Purpose:** To visualize the progress of tasks using Jira.

**Schedule:**
- **Purpose:** To manage deadlines and ensure timely completion of tasks.

**Meeting Notes:**
- **Purpose:** To document discussions and decisions made during meetings for future reference.

## Product
### Goals and Tasks
**Goal:** Implement the initial features (the base) of the app, including signup/login, profile editing, and adding projects to the user's profile.

**Tasks:**
- **Login and Signup Implementation (Hamza Khalid):**
  - create and style front end for signup/login (Login.js, Register.js)
  - configure and connect MongoDB in order to store user credentials (server.js)
- **Database Configuration (Shahrokh Artaman):**
  - create MongoDB database
- **Profile Management (Tamam Makki):**
  - create and style user profile components to edit and view profiles (EditProfileForm.js, ProfileView.js)
  - configure and connect MongoDB to store additional user information, create mongoose schema for users (User.js)
  - add ability to delete projects from user account, add button on frontend (ProjectList.js) and configure backend (server.js)
- **Projects Tab (Harish Thevakumaran):**
  - create and style project components to add and view projects (AddProject.js, ProjectList.js)
  - configure and connect MongoDB to store projects based on user ID, create mongoose schema for projects (Project.js, server,js)