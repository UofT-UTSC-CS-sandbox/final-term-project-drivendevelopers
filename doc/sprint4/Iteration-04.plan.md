# Edu Prodigi/Driven Developers

## Iteration 04

 * Start date: July 22nd, 2024
 * End date: August 2nd, 2024

## Process

During our first meeting (planning meeting), we once again discussed the practices that we implemented in the previous sprint which we felt were not effective and possibly counter-productive. We then discussed alterantive or changed practices we could implement instead. Our hope is to patch some of the coordination and teamwork issues we experienced during our third development period, sprint 3.

#### Changes from previous iteration

1. **More Purposeful Pair Programming Sessions:** - In this sprint we will continue to have programming session in pairs, as we did in the previous sprint. We originally decided to do this to work on any bugs and also general development as needed. However, we noticed in previous sprints that sometimes we would have ill structured sessions because we had not defined exactly what we were going to work on in each of the sessions. In order to fix this, we have decided that before scheduling these sessions, we will create an outline of exactly what we want to achieve by the end of the session. We are hoping that this makes our development more efficient.

2. **Code Reviews:** - In this sprint, we will attempt to include a more in depth code review as part of our standups. It had come to our attention that we were not all completely familiar with how each of our features worked. For this reason, we are each now planning to explain our code to the rest of the group in addition to demonstrating how the feature works in the react app. We hope that this increases our overall understanding of the code and that understanding all of the code helps us with the development of our own features.


#### Roles & responsibilities
- **Tamam Makki**: Responsible for the implementation of the Shared Resource Library feature.
- **Harish Thevakumaran**: Responsible for implementing the To Do List feature.
- **Hamza Khalid**: Responsible for implementing the Degree Planner tool.



#### Events

**Online Meetings on Zoom:**
- **When:** Weekdays at 5:30 pm (every 1-2 days)
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
  - to speed up development and code quality by having two people discussing the code (its weaknesses, design, etc.) during its implementation. During this sprint, we will also be outlining exactly what is going to be completed in each of these sessions prior to the session, as mentioned earlier.


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

Within this sprint we have 3 separate features including the Shared Resource Library, To Do List and the Degree Planner. For each of these, we create a separate github branch through JIRA which begins with the "DRIV-X/feature/" heading. These branches are created based on our develop branch which is where all of the feature/ branches are combined towards the end of each sprint. The develop branch was created in order to perform testing and view the final product before pushing new code to our main branch. 

Once we test and push our updated code to our own feature branches, Tamam is in charge of reviewing the code and performing his own testing of the feature. Once this is done, Tamam and Harish will work together (on one computer) to merge each of the branches with develop. This will help us more effectively handle conflicts, as there will only be one machine which is making commits and pushes to the develop branch. The main way we will try to avoid conflicts when merging into develop at the end is by regularly pulling updates from each other's branches, making sure our code is up to date.

We chose this workflow because we felt that it would provide a high level of organization, communication, and the least number of conflicts during our development.


## Product

#### Goals and tasks

**Goal:** To implement the Shared Resource Library, To Do List, and the Degree Planner features of the Edu Prodigi app in an organized and efficient manner. The purpose of these features is to allow users to be able to work collaboratively, helping each other produce higher quality of work and also organize their academic affairs.


**Tasks:**
- **Shared Resource Library Implementation (Tamam Makki):**
  - Develop frontend list interface where users can see all resources, use tags to search for specific kinds of resources, and add new resources
  - Develop backend logic for users to be able to search based on tags associated with a resource
  - Develop backend endpoints so that users can post and retrieve resources in the library
- **To Do List Implementation (Harish Thevakumaran):**
  - Develop backend endpoints and schema for tasks, which will allow users to add and remove tasks from the list
  - Develop frontend interface to display tasks on the list and include features such as priority level and sorting filters based on priority
  - Develop backend logic to sort tasks based on priority level
- **Degree Planner Implementation (Hamza Khalid):**
  - develop frontend form to add courses and display them as part of the overall degree plan
  - develop backend logic for users to store and delete their degree plan and courses


#### Artifacts

- **Rough Attempt at Frontend UI** we will sit in a group setting and produce a mock version of the searching and recommendation user interfaces to determine what kind of design seems most suitable. The considerations in this process include determining what seems most intuitive and obvious to a new user. This will be done using just the frontend code for the page. This will be useful for our team, as our app design was not the greatest in the previous sprint. By discussing it as a group, we can receive each other's feedback and work collaboratively to make design decisions.

- **Description of Frontend UI** we will sit in a group setting and describe what exactly we want users to be able to do within the scope of each feature. This is done to reduce time wasted in deciding what components to include or not to include, as we did during our initial development sprint. This happened to work quite well for us in Sprint 2. By getting each other's input we can arrive at a final solution more quickly and know exactly how the features each need to be developed.


