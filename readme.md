# Full-Stack Task Manager (MERN Stack)

## 📑 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Installation & Setup](#installation--setup)
- [Database Schema](#database-schema)
- [Security Features](#security-features)
- [Troubleshooting](#troubleshooting)
- [Support](#support)

## 🌟 Overview

The Cloud-Based Task Manager is a web application designed to streamline team task management. Built using the MERN stack (MongoDB, Express.js, React, and Node.js), this platform provides a user-friendly interface for efficient task assignment, tracking, and collaboration.

### Why/Problem?
In a dynamic work environment, effective task management is crucial for team success. Traditional methods of task tracking through spreadsheets or manual systems can be cumbersome and prone to errors. The Cloud-Based Task Manager addresses these challenges by providing:
- Centralized task management platform
- Real-time collaboration features
- Automated tracking and notifications
- Role-based access control
- Intuitive user interface

### Background
With the rise of remote work and dispersed teams, there is a growing need for tools that facilitate effective communication and task coordination. This application leverages modern web technologies to create an intuitive and responsive task management solution. The MERN stack ensures scalability, while the integration of Redux Toolkit, Headless UI, and Tailwind CSS enhances user experience and performance.

## 🎯 Features

### Admin Features
1. **User Management**
   - Create admin accounts
   - Add and manage team members
   - User activation/deactivation
   - Bulk user operations
   - User activity monitoring

2. **Task Administration**
   - Create and assign tasks to individuals or teams
   - Set task priorities (high, medium, normal, low)
   - Define deadlines and milestones
   - Track task progress
   - Manage task categories

3. **Asset Management**
   - Upload and manage task assets
   - File organization
   - Asset tracking

### User Features
1. **Task Management**
   - View assigned tasks
   - Update task status (todo, in progress, completed)
   - Add comments and attachments
   - Track personal progress
   - Filter and sort tasks

2. **Collaboration Tools**
   - Real-time comments
   - Task discussions
   - File sharing
   - @mentions and notifications

### General Features
1. **Authentication & Authorization**
   - Secure user authentication
   - Role-based access control
   - Session management
   - Profile management
   - Password security

2. **User Interface**
   - Responsive design
   - Dark/Light mode
   - Customizable dashboard
   - Drag-and-drop interface
   - Advanced search functionality

## 🛠 Technology Stack

### Frontend
- **Core**: React (Vite)
- **State Management**: Redux Toolkit
- **UI/UX**:
  - Headless UI
  - Tailwind CSS
  - Custom components
- **Additional Libraries**:
  - Axios for API calls
  - React Router
  - React Query
  - Date-fns

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **Additional Tools**:
  - Morgan for logging
  - Cors for cross-origin requests
  - Cookie-parser

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14+)
- MongoDB (v4+)
- npm or yarn
- Git

### Server Setup
1. **Environment Configuration**
   Create `.env` file in server directory:
   ```env
   MONGODB_URI=your_mongodb_url
   JWT_SECRET=your_jwt_secret
   PORT=8800
   NODE_ENV=development
   ```

2. **MongoDB Setup**:
   - Visit MongoDB Atlas: [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create an account/login
   - Create a new cluster
   - Configure cluster settings
   - Create database user
   - Set up IP whitelist
   - Get connection string
   - Configure application

3. **Installation Steps**
   ```bash
   # Clone repository
   git clone https://github.com/yourusername/taskmanager.git

   # Navigate to server directory
   cd taskmanager/server

   # Install dependencies
   npm install

   # Start server
   npm start
   ```

### Client Setup
1. **Environment Configuration**
   Create `.env` file in client directory:
   ```env
   VITE_APP_BASE_URL=http://localhost:8800
   VITE_APP_FIREBASE_API_KEY=your_firebase_key
   ```

2. **Installation Steps**
   ```bash
   # Navigate to client directory
   cd ../client

   # Install dependencies
   npm install

   # Start development server
   npm run dev
   ```

## 🗄 Database Schema

### User Schema
```javascript
{
  username: String,
  email: String,
  password: String,
  role: String,
  isActive: Boolean,
  createdAt: Date
}
```

### Task Schema
```javascript
{
  title: String,
  date: Date,
  priority: String,
  stage: String,
  activities: [{
    type: String,
    activity: String,
    date: Date,
    by: ObjectId
  }],
  subTasks: [{
    title: String,
    date: Date,
    tag: String
  }],
  assets: [String],
  team: [ObjectId],
  isTrashed: Boolean
}
```

## 🔒 Security Features

1. **Authentication**
   - JWT-based authentication
   - Password hashing
   - Token expiration
   - Refresh token mechanism

2. **Authorization**
   - Role-based access control
   - Route protection
   - Resource-level permissions

3. **Data Protection**
   - Input validation
   - XSS protection
   - CSRF protection
   - Rate limiting

## ❗ Troubleshooting

### Common Issues
1. **Connection Issues**
   - Check MongoDB connection string
   - Verify network connectivity
   - Check port availability

2. **Authentication Issues**
   - Verify JWT secret
   - Check token expiration
   - Validate user credentials

3. **Performance Issues**
   - Monitor database queries
   - Check API response times
   - Optimize frontend rendering

## 📞 Support

For support, please contact:
- Contact : Gagan / Gopi

---
