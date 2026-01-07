# Employee Management System

A comprehensive Employee Management System built with the MERN stack (MongoDB, Express, React, Node.js). This full-stack application streamlines HR processes by handling employee records, departments, attendance, leaves, and salaries, featuring a secure role-based access control system for Admins and Employees.

## 🚀 Features

*   **Role-Based Access Control (RBAC):**
    *   **Admin Dashboard:** Full control to manage employees, departments, salaries, leaves, and attendance.
    *   **Employee Dashboard:** Employees can view their profile, check attendance history, apply for leaves, and view salary details.
*   **Department Management:** Create, edit, and delete departments effectively.
*   **Employee Management:** Onboard new employees, update personal/professional details, and manage lifecycle.
*   **Attendance Tracking:** Monitor daily attendance and maintain records.
*   **Leave Management:**
    *   Employees can submit leave requests.
    *   Admins can view, approve, or reject requests with status updates.
*   **Salary Management:** Define salary structures and manage updates.
*   **Secure Authentication:** Robust login system using JWT (JSON Web Tokens) and Bcrypt for password hashing.
*   **Responsive UI:** Modern, mobile-responsive interface built with React and Tailwind CSS.

## 🛠️ Tech Stack

### Frontend
*   **React:** Component-based UI library.
*   **Vite:** Usage of fast build tool and development server.
*   **Tailwind CSS:** Utility-first CSS framework for custom design.
*   **React Router DOM:** For seamless client-side navigation.
*   **Axios:** Promise-based HTTP client for API integration.
*   **React Data Table Component:** Interactive tables for data display.
*   **React Icons:** Comprehensive icon library.

### Backend
*   **Node.js:** JavaScript runtime environment.
*   **Express.js:** Web framework for building RESTful APIs.
*   **MongoDB:** NoSQL database for flexible data storage.
*   **Mongoose:** ODM library for MongoDB interactions.
*   **JWT:** For secure user authentication and authorization.
*   **Bcrypt:** For secure password hashing.
*   **Multer:** Middleware for handling file uploads (images/documents).
*   **Cors:** To handle Cross-Origin Resource Sharing.

## 📂 Project Structure

```
├── backend/            # Express server, controllers, models, routes, database config
├── frontend/           # React application, components, pages, context, assets
├── package.json        # Root configuration and scripts
├── readme.md           # Project documentation
└── ...
```

## ⚙️ Installation & Setup

Follow these steps to set up the project locally.

### 1. Clone the Repository
```bash
git clone https://github.com/Amit-coding-world/Employee-Management-System.git
cd Employee-Management-System
```

### 2. Install Dependencies
Install dependencies for the root, backend, and frontend.
```bash
# Root dependencies
npm install

# Backend dependencies
cd backend
npm install
cd ..

# Frontend dependencies
cd frontend
npm install
cd ..
```

### 3. Environment Configuration
Create a `.env` file in the `backend` directory with the following variables:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_KEY=your_jwt_secret_key
CLIENT_URL=http://localhost:5173
```
*Note: Ensure your MongoDB server is running and `CLIENT_URL` matches your frontend port.*

### 4. Run the Application
You can run the backend and frontend separately.

**Start Backend:**
```bash
cd backend
npm run dev
```
*Server runs on http://localhost:5000*

**Start Frontend:**
```bash
cd frontend
npm run dev
```
*App runs on http://localhost:5173*

## 📜 Scripts

*   `npm start`: Starts the backend server (from root).
*   `npm run build`: Installs dependencies and builds the frontend (from root).
*   Inside **frontend/backend** folders, standard `npm run dev` commands apply.

## 🤝 Contributing
Contributions are welcome! Feel free to fork the repository and submit a pull request with your improvements.



mongo db on server  for create and connect is :-

<!-- 
npm run start -both togather

"scripts": {
    "build": "npm install --prefix backend && npm install --prefix frontend && npm run build --prefix frontend",
    "start": "npm run start --prefix backend"
  }

npm run dev - backend

NODE_ENV=development
CLIENT_URL=http://localhost:5173

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.get('/:path(*)', (_, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/dist/index.html'));
  });}

// for cors
  app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

  "scripts": {
    "dev": "nodemon backend/index.js",
    "start": "nodemon backend/index.js"
  }


npm run dev - frontend

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
}

"scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  } -->


### URL=https://employee-management-system-sbvn.onrender.com

