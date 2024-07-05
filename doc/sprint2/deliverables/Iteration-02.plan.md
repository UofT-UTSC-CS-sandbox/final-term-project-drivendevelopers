# Edu Prodigi/Driven Developers

## Iteration 02

 * Start date: June 22nd, 2024
 * End date: July 4th, 2024

## Process

During our first meeting (planning meeting), we once again discussed the practices that we implemented in the previous sprint which we felt were not effective and possibly counter-productive. We then discussed alterantive or changed practices we could implement instead. Our hope is to patch some of the coordination and teamwork issues we experienced during our first development period, sprint 1.

#### Changes from previous iteration

1. **Scheduled Pair Programming Sessions:** - In this sprint we will schedule programming sessions with each other in pairs. Last sprint, we tried to have group coding sessions, which turned out to be extremely inefficient, as we were often discussing multiple topics at once. Our hope is that if we are working in pairs on a single feature at a time, it will be easier to remain focused and operate effectively. If we are able to leave a coding session, having completed one subtask, we can deem it successful.

2. **Stricter Documentation Practices:** - In this sprint, we will break our Jira tasks into smaller subtasks and also try to update our documentation more regulary. This includes regularly updating standup notes in the slack chat as well. Last sprint, our communication was very unorganized and it created many complications and confusions among us. By making this change we hope to be able to communicate more effectively, remain organized, and keep each other updated. If we are able to get through the entire sprint without having to have any meetings simply due to confusion among group members (as we did last sprint), we can dee it successful. 


#### Roles & responsibilities
- **Tamam Makki**: Responsible for the implementation of the user search feature and displaying a list of friends for the currently logged in user.
- **Harish Thevakumaran**: Responsible for implementing sending and accepting/declining friend requests among users.
- **Hamza Khalid**: Responsible for connection suggestion feature, where users are recommended other users to connect with based on their interests.



#### Events

**Online Meetings on Zoom:**
- **When:** Every weekday at 5:30 pm
- **Where:** Online via Zoom
- **Purpose:**
  - To understand each other's roles and responsibilities.
  - To identify and resolve blockers.
  - To track progress and ensure alignment with iteration goals.
  - To discuss any issues or challenges encountered during development.

**Scheduled Pair Programming Sessions**
- **When:** as needed throughout the sprint at 5:30 pm
- **Where:** Online via Zoom
- **Purpose:**
  - to speed up development and code quality by having two people discussing the code (its weaknesses, design, etc.) during its implementation


#### Artifacts

**To-do List:**
- **Purpose:** To keep track of individual tasks and ensure the needed attention is given to each task. 
- **Process:** We will be using a Google Docs document to make our to-do list. Each group member will have their own page where their taks will be listed. These tasks and who they were assigned to was decided upon in our planning meeting based on a general consensus (of who we felt could best complete the task).

**Task Boards:**
- **Purpose:** To visualize the progress of each of our tasks using Jira.
- **Process:** Each of the main features we are implementing have 1-2 tickets (user stories) created for them. Within these stories, we add subtasks in order to break down the task and keep track of its progress more accurately.

**Schedule:**
- **Purpose:** To manage deadlines and ensure timely completion of tasks.

**Meeting Notes:**
- **Purpose:** To document discussions and decisions made during meetings for future reference.


#### Git / GitHub workflow

Within this sprint we have 3 separate features including user search, sending friend requests, and friend recommendations. For each of these, we create a separate github branch which begins with the "feature/" heading. These branches are created based on our develop branch which is where all of the feature/ branches are combined towards the end of each sprint. The develop branch was created in order to perform testing and view the final product before pushing new code to our main branch. 

Once we test and push our updated code to our own feature branches, Tamam is in charge of reviewing the code and performing his own testing of the feature. Once this was done, he will merge each of the branches with develop. This will help us avoid conflicts, as there will only be one person making commits and pushes to the develop branch. Also, since the friend request and friend recommendation features are somewhat related, Harish and Hamza will keep close communication with each other (regarding their progress and changes made to the code). 

We chose this workflow because we felt that it would provide a high level of organization, communication, and the least number of conflicts during our development.


## Product

#### Goals and tasks

**Goal:** To implement the user search, friend request, and friend recommendation features of the Edu Prodigi app in an organized and efficient manner. The purpose of these features is to allow users to be able to connect and network.

**Tasks:**
- **Friend Requests Implementation (Harish Thevakumaran):**
  - Add button to user search feature for users to send a friend request
  - Add notification funcitonality for users to accept or decline a request
  - develop appealing frontend UI and backend endpoints to retrieve and send requests
- **Search User Implementation (Tamam Makki):**
  - determine which user profile fields are relevant as part of a search criteria --> develop search filters
  - develop frontend UI (search filters on left side of the page and results shown in a list on the right side) and backend logic for users to be able to search our database of users to find people they are interested in connecting with
  - integrate frontend to backend and test functionality of feature
- **Friends List Implementation (Tamam Makki):**
  - develop frontend UI and backend logic for users to be able to see a list of all of their friends
  - query database of users to find all of the logged in user's friends
  - add the ability for users to view profiles and remove friends from this list as they please
- **Friend Recommendations Implementation (Hamza Khalid):**
  - create and implement algorithm (backend logic) to recommend users as potential connections based on similar academic and personal interests
  - implement frontend interface on dashboard for users to see recommendations


#### Artifacts

- **Rough Attempt at Frontend UI** we will sit in a group setting and produce a mock version of the searching and recommendation user interfaces to determine what kind of design seems most suitable. The considerations in this process include determining what seems most intuitive and obvious to a new user. This will be done using just the frontend code for the page. This will be useful for our team, as our app design was not the greatest in the previous sprint. By discussing it as a group, we can receive each other's feedback and work collaboratively to make design decisions.

- **Description of Frontend UI** we will sit in a group setting and describe what exactly we want users to be able to do within the scope of each feature. This is done to reduce time wasted in deciding what components to include or not to include, as we did during the previous sprint. By getting each other's input we can arrive at a final solution more quickly and know exactly how the features each need to be developed.


