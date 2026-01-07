# Employee Management System

A comprehensive Employee Management System built with the MERN stack (MongoDB, Express, React, Node.js). This full-stack application streamlines HR processes by handling employee records, departments, attendance, leaves, and salaries, featuring a secure role-based access control system for Admins and Employees.

## 🚀 Recent Updates: Cloudinary Integration
The system now supports **Cloudinary** for scalable image hosting. Employee profile images are stored as full secure URLs in the database, allowing for seamless display across production and development environments.

*   **Scalable Storage:** Images are uploaded directly to Cloudinary.
*   **Real-time Previews:** Added image previews in Add and Edit employee forms.
*   **Dynamic Rendering:** Frontend handles both full Cloudinary URLs and legacy local paths.
*   **Navbar Profile:** The dashboard now displays the logged-in user's profile image in the navigation bar.

## 🛠️ Features

*   **Role-Based Access Control (RBAC):**
    *   **Admin Dashboard:** Full control to manage employees, departments, salaries, leaves, and attendance.
    *   **Employee Dashboard:** Employees can view their profile, check attendance history, apply for leaves, and view salary details.
*   **Department Management:** Create, edit, and delete departments effectively.
*   **Employee Management:** Onboard new employees with profile images, update details, and manage records.
*   **Attendance Tracking:** Monitor daily attendance and maintain records.
*   **Leave Management:**
    *   Employees can submit leave requests.
    *   Admins can view, approve, or reject requests with status updates.
*   **Salary Management:** Define salary structures and manage updates.
*   **Secure Authentication:** Robust login system using JWT (JSON Web Tokens) and Bcrypt for password hashing.
*   **Modern UI:** Responsive interface built with React and Tailwind CSS, featuring smooth transitions and data tables.

## ⚙️ Tech Stack

### Frontend
*   **React:** Component-based UI library.
*   **Vite:** Fast build tool and development server.
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
*   **Cloudinary:** Image hosting and management service.
*   **Multer / Multer-Storage-Cloudinary:** Middleware for handling multipart/form-data and direct Cloudinary uploads.
*   **JWT:** For secure user authentication and authorization.
*   **Bcrypt:** For secure password hashing.

## 📂 Project Structure

```
├── backend/            # Express server, controllers, models, routes, database config
├── frontend/           # React application, components, pages, context, assets
├── package.json        # Root configuration and scripts
├── readme.md           # Project documentation
└── ...
```

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Amit-coding-world/Employee-Management-System.git
cd Employee-Management-System
```

### 2. Install Dependencies
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

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Run the Application

**Start Backend:**
```bash
cd backend
npm run dev
```

**Start Frontend:**
```bash
cd frontend
npm run dev
```

## � Credentials (Demo)

*   **Admin:** `admin@gmail.com` / `admin`
*   **User:** `amit@gmail.com` / `123456`

## 🌐 Live URL
[https://employee-management-system-sbvn.onrender.com](https://employee-management-system-sbvn.onrender.com)



