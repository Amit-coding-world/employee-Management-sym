# frotend :- npm run dev
. npm i vite
. npm i react-data-table-component styled-components axios react-icons react-router-dom tailwindcss postcss autoprefixer
. npm install -D tailwindcss postcss
. npx tailwindcss init

react-data-table-component	Adds sleek, customizable data tables with features like sorting, pagination, and selectable rows.
styled-components	Lets you write scoped CSS directly in your components using tagged template literals.
axios	A promise-based HTTP client for making API calls—perfect for RESTful services.
react-icons	Gives you access to thousands of icons from popular libraries, all as React components.
react-router-dom	Enables client-side routing and navigation between views in your React app.
tailwindcss	A utility-first CSS framework that speeds up UI development with prebuilt classes.
postcss	A CSS processor that works behind the scenes with Tailwind to transform styles.
autoprefixer	A PostCSS plugin that automatically adds vendor prefixes for better browser support.
.

# backend :-


# server:- npm start or nodemon run dev
. npm init -y
.npm i bcrypt cors express jsonwebtoken mongoose multer nodemeon path


express	Fast, minimalist web framework for building APIs and server-side logic.
cors	Middleware to enable Cross-Origin Resource Sharing, allowing your frontend to communicate with the backend.
mongoose	ODM (Object Data Modeling) library for MongoDB. Simplifies schema creation and database operations.
bcrypt	Library for hashing passwords securely before storing them in the database.
jsonwebtoken	Used to create and verify JWTs for authentication and authorization.
multer	Middleware for handling multipart/form-data, especially useful for file uploads.
nodemon	Development tool that automatically restarts your server when file changes are detected.
path	Node.js core module for handling and transforming file paths. No need to install separately, but often used in Express apps.



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



