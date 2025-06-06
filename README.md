# HAND - RedBack Repository

## Project Overview

HAND is a classroom communication and engagement web application designed to enhance student participation by streamlining attendance tracking, improving participation management, and facilitating a more interactive learning environment through real-time interactions.

## Repository Structure
```
├── docs/   - Project documentation exported from GitHub Wiki
└── src/    - Source code of the project
    ├── client/ - Teacher and student frontend interfaces
    └── server/ - Backend server and database model
```

## Deployed Product

* [Teacher entry](https://ha-redback-rp87.onrender.com/)
* [Student entry](https://ha-redback-rp87.onrender.com/join-class)
* More details in [GitHub Wiki](https://github.com/FEIT-COMP90082-2025-SM1/HA-RedBack/wiki/Product-Deployment)

## Local Setup Instruction

### Frontend

1. In the directory `src/client/`, run `npm install` to install all modules
2. Run `npm start` to open the frontend pages

### Backend

#### Database installation

1. Download [MySQL Installer](https://dev.mysql.com/downloads/installer/)
2. Install MySQL Server (your database) and Workbench (database frontend) and set your "Root Account Password"
3. Open MySQL Workbench and click the '+' button as below:
![setup-connection](https://github.com/user-attachments/assets/d108a5c0-7f19-4b76-a0f5-35119883f3f1)
4. Fill in connection details:
    |  | Default |
    |--|--|
    | hostname | 127.0.0.1 |
    | port     | 3306 |
    | username | root |
    | password | [your Root Account Password] |
5. Click the connection just created, switch the Navigator panel on the left to the Schemas tab. Right-click in the panel and select `Create Schema...` to create one
6. Double click to select the schema (optionally selecting `Set as Default Schema` in the right-click menu)

#### Connecting to Node.js

(The following processes are completed in `src/server/`)

1. Ensure all Node modules are installed via `npm install`
2. Create the file `.env` and fill in the database config and other environment variables (a DeepL API account is required if you want access to the translation feature):
    ```
    DB_USER=root
    DB_PASS=[Root Account Password]
    DB_NAME=[Name of schema]
    DB_HOST=127.0.0.1

    DEEPL_KEY=[Your DeepL API key]
    ```
3. Run `npm run db:rebuild` to (delete and) recreate database tables and fill in seeders
4. Run `npm start` to launch the backend server

## Changelog

### Sprint 1

* Added documentation in Wiki, including group contract, project overview, prototype validation, user story and version control plan

### Sprint 2

#### New Features

* Students submit silent responses 
* Teachers receive responses in real time
* Teachers view responses in an organised manner
* Teachers provide feedback on student responses
* Students submit responses anonymously

#### Documentation Updates

* New documentation:
    * Sprint 1 Review
    * Sprint 2 Review & Planning
    * Client meeting minutes
    * Draft of Sprint 3 Planning
    * Code review
    * Feedback and reflection based on Sprint 1
    * Introduction to the deployed website
    * Introduction to the task board
    * Test cases
    * Task Estimation and Tracking
    * Functional and non-functional requirements
* User story overview and mapping - added non-functional requirements
* Re-estimated some story points
* Project overview - more details of the team member roles
* Version control plan - more details & moved from README to Wiki

### Sprint 3

#### New Features

* Teachers can edit or delete feedback.
* Teachers can filter responses by course and class.
* Teachers can see which students have liked their feedback.
* Students can be locked from editing responses after teachers have provided feedback.
* Students can give a like to teachers’ feedback and can cancel the like.
* Students can write responses in another language (can translate their responses to English).
* Teachers can register and log in to an account.
* Teachers can create a course.
* Teachers can start a session to host a class.
* Teachers can close a session
* Teachers can view the list of students who joined
* Students can join a class with an invite code

#### Documentation Updates

* New documentation:
    * Ethical Considerations - [Link](https://github.com/FEIT-COMP90082-2025-SM1/HA-RedBack/wiki/Ethical-Considerations)
    * Cyber Security Considerations - [Link](https://github.com/FEIT-COMP90082-2025-SM1/HA-RedBack/wiki/Cyber-Security-Considerations)
    * Sprint 3 Test cases - [Link](https://github.com/FEIT-COMP90082-2025-SM1/HA-RedBack/wiki/Silent-Response-Tool-Test-Cases-%E2%80%93-Sprint-3)
    * Burndown Chart - [Link](https://github.com/FEIT-COMP90082-2025-SM1/HA-RedBack/wiki/Burndown-chart)
    * Sprint 3 Review - [Link](https://github.com/FEIT-COMP90082-2025-SM1/HA-RedBack/wiki/Sprint-3-Review)
    * Sprint 3 Retrospective - [Link](https://github.com/FEIT-COMP90082-2025-SM1/HA-RedBack/wiki/Sprint-3-Retrospective)
    * Sprint 4 Handover Plan - [Link](https://github.com/FEIT-COMP90082-2025-SM1/HA-RedBack/wiki/Sprint-4-Handover-Plan)
    * Sprint 3 Deployment - [Link](https://github.com/FEIT-COMP90082-2025-SM1/HA-RedBack/wiki/Sprint3-Deployment)
    * Sprint 3 Client Meeting Minutes - [Link](https://github.com/FEIT-COMP90082-2025-SM1/HA-RedBack/wiki/Client-Meetings)
    * Sprint 3 Code Review - [Link](https://github.com/FEIT-COMP90082-2025-SM1/HA-RedBack/wiki/Code-Review-&-Quality-Assurance:-Sprint-3)
* Updated documentation:
    *  Sprint 3 Planning - [Link](https://github.com/FEIT-COMP90082-2025-SM1/HA-RedBack/wiki/Sprint-3-Planning)
    *  Task Estimation and Tracking - [Link](https://github.com/FEIT-COMP90082-2025-SM1/HA-RedBack/wiki/Task-Estimation-and-Tracking)

