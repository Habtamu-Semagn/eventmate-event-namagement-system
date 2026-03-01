const express = require('express');
const router = express.Router();
const registrationService = require('../services/registrationService');
const authService = require('../services/authService');
const { UserRole, RegistrationStatus } = require('../schema/firestore');

// Middleware to verify Firebase token
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const idToken = authHeader.split('Bearer ')[1];
        const user = await authService.verifyToken(idToken);
        req.user = user;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
};

// Register for an event
router.post('/', authenticate, async (req, res) => {
    try {
        const { eventId } = req.body;
        const userId = req.user.uid;

        const registration = await registrationService.registerForEvent(userId, eventId);
        res.status(201).json(registration);
    } catch (error) {
        console.error('Error registering for event:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get user's registrations
router.get('/my', authenticate, async (req, res) => {
    try {
        const userId = req.user.uid;
        const registrations = await registrationService.getUserRegistrations(userId);
        res.json(registrations);
    } catch (error) {
        console.error('Error fetching registrations:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get registrations for an event (organizer only)
router.get('/event/:eventId', authenticate, async (req, res) => {
    try {
        const { eventId } = req.params;

        // Only organizers and admins can view attendees
        if (req.user.role !== UserRole.EVENT_ORGANIZER &&
            req.user.role !== UserRole.SYSTEM_ADMIN) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const registrations = await registrationService.getEventRegistrations(eventId);
        res.json({ registrations });
    } catch (error) {
        console.error('Error fetching event registrations:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get registration by ID
router.get('/:id', authenticate, async (req, res) => {
    try {
        const registration = await registrationService.getRegistrationById(req.params.id);

        if (!registration) {
            return res.status(404).json({ error: 'Registration not found' });
        }

        // Only allow user to view their own registration or admin
        if (registration.userId !== req.user.uid &&
            req.user.role !== UserRole.SYSTEM_ADMIN) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        res.json(registration);
    } catch (error) {
        console.error('Error fetching registration:', error);
        res.status(500).json({ error: error.message });
    }
});

// Update registration status
router.patch('/:id', authenticate, async (req, res) => {
    try {
        const { status } = req.body;
        const userId = req.user.uid;
        const userRole = req.user.role;

        const registration = await registrationService.updateRegistrationStatus(
            req.params.id,
            status,
            userId,
            userRole
        );
        res.json(registration);
    } catch (error) {
        console.error('Error updating registration:', error);
        res.status(500).json({ error: error.message });
    }
});

// Cancel registration
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const userId = req.user.uid;

        const result = await registrationService.cancelRegistration(
            req.params.id,
            userId
        );
        res.json(result);
    } catch (error) {
        console.error('Error cancelling registration:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
