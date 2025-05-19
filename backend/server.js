const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

// Import routes
const userRoutes = require('./routes/user');
const complaintRoutes = require('./routes/complaint');
const agencyRoutes = require('./routes/agency');
// Import other routes as needed

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/agencies', agencyRoutes);
// Use other routes as needed

// Simple route for testing
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to CitiVoice API' });
});

// Start server
const PORT = process.env.PORT || 7000;
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
});
