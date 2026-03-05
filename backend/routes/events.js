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

        const conditions = ["e.status = 'Approved'"];
        const values = [];
        let paramCount = 1;

        // Filter by category
        if (category) {
            conditions.push(`e.category = $${paramCount}`);
            values.push(category);
            paramCount++;
        }

        // Filter by date
        if (date) {
            conditions.push(`e.date = $${paramCount}`);
            values.push(date);
            paramCount++;
        }

        // Search in title and description
        if (search) {
            conditions.push(`(e.title ILIKE $${paramCount} OR e.description ILIKE $${paramCount})`);
            values.push(`%${search}%`);
            paramCount++;
        }

        const whereClause = conditions.join(' AND ');

        // Get total count
        const countResult = await db.query(
            `SELECT COUNT(*) FROM events e WHERE ${whereClause}`,
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
 * GET /events/organizer/my-events
 * Get all events created by the authenticated organizer
 * Query params: status, page, limit
 */
router.get('/organizer/my-events', authenticate, isOrganizer, async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);

        // Build query based on whether status filter is provided
        let query, countQuery, values;

        if (status) {
            countQuery = 'SELECT COUNT(*) FROM events e WHERE e.organizer_id = $1 AND e.status = $2';
            query = `SELECT e.*, 
                (SELECT COUNT(*) FROM registrations r WHERE r.event_id = e.id) as registration_count,
                (SELECT COUNT(*) FROM tickets t 
                 JOIN registrations r ON t.registration_id = r.id 
                 WHERE r.event_id = e.id) as ticket_count
                FROM events e
                WHERE e.organizer_id = $1 AND e.status = $2
                ORDER BY e.created_at DESC
                LIMIT $3 OFFSET $4`;
            values = [req.user.id, status, limit, offset];
        } else {
            countQuery = 'SELECT COUNT(*) FROM events e WHERE e.organizer_id = $1';
            query = `SELECT e.*, 
                (SELECT COUNT(*) FROM registrations r WHERE r.event_id = e.id) as registration_count,
                (SELECT COUNT(*) FROM tickets t 
                 JOIN registrations r ON t.registration_id = r.id 
                 WHERE r.event_id = e.id) as ticket_count
                FROM events e
                WHERE e.organizer_id = $1
                ORDER BY e.created_at DESC
                LIMIT $2 OFFSET $3`;
            values = [req.user.id, limit, offset];
        }

        // Get total count
        const countValues = status ? [req.user.id, status] : [req.user.id];
        const countResult = await db.query(countQuery, countValues);
        const total = parseInt(countResult.rows[0].count);

        // Get paginated events
        const result = await db.query(query, values);

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
        console.error('Get organizer events error:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting organizer events'
        });
    }
});

/**
 * GET /events/organizer/registrations
 * Get all registrations for the authenticated organizer's events
 * Query params: event_id, status, page, limit
 */
router.get('/organizer/registrations', authenticate, isOrganizer, async (req, res) => {
    try {
        const { event_id, status, page = 1, limit = 20 } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);

        // First get all event IDs belonging to this organizer
        const eventIdsResult = await db.query(
            'SELECT id FROM events WHERE organizer_id = $1',
            [req.user.id]
        );

        if (eventIdsResult.rows.length === 0) {
            return res.json({
                success: true,
                data: {
                    registrations: [],
                    pagination: {
                        page: parseInt(page),
                        limit: parseInt(limit),
                        total: 0,
                        totalPages: 0
                    }
                }
            });
        }

        const eventIds = eventIdsResult.rows.map(row => row.id);

        // Build queries based on filters
        let countQuery, dataQuery, values, countValues;
        const baseWhere = 'r.event_id = ANY($1)';

        if (event_id && status) {
            countQuery = `SELECT COUNT(*) FROM registrations r WHERE ${baseWhere} AND r.event_id = $2 AND r.status = $3`;
            dataQuery = `SELECT r.*, e.title as event_title, e.date as event_date, e.time as event_time,
                    u.name as user_name, u.email as user_email
             FROM registrations r
             JOIN events e ON r.event_id = e.id
             JOIN users u ON r.user_id = u.id
             WHERE ${baseWhere} AND r.event_id = $2 AND r.status = $3
             ORDER BY r.timestamp DESC
             LIMIT $4 OFFSET $5`;
            values = [eventIds, parseInt(event_id), status, limit, offset];
            countValues = [eventIds, parseInt(event_id), status];
        } else if (event_id) {
            countQuery = `SELECT COUNT(*) FROM registrations r WHERE ${baseWhere} AND r.event_id = $2`;
            dataQuery = `SELECT r.*, e.title as event_title, e.date as event_date, e.time as event_time,
                    u.name as user_name, u.email as user_email
             FROM registrations r
             JOIN events e ON r.event_id = e.id
             JOIN users u ON r.user_id = u.id
             WHERE ${baseWhere} AND r.event_id = $2
             ORDER BY r.timestamp DESC
             LIMIT $3 OFFSET $4`;
            values = [eventIds, parseInt(event_id), limit, offset];
            countValues = [eventIds, parseInt(event_id)];
        } else if (status) {
            countQuery = `SELECT COUNT(*) FROM registrations r WHERE ${baseWhere} AND r.status = $2`;
            dataQuery = `SELECT r.*, e.title as event_title, e.date as event_date, e.time as event_time,
                    u.name as user_name, u.email as user_email
             FROM registrations r
             JOIN events e ON r.event_id = e.id
             JOIN users u ON r.user_id = u.id
             WHERE ${baseWhere} AND r.status = $2
             ORDER BY r.timestamp DESC
             LIMIT $3 OFFSET $4`;
            values = [eventIds, status, limit, offset];
            countValues = [eventIds, status];
        } else {
            countQuery = `SELECT COUNT(*) FROM registrations r WHERE ${baseWhere}`;
            dataQuery = `SELECT r.*, e.title as event_title, e.date as event_date, e.time as event_time,
                    u.name as user_name, u.email as user_email
             FROM registrations r
             JOIN events e ON r.event_id = e.id
             JOIN users u ON r.user_id = u.id
             WHERE ${baseWhere}
             ORDER BY r.timestamp DESC
             LIMIT $2 OFFSET $3`;
            values = [eventIds, limit, offset];
            countValues = [eventIds];
        }

        // Get total count
        const countResult = await db.query(countQuery, countValues);
        const total = parseInt(countResult.rows[0].count);

        // Get paginated registrations
        const result = await db.query(dataQuery, values);

        res.json({
            success: true,
            data: {
                registrations: result.rows,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    totalPages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        console.error('Get organizer registrations error:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting organizer registrations'
        });
    }
});

/**
 * GET /events/organizer/stats
 * Get statistics for the authenticated organizer's events
 */
router.get('/organizer/stats', authenticate, isOrganizer, async (req, res) => {
    try {
        // Get total events
        const totalEventsResult = await db.query(
            'SELECT COUNT(*) FROM events WHERE organizer_id = $1',
            [req.user.id]
        );

        // Get events by status
        const eventsByStatusResult = await db.query(
            `SELECT status, COUNT(*) as count 
             FROM events 
             WHERE organizer_id = $1 
             GROUP BY status`,
            [req.user.id]
        );

        // Get total registrations
        const totalRegistrationsResult = await db.query(
            `SELECT COUNT(*) 
             FROM registrations r
             JOIN events e ON r.event_id = e.id
             WHERE e.organizer_id = $1`,
            [req.user.id]
        );

        // Get total tickets sold
        const totalTicketsResult = await db.query(
            `SELECT COUNT(*) 
             FROM tickets t
             JOIN registrations r ON t.registration_id = r.id
             JOIN events e ON r.event_id = e.id
             WHERE e.organizer_id = $1`,
            [req.user.id]
        );

        // Get upcoming events count
        const upcomingEventsResult = await db.query(
            `SELECT COUNT(*) 
             FROM events 
             WHERE organizer_id = $1 AND date >= CURRENT_DATE`,
            [req.user.id]
        );

        // Get total revenue from tickets
        const revenueResult = await db.query(
            `SELECT COALESCE(SUM(t.price), 0) as total_revenue
             FROM tickets t
             JOIN registrations r ON t.registration_id = r.id
             JOIN events e ON r.event_id = e.id
             WHERE e.organizer_id = $1`,
            [req.user.id]
        );

        // Build status counts
        const statusCounts = {
            Pending: 0,
            Approved: 0,
            Rejected: 0
        };
        eventsByStatusResult.rows.forEach(row => {
            statusCounts[row.status] = parseInt(row.count);
        });

        res.json({
            success: true,
            data: {
                total_events: parseInt(totalEventsResult.rows[0].count),
                total_attendees: parseInt(totalRegistrationsResult.rows[0].count),
                total_revenue: parseFloat(revenueResult.rows[0].total_revenue) || 0,
                active_events: statusCounts.Approved || 0,
                upcoming_events: parseInt(upcomingEventsResult.rows[0].count),
                events_by_status: statusCounts
            }
        });
    } catch (error) {
        console.error('Get organizer stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting organizer stats'
        });
    }
});

/**
 * GET /events/organizer/tickets
 * Get all tickets for the authenticated organizer's events
 */
router.get('/organizer/tickets', authenticate, isOrganizer, async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);

        // Get all event IDs belonging to this organizer
        const eventIdsResult = await db.query(
            'SELECT id FROM events WHERE organizer_id = $1',
            [req.user.id]
        );

        if (eventIdsResult.rows.length === 0) {
            return res.json({
                success: true,
                data: {
                    tickets: [],
                    pagination: {
                        page: parseInt(page),
                        limit: parseInt(limit),
                        total: 0,
                        totalPages: 0
                    }
                }
            });
        }

        const eventIds = eventIdsResult.rows.map(row => row.id);

        // Get total count
        const countResult = await db.query(
            `SELECT COUNT(*) 
             FROM tickets t
             JOIN registrations r ON t.registration_id = r.id
             WHERE r.event_id = ANY($1)`,
            [eventIds]
        );

        const total = parseInt(countResult.rows[0].count);

        // Get paginated tickets
        const result = await db.query(
            `SELECT t.*, e.title as event_title, e.date as event_date, e.time as event_time,
                    u.name as user_name, u.email as user_email
             FROM tickets t
             JOIN registrations r ON t.registration_id = r.id
             JOIN events e ON r.event_id = e.id
             JOIN users u ON r.user_id = u.id
             WHERE r.event_id = ANY($1)
             ORDER BY t.created_at DESC
             LIMIT $2 OFFSET $3`,
            [eventIds, limit, offset]
        );

        res.json({
            success: true,
            data: {
                tickets: result.rows,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    totalPages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        console.error('Get organizer tickets error:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting organizer tickets'
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
