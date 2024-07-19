# Edu Prodigi/Driven Developers

## Iteration 03

 * Start date: July 8th, 2024
 * End date: July 19th, 2024

## Process

During our first meeting (planning meeting), we once again discussed the practices that we implemented in the previous sprint which we felt were not effective and possibly counter-productive. We then discussed alterantive or changed practices we could implement instead. Our hope is to patch some of the coordination and teamwork issues we experienced during our second development period, sprint 2.

#### Changes from previous iteration

1. **Dedicated time for documentation:** - In this sprint we will schedule time specifically for us to create and organize our various forms of documentation. This includes standup notes, as well as all of the deliverables which we are required to produce for this sprint. Our current idea is to dedicate a moment at the end of each standup to go over relevant documentation and make any changes that need to be made. We believe that this is the next step in our progression which will help us improve our documentation habits even more than we did in the previous sprint.

2. **Enhanced Task Management:** - In this sprint, we will attempt to do a better job of organizing our JIRA board and managing it as well. In the previous sprints, we did not always have the descriptions for tasks and subtasks as we should have (or did not add descriptions until features were already done). We look to change that by doing our best to add those elements as soon as possible, towards the beginning of the sprint.


#### Roles & responsibilities
- **Tamam Makki**: Responsible for the implementation of the Discussion Board feature, made for students to communicate.
- **Harish Thevakumaran**: Responsible for implementing the Shared Event Calendar feature.
- **Hamza Khalid**: Responsible for implementing the GPA calculator tool.



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

Within this sprint we have 3 separate features including the Discussion Board, Shared Event Calendar, and the GPA Calculator. For each of these, we create a separate github branch which begins with the "feature/" heading. These branches are created based on our develop branch which is where all of the feature/ branches are combined towards the end of each sprint. The develop branch was created in order to perform testing and view the final product before pushing new code to our main branch. 

Once we test and push our updated code to our own feature branches, Tamam is in charge of reviewing the code and performing his own testing of the feature. Once this is done, he will merge each of the branches with develop. This will help us avoid conflicts, as there will only be one person making commits and pushes to the develop branch. 

We chose this workflow because we felt that it would provide a high level of organization, communication, and the least number of conflicts during our development.


## Product

#### Goals and tasks

**Goal:** To implement the Discussion Board, Shared Event Calendar, and the GPA Calculator features of the Edu Prodigi app in an organized and efficient manner. The purpose of these features is to allow users to be able to network and organize their academic affairs.

**Tasks:**
- **Discussion Board Implementation (Tamam Makki):**
  - Develop frontend list interface where users can see all discussions, click on them to access them, and create new posts
  - Develop frontend discussion post interface where users can view a post and comment on it
  - Develop backend logic to store and retrieve posts and comments, then integrate it with the frontend
- **Shared Event Calendar Implementation (Harish Thevakumaran):**
  - Integrate calendar within react and create frontend interface for users to add events
  - Develop frontend interface to display event information and allow users to RSVP and remove themselves from events
  - Develop backend endpoints and logic to store and retrieve events, displaying them on the calendar
- **GPA Caclulator Implementation (Hamza Khalid):**
  - develop frontend calendar user interface for current and future grades to be entered by users
  - develop backend logic for users to store their calculations for future reference


#### Artifacts

- **Rough Attempt at Frontend UI** we will sit in a group setting and produce a mock version of the searching and recommendation user interfaces to determine what kind of design seems most suitable. The considerations in this process include determining what seems most intuitive and obvious to a new user. This will be done using just the frontend code for the page. This will be useful for our team, as our app design was not the greatest in the previous sprint. By discussing it as a group, we can receive each other's feedback and work collaboratively to make design decisions.

- **Description of Frontend UI** we will sit in a group setting and describe what exactly we want users to be able to do within the scope of each feature. This is done to reduce time wasted in deciding what components to include or not to include, as we did during our initial development sprint. This happened to work quite well for us in Sprint 2. By getting each other's input we can arrive at a final solution more quickly and know exactly how the features each need to be developed.


