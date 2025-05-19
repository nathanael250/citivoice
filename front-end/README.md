CitiVoice - Citizen Complaint Management System
Overview
CitiVoice is a comprehensive web application designed to streamline the process of submitting, tracking, and resolving citizen complaints. It facilitates communication between citizens, government officials, and administrative staff to ensure efficient complaint management.

Features
For Citizens
Create an account and manage profile
Submit complaints with details, location, and attachments
Track complaint status in real-time
Receive notifications on complaint updates
View agency information and responses
For Officials
Manage complaints assigned to their agency
Respond to citizen complaints
Update complaint status and resolution details
Internal communication with other officials
For Administrators
User management (create, update, suspend accounts)
Agency management (register new agencies, assign officials)
System-wide analytics and reporting
Configuration of complaint categories and settings
Technology Stack
Frontend
React.js with React Router for client-side routing
Tailwind CSS for styling
Axios for API communication
React Context API for state management
Backend
Node.js with Express.js framework
Sequelize ORM for database operations
JWT for authentication
bcrypt for password hashing
Database
MySQL for data storage
Installation
Prerequisites
Node.js (v14 or higher)
npm or yarn
MySQL database
Backend Setup
Clone the repository

git clone https://github.com/yourusername/citivoice.git
cd citivoice

Copy

Execute

Install backend dependencies

cd backend
npm install

Copy

Execute

Configure the database

Create a MySQL database
Update the database configuration in backend/config/config.json
Run migrations and seeders

npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all

Copy

Execute

Start the backend server

npm run dev

Copy

Execute

Frontend Setup
Install frontend dependencies

cd ../front-end
npm install

Copy

Execute

Start the frontend development server

npm run dev

Copy

Execute

Access the application at http://localhost:5173

Project Structure
citivoice/
├── backend/                 # Backend code
│   ├── config/              # Configuration files
│   ├── controllers/         # Request handlers
│   ├── middleware/          # Express middleware
│   ├── migrations/          # Database migrations
│   ├── models/              # Sequelize models
│   ├── routes/              # API routes
│   ├── seeders/             # Database seeders
│   └── server.js            # Entry point
│
├── front-end/               # Frontend code
│   ├── public/              # Static files
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   │   ├── admin/       # Admin-specific components
│   │   │   └── layout/      # Layout components
│   │   ├── context/         # React context providers
│   │   ├── pages/           # Page components
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # Entry point
│   └── index.html           # HTML template
│
└── README.md                # Project documentation

Copy

Apply

API Endpoints
Authentication
POST /api/users/register - Register a new user
POST /api/users/login - User login
Users
GET /api/users - Get all users (admin only)
GET /api/users/:id - Get user by ID
PUT /api/users/:id - Update user
DELETE /api/users/:id - Delete user
Complaints
GET /api/complaints - Get all complaints
GET /api/complaints/:id - Get complaint by ID
POST /api/complaints - Create a new complaint
PUT /api/complaints/:id - Update complaint
DELETE /api/complaints/:id - Delete complaint
Agencies
GET /api/agencies - Get all agencies
GET /api/agencies/:id - Get agency by ID
POST /api/agencies - Create a new agency
PUT /api/agencies/:id - Update agency
DELETE /api/agencies/:id - Delete agency
GET /api/agencies/:id/complaints - Get complaints assigned to agency
User Roles
Citizen
Default role for registered users
Can submit and track complaints
Official
Assigned to specific government agencies
Can manage and respond to complaints assigned to their agency
Admin
System administrators
Full access to all features and data
Development
Running Tests
# Backend tests
cd backend
npm test

# Frontend tests
cd front-end
npm test

Copy

Execute

Code Linting
# Backend
cd backend
npm run lint

# Frontend
cd front-end
npm run lint

Copy

Execute

Deployment
Backend Deployment
Set up environment variables for production
Build the application
cd backend
npm run build

Copy

Execute

Start the server
npm start

Copy

Execute

Frontend Deployment
Build the frontend
cd front-end
npm run build

Copy

Execute

Deploy the contents of the dist directory to your web server
Contributing
Fork the repository
Create your feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add some amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request
License
This project is licensed under the ISC License - see the LICENSE file for details.

Acknowledgments
Express.js
React
Sequelize
Tailwind CSS
Contact
Project Link: https://github.com/nathanael250/citivoice.git

© 2023 CitiVoice. All rights reserved.