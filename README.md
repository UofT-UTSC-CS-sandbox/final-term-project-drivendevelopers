Overview
Welcome to EduProdigi! This application is designed to create a vibrant online community for academic students, allowing for engage in meaninful and open connections, collaborate on projects, promote academic interests and growth. Engineered with the needs of students in mind, EduProdigi app offers a comprehensive and useful features for the students to assist in the expansion of their professional networks, develop experience in collaboration projects, and finally make use of the university experience.

Motivation
This application's main goal is to transform the way students interact with the academic environment they are use too. By providing a user-centric and friendly platform, it promotes students to connect with their peers, faculty, and potential mentors/collaborators, hence creating a very supportative network for students that exists beyond just the classroom constraints.

The technology stack that will be prevelant in this application consists of NextJS, React, Tailwind CSS utility, and Neo4j. NextJS is utilized in a way that serves the web framework functionalities such as building the server rendered React application and components and use route endpoints using API endpoints to hold and handle the backend logic. We will have a pages directory which Next JS will correspond to the URL structure.React will be used for actually building the components and user interface based on the component-based architecture and easy management of the DOM and management of the props (input), state, and component lifecycle. The tailwind aspect is our utility CSS framework to develop the our HTML designs and incorporate them into our react components/functions. Neo4j utilizes a graph database which our application will be leveraging as the backend database for the React app which will consist of our nodes, relationships, and properties. Neo4j will be integrated into the React architecture through an NextJS server which we use to interact with the Neo4J database, and within the React components in the pages directory the API routes will connect to the NextJS and handle NextJS requests to the Neo4j database. We will implement all of these technology stacks using the three tier architecture pattern with a presentation, application, and data tier, for flexibility and scalability in our app.

Getting Started/Installation
Please CD into Eduprodigi directory then run the dev server. First, run the dev server:

npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
Open http://localhost:3000 with your browser to see the result.

You can start editing the page by modifying app/page.js. The page auto-updates as you edit the file.

This project uses next/font to automatically optimize and load Inter, a custom Google Font.

Contribution
Contribution to this repository requires leveraging the practices of git flow to structure the repo commits and ensure coordination across instances. Our github repo will consist of a main branch, a feature branch, dev branch.

Main Branch - This will be our production based code. These commits to this branch will be associated with releae versions

Develop Branch - This is our integration branch for the features and stories we develop. The new features once confirmed working will be put into the develop branch.

Feature Branch - This is created from the dev branch and features will be developed here. After completed it is merged into develop branch again. If any issues in feature, we can revert that feature from the develop branch.

We will be using github issues to raise any issues in any features developed and will have developer assigned to work on it.

We will be using pull requests to initiate our changes into the repo as well and review the changes with everyone so that we can compare the difference between the source branch and the target branch
