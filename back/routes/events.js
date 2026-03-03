const express = require('express');
const db = require('../db');
const { authenticate, optionalAuth } = require('../middleware/auth');
const { isOrganizer } = require('../middleware/rbac');
const { eventValidation, registrationValidation } = require('../middleware/validation');
const { logger } = require('../utils/logger');

const router = express.Router();

/**
 * GET /events
 * Public endpoint to browse and search events (FREQ-4)
 * Query params: category, date, search, page, limit
 */
router.get('/', optionalAuth, eventValidation.list, async (req, res) => {
    try {
        const { category, date, search, page = 1, limit = 20 } = req.query;

        const conditions = ["status = 'Approved'"];
        const values = [];
        let paramCount = 1;

        // Filter by category
        if (category) {
            conditions.push(`category = $${paramCount}`);
            values.push(category);
            paramCount++;
        }

        // Filter by date
        if (date) {
            conditions.push(`date = $${paramCount}`);
            values.push(date);
            paramCount++;
        }

        // Search in title and description
        if (search) {
            conditions.push(`(title ILIKE $${paramCount} OR description ILIKE $${paramCount})`);
            values.push(`%${search}%`);
            paramCount++;
        }

        const whereClause = conditions.join(' AND ');

        // Get total count
        const countResult = await db.query(
            `SELECT COUNT(*) FROM events WHERE ${whereClause}`,
            values
        );

        const total = parseInt(countResult.rows[0].count);

        // Get paginated events
        const offset = (page - 1) * limit;
        values.push(limit, offset);

        const result = await db.query(
            `SELECT e.*, u.name as organizer_name 
             FROM events e
             JOIN users u ON e.organizer_id = u.id
             WHERE ${whereClause}
             ORDER BY e.date ASC, e.time ASC
             LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
            values
        );

        res.json({
            success: true,
            data: {
                events: result.rows,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    totalPages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        console.error('Get events error:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting events'
        });
    }
});

/**
 * GET /events/:id
 * View detailed event information
 */
router.get('/:id', optionalAuth, eventValidation.idParam, async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query(
            `SELECT e.*, u.name as organizer_name, u.email as organizer_email
             FROM events e
             JOIN users u ON e.organizer_id = u.id
             WHERE e.id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Check if user can view event (must be approved or user is organizer/admin)
        const event = result.rows[0];
        if (event.status !== 'Approved' && req.user) {
            if (event.organizer_id !== req.user.id && req.user.role !== 'Administrator') {
                return res.status(404).json({
                    success: false,
                    message: 'Event not found'
                });
            }
        } else if (event.status !== 'Approved' && !req.user) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Get registration count
        const regCountResult = await db.query(
            'SELECT COUNT(*) FROM registrations WHERE event_id = $1',
            [id]
        );

        event.registration_count = parseInt(regCountResult.rows[0].count);

        res.json({
            success: true,
            data: {
                event
            }
        });
    } catch (error) {
        console.error('Get event error:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting event details'
        });
    }
});

/**
 * POST /events
 * Create a new event (Organizers Only) - BR-03
 */
router.post('/', authenticate, isOrganizer, eventValidation.create, async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            date,
            time,
            location_venue,
            location_latitude,
            location_longitude,
            capacity,
            is_paid
        } = req.body;

        // Insert event with Pending status (BR-03)
        const result = await db.query(
            `INSERT INTO events (
                title, description, category, date, time,
                location_venue, location_latitude, location_longitude,
                organizer_id, status, capacity, is_paid
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'Pending', $10, $11)
            RETURNING *`,
            [
                title,
                description,
                category,
                date,
                time,
                location_venue,
                location_latitude,
                location_longitude,
                req.user.id,
                capacity || 0,
                is_paid || false
            ]
        );

        const event = result.rows[0];

        // Log event creation
        await logger.log({
            userId: req.user.id,
            action: 'Create event',
            entityType: 'event',
            entityId: event.id,
            details: { title: event.title, status: 'Pending' },
            ipAddress: req.ip || req.connection.remoteAddress
        });

        res.status(201).json({
            success: true,
            message: 'Event created successfully. Pending approval.',
            data: {
                event
            }
        });
    } catch (error) {
        console.error('Create event error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating event'
        });
    }
});

/**
 * PUT /events/:id
 * Edit existing event details (Organizers Only) - BR-04
 */
router.put('/:id', authenticate, isOrganizer, eventValidation.update, async (req, res) => {
    try {
        const { id } = req.params;

        // Check if event exists and user owns it
        const eventCheck = await db.query(
            'SELECT * FROM events WHERE id = $1',
            [id]
        );

        if (eventCheck.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        const event = eventCheck.rows[0];

        // Only organizer or admin can edit
        if (event.organizer_id !== req.user.id && req.user.role !== 'Administrator') {
            return res.status(403).json({
                success: false,
                message: 'You can only edit your own events'
            });
        }

        // Build update query
        const allowedFields = [
            'title', 'description', 'category', 'date', 'time',
            'location_venue', 'location_latitude', 'location_longitude',
            'capacity', 'is_paid'
        ];

        const updates = [];
        const values = [];
        let paramCount = 1;

        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                updates.push(`${field} = $${paramCount}`);
                values.push(req.body[field]);
                paramCount++;
            }
        });

        if (updates.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No fields to update'
            });
        }

        // If event was previously approved, set back to pending after edit (BR-04)
        if (event.status === 'Approved') {
            updates.push(`status = $${paramCount}`);
            values.push('Pending');
            paramCount++;
        }

        updates.push(`updated_at = CURRENT_TIMESTAMP`);

        values.push(id);

        const result = await db.query(
            `UPDATE events SET ${updates.join(', ')} 
             WHERE id = $${paramCount} 
             RETURNING *`,
            values
        );

        // Log event update
        await logger.log({
            userId: req.user.id,
            action: 'Update event',
            entityType: 'event',
            entityId: id,
            details: { updatedFields: Object.keys(req.body) },
            ipAddress: req.ip || req.connection.remoteAddress
        });

        res.json({
            success: true,
            message: 'Event updated successfully',
            data: {
                event: result.rows[0]
            }
        });
    } catch (error) {
        console.error('Update event error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating event'
        });
    }
});

/**
 * DELETE /events/:id
 * Remove an event (Organizers Only)
 */
router.delete('/:id', authenticate, isOrganizer, eventValidation.idParam, async (req, res) => {
    try {
        const { id } = req.params;

        // Check if event exists
        const eventCheck = await db.query(
            'SELECT * FROM events WHERE id = $1',
            [id]
        );

        if (eventCheck.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        const event = eventCheck.rows[0];

        // Only organizer or admin can delete
        if (event.organizer_id !== req.user.id && req.user.role !== 'Administrator') {
            return res.status(403).json({
                success: false,
                message: 'You can only delete your own events'
            });
        }

        // Delete event (cascades to registrations and tickets)
        await db.query('DELETE FROM events WHERE id = $1', [id]);

        // Log event deletion
        await logger.log({
            userId: req.user.id,
            action: 'Delete event',
            entityType: 'event',
            entityId: id,
            details: { title: event.title },
            ipAddress: req.ip || req.connection.remoteAddress
        });

        res.json({
            success: true,
            message: 'Event deleted successfully'
        });
    } catch (error) {
        console.error('Delete event error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting event'
        });
    }
});

/**
 * POST /events/:id/rsvp
 * Register for free events (BR-05, BR-07)
 */
router.post('/:id/rsvp', authenticate, registrationValidation.rsvp, async (req, res) => {
    try {
        const { id } = req.params;

        // Check if event exists and is approved
        const eventResult = await db.query(
            'SELECT * FROM events WHERE id = $1',
            [id]
        );

        if (eventResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        const event = eventResult.rows[0];

        if (event.status !== 'Approved') {
            return res.status(400).json({
                success: false,
                message: 'Event is not available for registration'
            });
        }

        if (event.is_paid) {
            return res.status(400).json({
                success: false,
                message: 'This is a paid event. Please use the purchase endpoint.'
            });
        }

        // Check for duplicate registration (BR-05)
        const existingReg = await db.query(
            'SELECT id FROM registrations WHERE user_id = $1 AND event_id = $2',
            [req.user.id, id]
        );

        if (existingReg.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'You have already registered for this event'
            });
        }

        // Check capacity (BR-07)
        const regCount = await db.query(
            'SELECT COUNT(*) FROM registrations WHERE event_id = $1',
            [id]
        );

        if (event.capacity > 0 && parseInt(regCount.rows[0].count) >= event.capacity) {
            return res.status(400).json({
                success: false,
                message: 'Event is at full capacity'
            });
        }

        // Create registration
        const regResult = await db.query(
            `INSERT INTO registrations (user_id, event_id, status) 
             VALUES ($1, $2, 'RSVPed') 
             RETURNING *`,
            [req.user.id, id]
        );

        // Log RSVP
        await logger.log({
            userId: req.user.id,
            action: 'RSVP to event',
            entityType: 'registration',
            entityId: regResult.rows[0].id,
            details: { event_id: id, event_title: event.title },
            ipAddress: req.ip || req.connection.remoteAddress
        });

        res.status(201).json({
            success: true,
            message: 'Successfully registered for event',
            data: {
                registration: regResult.rows[0]
            }
        });
    } catch (error) {
        console.error('RSVP error:', error);
        res.status(500).json({
            success: false,
            message: 'Error registering for event'
        });
    }
});

/**
 * GET /events/:id/purchase
 * Purchase tickets for paid events (BR-06)
 */
router.post('/:id/purchase', authenticate, registrationValidation.purchase, async (req, res) => {
    try {
        const { id } = req.params;
        const { ticket_type, payment_method } = req.body;

        // Check if event exists and is approved
        const eventResult = await db.query(
            'SELECT * FROM events WHERE id = $1',
            [id]
        );

        if (eventResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        const event = eventResult.rows[0];

        if (event.status !== 'Approved') {
            return res.status(400).json({
                success: false,
                message: 'Event is not available for registration'
            });
        }

        if (!event.is_paid) {
            return res.status(400).json({
                success: false,
                message: 'This is a free event. Please use the RSVP endpoint.'
            });
        }

        // Check for duplicate registration
        const existingReg = await db.query(
            'SELECT id FROM registrations WHERE user_id = $1 AND event_id = $2',
            [req.user.id, id]
        );

        if (existingReg.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'You have already registered for this event'
            });
        }

        // Check capacity
        const regCount = await db.query(
            'SELECT COUNT(*) FROM registrations WHERE event_id = $1',
            [id]
        );

        if (event.capacity > 0 && parseInt(regCount.rows[0].count) >= event.capacity) {
            return res.status(400).json({
                success: false,
                message: 'Event is at full capacity'
            });
        }

        // Simulate payment processing (BR-06)
        const paymentSuccessful = true; // Simulated - always succeeds

        if (!paymentSuccessful) {
            return res.status(400).json({
                success: false,
                message: 'Payment failed'
            });
        }

        // Create registration
        const regResult = await db.query(
            `INSERT INTO registrations (user_id, event_id, status) 
             VALUES ($1, $2, 'Purchased') 
             RETURNING *`,
            [req.user.id, id]
        );

        const registrationId = regResult.rows[0].id;

        // Create ticket with confirmation (BR-06)
        const ticketResult = await db.query(
            `INSERT INTO tickets (registration_id, ticket_type, price, is_confirmed) 
             VALUES ($1, $2, $3, TRUE) 
             RETURNING *`,
            [registrationId, ticket_type || 'General', 0] // Price would come from event
        );

        // Log purchase
        await logger.log({
            userId: req.user.id,
            action: 'Purchase ticket',
            entityType: 'registration',
            entityId: registrationId,
            details: {
                event_id: id,
                event_title: event.title,
                ticket_type,
                payment_method
            },
            ipAddress: req.ip || req.connection.remoteAddress
        });

        res.status(201).json({
            success: true,
            message: 'Ticket purchased successfully',
            data: {
                registration: regResult.rows[0],
                ticket: ticketResult.rows[0]
            }
        });
    } catch (error) {
        console.error('Purchase error:', error);
        res.status(500).json({
            success: false,
            message: 'Error purchasing ticket'
        });
    }
});

module.exports = router;
