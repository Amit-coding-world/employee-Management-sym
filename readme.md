# Employee Management System (MERN Stack)

A comprehensive, enterprise-ready Employee Management System (EMS) designed for efficiency and scalability. This platform streamlines HR operations, including employee record keeping, department organization, attendance tracking, leave management, and salary administration.

## 🌟 Latest Version Highlights

### 🏢 Multi-Tenancy Architecture
The system now supports **multi-tenancy**, allowing multiple companies to use the platform independently. 
- **Data Isolation:** Each company has its own private workspace. Admins see only their company's departments, employees, and records.
- **Company Profile:** Company names are dynamically displayed across the dashboard, providing a branded experience for every organization.
- **Manager Hierarchy:** Admins can designate managers who can manage their respective teams.

### 📅 Advanced Attendance System
- **Date Picking:** Admins can now mark and view attendance for any specific date (past or present).
- **Auto-Initialization:** The system automatically initializes attendance records for all employees when a new date is accessed.
- **History Tracking:** Employees can view their personal attendance history with a color-coded status table.
- **Detailed Reports:** Attendance reports can be filtered by date and exported as clean, professional PDFs.

### 🎨 Premium UI & Improved UX
- **Rich Aesthetics:** Implemented a modern design system using Tailwind CSS with teal and indigo color palettes.
- **Custom Loading States:** Added a premium, animated Loading component that provides visual feedback during all data-fetch operations.
- **Image handling:** Fully integrated with **Cloudinary** for secure, high-speed image hosting and real-time previews.

## 🛠️ Features

*   **Role-Based Access Control (RBAC):**
    *   **Admin:** Full system control (Add Employees/Managers, Manage Departments, Salaries, Leaves, Attendance).
    *   **Manager:** Intermediate access to oversee team performance, manage attendance, and approve leave requests.
    *   **Employee:** Personal dashboard (Profile, Attendance History, Leave Application, Salary Slips).
*   **Department Management:** Structured organization with easy CRUD operations.
*   **Leave Management:** Transparent workflow for applying, viewing, and approving leave requests.
*   **Salary Management:** Track net pay, allowances, and deductions with history logs.
*   **PDF Exports:** Generate instant reports for attendance and salary history.

## ⚙️ Tech Stack

### Frontend
- **React 18 & Vite:** High-performance UI rendering and dev workflow.
- **Tailwind CSS:** Modern, responsive styling.
- **Axios & API Utility:** Centralized, secure backend communication with JWT interceptors.
- **React Data Table:** Interactive, searchable data displays.

### Backend
- **Node.js & Express:** Scalable RESTful API architecture.
- **MongoDB & Mongoose:** NoSQL data persistence with efficient schema modeling.
- **Cloudinary:** Cloud-based image management.
- **JWT & Bcrypt:** Secure authentication and password protection.

## 📂 Project Structure

```
├── backend/            # Express server, Controllers, Models, Routes, Middlewares
├── frontend/           # React App, Components, context, utils, assets
├── dist/               # Production build folder (generated after npm run build)
├── package.json        # Root config for unified project management
└── readme.md           # Documentation
```

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Amit-coding-world/Employee-Management-System.git
cd Employee-Management-System
```

### 2. Install All Dependencies
From the root directory, run:
```bash
npm install
```

### 3. Running the Project

**Development Mode (Hot Reloading):**
```bash
npm run dev
```

**Production Mode:**
1. Build the frontend:
```bash
npm run build
```
2. Start the integrated server:
```bash
npm run start
```

## 🌐 Live Demo
[Explore the Live System](https://employee-management-system-sbvn.onrender.com)

---
Developed with ❤️ by the Amit-coding-world team.
