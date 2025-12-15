# JayBee Book Tracker

A modern full-stack Book Library Management System with user authentication, external book search, and reading statistics.

##  Features

### Authentication & User Management
- Secure user registration and login
- JWT token-based authentication
- Protected routes for authenticated users
- Password encryption with bcrypt

### Book Management
- **CRUD Operations**: Create, Read, Update, Delete books
- **Book Details**: Title, author, genre, year, ISBN, description
- **Reading Status**: Track books as "Want to Read", "Currently Reading", or "Completed"
- **Rating System**: 5-star heart rating system

### External Book Integration
- Search books worldwide using Google Books API
- Add books directly from external sources
- Automatic book details and cover images

###  Dashboard & Statistics
- Visual statistics of reading progress
- Book count by genre and reading status
- Filter books by genre, status, and search
- Grid/List view toggle

###  UI/UX
- Responsive girly themed design
- Bootstrap 5 with custom CSS
- Loading states and error handling
- Intuitive navigation

## Tech Stack

### **Frontend**
- React.js 18
- React Router DOM
- Axios for API calls
- Bootstrap 5 + Custom CSS
- Vite (Build tool)
- Bootstrap Icons

### **Backend**
- Node.js
- Express.js
- MongoDB + Mongoose ODM
- JWT Authentication
- Bcrypt.js
- CORS

### **APIs**
- Google Books API (External book search)

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (Local or Atlas)
- Git
