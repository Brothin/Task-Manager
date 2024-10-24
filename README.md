### **Project Overview: Todo Management Application with GitHub Gist Export**

The Todo Management Application is a full-stack project developed using **Node.js**, **Express.js**, **MongoDB**, and **React.js**. The app allows users to create and manage projects, add todos to each project, and export a project summary as a secret gist on GitHub. It also implements **JWT-based authentication** to manage user sessions securely.

#### **Main Features:**
1. **Project Management**: Users can create, update, and view projects.
2. **Todo Management**: For each project, users can add, update, delete, and mark todos as complete or pending.
3. **Gist Export**: The user can export the project summary in markdown format to GitHub as a secret gist.
4. **JWT Authentication**: The app uses JSON Web Tokens for user login and registration to ensure security.

---

### Technology Stack

Backend - Node Js, Express Js, Mongoose, Jwt.

Database - Mongodb.

Fronted - React Js, React Router Dom, React Hook Form, Tailwind Css.

### **Backend Overview**

The backend is built using **Node.js** with **Express.js** and **MongoDB** for data storage. The core functionalities are divided into different controllers, models, and routes for user authentication, project management, todo management, and gist export.

#### **Endpoints**

##### **1. User Authentication**

Handles user registration and login using JWT for secure session handling.

- **POST /auth/register**  
  Registers a new user by saving their username and a hashed password into the database.
  
  Request body:
  ```json
  {
    "username": "example_user",
    "password": "example_password"
  }
  ```

  Response:
  ```json
  {
    "message": "User registered successfully"
  }
  ```

- **POST /auth/login**  
  Authenticates the user by checking the username and password. Upon successful login, a JWT token is returned to the user.

  Request body:
  ```json
  {
    "username": "example_user",
    "password": "example_password"
  }
  ```

  Response:
  ```json
  {
    "token": "<JWT_TOKEN>"
  }
  ```

##### **2. Project Management**

Manages the CRUD operations for projects.

- **POST /projects**  
  Creates a new project. The user must be authenticated (JWT token required).

  Request body:
  ```json
  {
    "title": "My New Project"
  }
  ```

  Response:
  ```json
  {
    "_id": "projectId",
    "title": "My New Project",
    "createdDate": "2024-10-24T12:34:56Z",
    "todos": []
  }
  ```

- **GET /projects**  
  Retrieves all projects associated with the logged-in user. JWT authentication required.

  Response:
  ```json
  [
    {
      "_id": "projectId1",
      "title": "Project 1",
      "createdDate": "2024-10-24T12:34:56Z",
      "todos": [ ... ]
    },
    {
      "_id": "projectId2",
      "title": "Project 2",
      "createdDate": "2024-10-23T09:45:21Z",
      "todos": [ ... ]
    }
  ]
  ```

- **GET /projects/:id**  
  Fetches a specific project by its ID.

  Response:
  ```json
  {
    "_id": "projectId",
    "title": "Project 1",
    "createdDate": "2024-10-24T12:34:56Z",
    "todos": [
      {
        "_id": "todoId1",
        "description": "Todo description",
        "status": "pending",
        "createdDate": "2024-10-24T13:45:30Z",
        "updatedDate": "2024-10-24T14:00:12Z"
      }
    ]
  }
  ```

##### **3. Todo Management**

Allows users to create, edit, update, and delete todos associated with a project.

- **POST /todos**  
  Adds a new todo item to a specific project.

  Request body:
  ```json
  {
    "projectId": "projectId",
    "description": "Complete unit tests"
  }
  ```

  Response:
  ```json
  {
    "_id": "todoId",
    "description": "Complete unit tests",
    "status": "pending",
    "createdDate": "2024-10-24T14:00:12Z"
  }
  ```

- **PUT /todos/:id**  
  Updates an existing todo item’s description and status.

  Request body:
  ```json
  {
    "description": "Update unit tests",
    "status": "completed"
  }
  ```

  Response:
  ```json
  {
    "_id": "todoId",
    "description": "Update unit tests",
    "status": "completed",
    "updatedDate": "2024-10-24T14:10:12Z"
  }
  ```

- **DELETE /todos/:id**  
  Deletes a todo item from a project.

  Response:
  ```json
  {
    "message": "Todo deleted successfully"
  }
  ```

##### **4. Export Project Summary as GitHub Gist**

Exports the project’s todo list as a **markdown** file to a secret gist on GitHub.

- **POST /projects/export-gist/:projectId**  
  Exports the project summary in the following markdown format and uploads it as a secret gist:
  ```
  # Project Title
  
  ### Summary: <No. of completed todos> / <No. of total todos> completed

  ## Pending Todos:
  - [ ] Todo description 1
  - [ ] Todo description 2

  ## Completed Todos:
  - [x] Todo description 3
  - [x] Todo description 4
  ```

  Response:
  ```json
  {
    "gistUrl": "https://gist.github.com/..."
  }
  ```

---

### **Frontend Overview**

The frontend is built using **React.js** with **Tailwind CSS** for styling. It contains multiple pages for handling user login, project management, and todos. The app also interacts with the backend API using **Axios** to send and receive data.

#### **Pages**

##### **1. Login Page**

This page allows the user to log in. Upon successful login, a JWT token is stored in localStorage, and the user is redirected to the project list page.

- **Component:** `Login.js`
- **State Management:** Local state for username and password, managed with the `useState` hook.
- **Navigation:** Redirects the user to `/projects` after successful login.

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post("http://localhost:5000/auth/login", {
      username,
      password,
    });
    localStorage.setItem("token", response.data.token);
    navigate("/projects");
  } catch (error) {
    alert("Login failed");
  }
};
```

##### **2. Project List Page**

This page displays a list of all projects. It also allows the user to create new projects and export a project summary as a GitHub gist.

- **Component:** `ProjectList.js`
- **State Management:** Uses `useState` and `useEffect` hooks to manage project data.
- **API Calls:** Axios is used to fetch projects from the backend and to export the gist.

```javascript
useEffect(() => {
  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/projects", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects", error);
    }
  };

  fetchProjects();
}, []);
```

##### **3. Todo Management**

Within each project, users can add, update, or delete todos. The page displays todos as either pending or completed, and the user can change the status of each todo.

- **Component:** `ProjectDetail.js`
- **State Management:** Uses `useState` and `useEffect` hooks to manage todo data.
- **API Calls:** Axios is used to fetch todos and manage CRUD operations.

---

### **Authentication with JWT**

The application uses **JWT** for user authentication. After a user logs in, the JWT token is stored in localStorage. This token is sent with every API request that requires authentication using the `Authorization: Bearer <token>` header.

### **GitHub Gist Export**

The app integrates the **GitHub API** to export project summaries as a secret gist. The exported gist contains the project title, the number of completed todos, and a markdown list of pending and completed tasks.

### **File Structure**
```
/backend
  /controllers
    authController.js
    projectController.js
    todoController.js
  /models
    Project.js
    Todo.js
    User.js
  /routes
    authRoutes.js
    projectRoutes.js
    todoRoutes.js
  server.js

/frontend
  /src
    /components
      Login.js
      ProjectList.js
      ProjectDetail.js
  /context
    AuthContext.js
```

### Getting Started

#### Clone the repository

```
git clone https://github.com/Brothin/Task-Manager.git
```

```
cd Task-Manager
```

#### You need

• Node

• MongoDB or Mongo Atlas

• NPM

#### Create your MongoDB account and database/cluster

• Create your own MongoDB account by visiting the MongoDB website and signing up for a new account.

• Create a new database or cluster by following the instructions provided in the MongoDB documentation. Remember to note down the "Connect to your application URI" for the database, as you will need it later. Also, make sure to change with your own password.

• Add your current IP address to the MongoDB database's IP whitelist to allow connections (this is needed whenever your ip changes).

#### Create .env file

Create a .env file in the frontend folder to store your credentials. This file will store environment variables for the frontend to run.

```
REACT_APP_API_URL=""
```

Create a .env file in the backend folder to store your credentials. This file will store environment variables for the backend to run.

```
PORT=5000
MONGO_URI=""
JWT_SECRET="supersecretjwt"
GITHUB_TOKEN=""
```

#### Installation

To install and run this project -
Install dependencies using npm in frontend folder and run client side of application.

```
cd frontend
npm install
npm start
```

Install dependencies using npm in backend folder and run server side of application.

```
cd backend
npm install
npm start
```
