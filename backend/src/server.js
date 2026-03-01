require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { admin } = require('./config/firebase');

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        firebase: admin ? 'connected' : 'disconnected',
    });
});

// Events routes
const eventsRouter = require('./routes/events');
app.use('/api/events', eventsRouter);

// Users routes
const usersRouter = require('./routes/users');
app.use('/api/users', usersRouter);

// Registrations routes
const registrationsRouter = require('./routes/registrations');
app.use('/api/registrations', registrationsRouter);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.method} ${req.path} not found`,
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: err.name || 'Internal Server Error',
        message: err.message || 'An unexpected error occurred',
    });
});

// Get port from environment or use default
const PORT = process.env.PORT || 3001;

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});

module.exports = app;
