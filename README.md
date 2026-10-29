# Student Management System

A simple MERN-stack application to register, view, search, update, and
delete student details.

## Project Links

-   **Live Presentation:**
    https://student-management-system-lv0rweuxo-sms-da55.vercel.app/
-   **GitHub Repository:**
    https://github.com/manikanta-nallamothu/StudentManagementSystem

## Features

-   Register a student
-   View registered students
-   Search students by name, email, phone, or course
-   Edit student details
-   Delete a student
-   Store student data in MongoDB Atlas
-   Responsive interface for desktop and mobile screens

## Technologies Used

-   **Frontend:** React, Vite, CSS, Axios
-   **Backend:** Node.js, Express.js
-   **Database:** MongoDB Atlas, Mongoose
-   **Deployment:** Vercel (frontend), Render (backend)

## Application Flow

``` mermaid
flowchart TD
    A[User] --> B[React Frontend]
    B -->|HTTP requests with Axios| C[Express API]
    C --> D[Mongoose]
    D --> E[(MongoDB Atlas)]
    E --> D
    D --> C
    C -->|Response| B
    B --> F[Display students or success/error message]
```

## Project Structure

``` text
StudentManagementSystem/
├── client/                     # React frontend
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.css
│   ├── package.json
│   └── ...
└── server/
    ├── package.json
    └── ExpressBackend/
        ├── server.js
        └── .env                 # Local environment variables; do not commit
```

*Your exact file structure may differ slightly.*

## Run the Project Locally

### 1. Requirements

Install:

-   Node.js and npm
-   A MongoDB Atlas account (or another configured MongoDB database)
-   Git (optional, to clone the repository)

### 2. Start the backend

Open a terminal in the `server` folder and install dependencies:

``` bash
npm install
```

Create a `.env` file inside `server/ExpressBackend/` and add your
MongoDB connection string:

``` env
MONGODB_URI=your_mongodb_connection_string
```

Replace the example value with your own MongoDB Atlas connection string.
**Do not upload your `.env` file or share your database password.**

Start the backend from the `server` folder:

``` bash
npm start
```

The backend should start on port `5000` if that is the port configured
in `server.js`.

### 3. Start the frontend

Open another terminal in the `client` folder:

``` bash
npm install
npm run dev
```

Open the local URL printed by Vite.

For local development, the API URL may be:

``` javascript
const API_URL = "http://localhost:5000/api/students";
```

For the deployed frontend, configure the API URL to point to your
deployed backend.

## API Overview

The student API supports these operations:

  Action                   HTTP method   Endpoint
  ------------------------ ------------- ---------------------
  Get or search students   GET           `/api/students`
  Register a student       POST          `/api/students`
  Update a student         PUT           `/api/students/:id`
  Delete a student         DELETE        `/api/students/:id`

Search may use a query parameter depending on the backend
implementation.

## Deployment

-   **Frontend:** Deployed on Vercel from the `client` directory.
-   **Backend:** Deployed on Render.
-   **Database:** MongoDB Atlas.

If student operations fail after deployment, check the backend logs,
confirm the `MONGODB_URI` environment variable is configured on the
backend hosting service, and verify that CORS allows your Vercel domain.

## Future Improvements

-   Add login and authentication
-   Add validation on both frontend and backend
-   Add pagination for large student lists
-   Improve automated testing

## Author

**Manikanta Nallamothu**

------------------------------------------------------------------------

This project was built as a learning project to practise React, Express,
MongoDB, and full-stack application deployment.
