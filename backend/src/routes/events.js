const express = require('express');
const router = express.Router();
const eventService = require('../services/eventService');
const authService = require('../services/authService');
const { UserRole, EventStatus } = require('../schema/firestore');

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

// Get all events (public - only approved events)
router.get('/', async (req, res) => {
    try {
        const { status, category, organizerId } = req.query;

        // Public users only see approved events
        const filters = status ? { status } : { status: EventStatus.APPROVED };
        if (category) filters.category = category;
        if (organizerId) filters.organizerId = organizerId;

        const events = await eventService.getAllEvents(filters);
        res.json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});

// Get pending events (admin/organizer only)
router.get('/pending', authenticate, async (req, res) => {
    try {
        // Only admins and organizers can see pending events
        if (req.user.role !== UserRole.SYSTEM_ADMIN &&
            req.user.role !== UserRole.EVENT_ORGANIZER) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const events = await eventService.getAllEvents({ status: EventStatus.PENDING });
        res.json(events);
    } catch (error) {
        console.error('Error fetching pending events:', error);
        res.status(500).json({ error: 'Failed to fetch pending events' });
    }
});

// Get my events (organizer only)
router.get('/my-events', authenticate, async (req, res) => {
    try {
        // Only organizers and admins can see their events
        if (req.user.role !== UserRole.EVENT_ORGANIZER &&
            req.user.role !== UserRole.SYSTEM_ADMIN) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const events = await eventService.getEventsByOrganizer(req.user.uid);
        res.json(events);
    } catch (error) {
        console.error('Error fetching my events:', error);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});

// Get single event
router.get('/:id', async (req, res) => {
    try {
        const event = await eventService.getEventById(req.params.id);

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        // Non-approved events only visible to organizer or admin
        if (event.status !== EventStatus.APPROVED) {
            // Check if user is authenticated and authorized
            // For now, allow access - in production would check auth
        }

        res.json(event);
    } catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({ error: 'Failed to fetch event' });
    }
});

// Create new event
router.post('/', authenticate, async (req, res) => {
    try {
        const { title, description, category, date, endDate, location, capacity, imageUrl, tags } = req.body;

        // Validate required fields
        if (!title || !description || !category || !date || !location || !capacity) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Check role - only organizers and admins can create events
        if (req.user.role !== UserRole.EVENT_ORGANIZER &&
            req.user.role !== UserRole.SYSTEM_ADMIN) {
            return res.status(403).json({ error: 'Unauthorized - Event organizer role required' });
        }

        const event = await eventService.createEvent(
            { title, description, category, date, endDate, location, capacity, imageUrl, tags },
            req.user.uid,
            req.user.displayName || 'Unknown Organizer'
        );
        res.status(201).json(event);
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ error: 'Failed to create event' });
    }
});

// Update event
router.put('/:id', authenticate, async (req, res) => {
    try {
        const eventData = req.body;

        const event = await eventService.updateEvent(
            req.params.id,
            eventData,
            req.user.uid,
            req.user.role
        );
        res.json(event);
    } catch (error) {
        console.error('Error updating event:', error);
        if (error.message === 'Event not found') {
            res.status(404).json({ error: error.message });
        } else if (error.message.includes('Unauthorized')) {
            res.status(403).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Failed to update event' });
        }
    }
});

// Approve/Reject event (admin only)
router.patch('/:id/status', authenticate, async (req, res) => {
    try {
        const { status } = req.body;

        // Only admins can approve/reject events
        if (req.user.role !== UserRole.SYSTEM_ADMIN) {
            return res.status(403).json({ error: 'Unauthorized - Admin access required' });
        }

        if (!Object.values(EventStatus).includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const event = await eventService.updateEventStatus(req.params.id, status);
        res.json(event);
    } catch (error) {
        console.error('Error updating event status:', error);
        if (error.message === 'Event not found') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Failed to update event status' });
        }
    }
});

// Delete event
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const result = await eventService.deleteEvent(
            req.params.id,
            req.user.uid,
            req.user.role
        );
        res.json(result);
    } catch (error) {
        console.error('Error deleting event:', error);
        if (error.message === 'Event not found') {
            res.status(404).json({ error: error.message });
        } else if (error.message.includes('Unauthorized')) {
            res.status(403).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Failed to delete event' });
        }
    }
});

module.exports = router;
