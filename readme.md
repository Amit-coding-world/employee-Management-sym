# Employee Management System

A simple and complete Employee Management System (EMS). This platform makes it easy to manage your workforce by keeping track of employee details, organizing departments, marking attendance, managing leaves, and deciding salaries.

It is built using the MERN stack (MongoDB, Express.js, React.js, Node.js) and includes easy-to-use forms that make sure you don't enter wrong data.

---

## 🌟 Key Features

### 🏢 Supports Multiple Companies
Many companies can use this platform at the same time without seeing each other's data.
- **Private Data:** Each company has its own private space. Admins only see their own company's employees and departments.
- **Custom Branding:** Your company's name shows up on the dashboard so it feels like your own app.

### 👥 Three Types of Users
- **Admin:** Has full control. Can add companies, manage all departments, employees, and managers. They have the final say on salaries and leaves.
- **Manager:** Looks after their own team. They can view their team's attendance and do the first check for employee leave requests.
- **Employee:** Gets a personal dashboard to view their profile, check attendance history, ask for leave, and download salary slips.

### 🛡️ Smart and Safe Forms
- **Instant Mistake Checking:** When you fill out a form (like adding an employee or salary), the system instantly checks for mistakes like empty boxes, negative numbers, or wrong dates.
- **Secure Data:** The backend double-checks the data to make sure no bad information gets saved. It also keeps your passwords very safe.

### 🔄 Two-Step Leave Approval
- A real-world leave system where an employee asks for leave, their **Manager** approves it first, and then the **Admin** gives the final okay.

### 📅 Easy Attendance Tracking
- **Pick Any Date:** Admins can pick any past or present date to mark attendance.
- **Clean Reports:** You can download clean, professional PDF reports of the attendance data.

### 🎨 Nice Design & Feel
- **Beautiful Look:** Uses a modern design to make it look great on any screen.
- **Easy Tables:** Search, sort, and turn pages easily when looking at lists of data.
- **Profile Pictures:** Easily upload and manage profile pictures using a cloud service called Cloudinary.

---

## ⚙️ Built With

### Frontend (What you see)
- **React.js & Vite:** Makes the website fast and interactive.
- **Tailwind CSS:** Makes the website look beautiful and modern.
- **React Hook Form & Zod:** Makes sure form data is correct.

### Backend (Behind the scenes)
- **Node.js & Express.js:** Runs the server.
- **MongoDB:** Saves all the data.
- **JWT & Bcrypt:** Keeps logins and passwords safe.
- **Cloudinary:** Saves the images.

---

## 📂 Project Folders

```text
Employee-Management-System/
├── frontend/                 # The website files (React)
│   ├── src/
│   │   ├── components/       # Website parts like Sidebar, Forms
│   │   ├── pages/            # Pages like Dashboard
│   │   └── App.jsx           # Main starting point
│   └── .env                  # Frontend settings
│
└── server/                   # The backend files (Node.js)
    ├── controllers/          # The brain/logic
    ├── models/               # Database structure
    ├── routes/               # API links
    └── .env                  # Backend settings
```

---

## 🚀 How to Install and Run

### 1. What You Need
- **Node.js** installed on your computer.
- **MongoDB** account or local app to save data.
- **Cloudinary** account to save images.

### 2. Setup Secret Keys (.env files)
Create a `.env` file in the `server` folder. Add these lines with your own details:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_KEY=your_secret_jwt_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Create a `.env` file in the `frontend` folder. Add this line:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Install Packages
Open two terminal windows. One for the website frontend, one for the server backend.

```bash
# Terminal 1 - Backend Server
cd server
npm install

# Terminal 2 - Frontend Website
cd frontend
npm install
```

### 4. Start the Project
```bash
# Terminal 1 - Backend Server
cd server
npm run dev
# The server will start on http://localhost:5000

# Terminal 2 - Frontend Website
cd frontend
npm run dev
# Vite will give you a link to click, like http://localhost:5173
```

---

## 🌐 Try the Live App
**[Click here to see the Live System](https://employee-management-system-sbvn.onrender.com)** 
*(Note: It might be a little slow to load the very first time).*

---
*Created with ❤️ by the **Amit-coding-world** team.*
