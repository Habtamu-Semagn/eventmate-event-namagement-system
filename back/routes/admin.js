const express = require('express');
const db = require('../db');
const { authenticate } = require('../middleware/auth');
const { isAdmin } = require('../middleware/rbac');
const { adminValidation } = require('../middleware/validation');
const { logger } = require('../utils/logger');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate, isAdmin);

/**
 * GET /admin/pending-events
 * List events awaiting moderation (FREQ-13)
 */
router.get('/pending-events', async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;

        const offset = (page - 1) * limit;

        // Get total count of pending events
        const countResult = await db.query(
            "SELECT COUNT(*) FROM events WHERE status = 'Pending'"
        );
        const total = parseInt(countResult.rows[0].count);

        // Get pending events
        const result = await db.query(
            `SELECT e.*, u.name as organizer_name, u.email as organizer_email
             FROM events e
             JOIN users u ON e.organizer_id = u.id
             WHERE e.status = 'Pending'
             ORDER BY e.created_at ASC
             LIMIT $1 OFFSET $2`,
            [limit, offset]
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
        console.error('Get pending events error:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting pending events'
        });
    }
});

/**
 * PATCH /admin/events/:id/status
 * Approve or reject events (FREQ-13)
 */
router.patch('/events/:id/status', adminValidation.updateEventStatus, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

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

        // Update event status
        const result = await db.query(
            `UPDATE events SET status = $1, updated_at = CURRENT_TIMESTAMP 
             WHERE id = $2 
             RETURNING *`,
            [status, id]
        );

        // Notify organizer about status change
        await db.query(
            `INSERT INTO notifications (user_id, message) 
             VALUES ($1, $2)`,
            [
                event.organizer_id,
                `Your event "${event.title}" has been ${status.toLowerCase()}.`
            ]
        );

        // Log status change
        await logger.log({
            userId: req.user.id,
            action: `Event ${status}`,
            entityType: 'event',
            entityId: id,
            details: {
                event_title: event.title,
                previous_status: event.status,
                new_status: status
            },
            ipAddress: req.ip || req.connection.remoteAddress
        });

        res.json({
            success: true,
            message: `Event ${status.toLowerCase()} successfully`,
            data: {
                event: result.rows[0]
            }
        });
    } catch (error) {
        console.error('Update event status error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating event status'
        });
    }
});

/**
 * GET /admin/users
 * Monitor system users and manage access (FREQ-14)
 */
router.get('/users', adminValidation.userList, async (req, res) => {
    try {
        const { page = 1, limit = 20, role } = req.query;

        const conditions = [];
        const values = [];
        let paramCount = 1;

        if (role) {
            conditions.push(`role = $${paramCount}`);
            values.push(role);
            paramCount++;
        }

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

        // Get total count
        const countResult = await db.query(
            `SELECT COUNT(*) FROM users ${whereClause}`,
            values
        );
        const total = parseInt(countResult.rows[0].count);

        // Get paginated users
        const offset = (page - 1) * limit;
        values.push(limit, offset);

        const result = await db.query(
            `SELECT id, name, email, role, created_at 
             FROM users 
             ${whereClause}
             ORDER BY created_at DESC
             LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
            values
        );

        res.json({
            success: true,
            data: {
                users: result.rows,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    totalPages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting users'
        });
    }
});

/**
 * PATCH /admin/users/:id/role
 * Update user role
 */
router.patch('/users/:id/role', async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        const validRoles = ['Visitor', 'Registered User', 'Organizer', 'Administrator'];

        if (!role || !validRoles.includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role'
            });
        }

        // Check if user exists
        const userCheck = await db.query(
            'SELECT id, name, email, role FROM users WHERE id = $1',
            [id]
        );

        if (userCheck.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Prevent removing own admin role
        if (req.user.id === parseInt(id) && role !== 'Administrator') {
            return res.status(400).json({
                success: false,
                message: 'Cannot change your own role'
            });
        }

        // Update user role
        const result = await db.query(
            `UPDATE users SET role = $1 WHERE id = $2 RETURNING id, name, email, role, created_at`,
            [role, id]
        );

        // Log role change
        await logger.log({
            userId: req.user.id,
            action: 'User role update',
            entityType: 'user',
            entityId: id,
            details: {
                target_user: userCheck.rows[0].email,
                previous_role: userCheck.rows[0].role,
                new_role: role
            },
            ipAddress: req.ip || req.connection.remoteAddress
        });

        res.json({
            success: true,
            message: 'User role updated successfully',
            data: {
                user: result.rows[0]
            }
        });
    } catch (error) {
        console.error('Update user role error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating user role'
        });
    }
});

/**
 * DELETE /admin/users/:id
 * Delete a user (admin only)
 */
router.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Prevent deleting self
        if (req.user.id === parseInt(id)) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete your own account'
            });
        }

        // Check if user exists
        const userCheck = await db.query(
            'SELECT id, name, email FROM users WHERE id = $1',
            [id]
        );

        if (userCheck.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Delete user
        await db.query('DELETE FROM users WHERE id = $1', [id]);

        // Log user deletion
        await logger.log({
            userId: req.user.id,
            action: 'Delete user',
            entityType: 'user',
            entityId: id,
            details: { deleted_user: userCheck.rows[0].email },
            ipAddress: req.ip || req.connection.remoteAddress
        });

        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting user'
        });
    }
});

/**
 * GET /admin/logs
 * Monitor overall system activity (FREQ-15)
 */
router.get('/logs', adminValidation.logList, async (req, res) => {
    try {
        const { page = 1, limit = 50, user_id } = req.query;

        const conditions = [];
        const values = [];
        let paramCount = 1;

        if (user_id) {
            conditions.push(`user_id = $${paramCount}`);
            values.push(user_id);
            paramCount++;
        }

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

        // Get total count
        const countResult = await db.query(
            `SELECT COUNT(*) FROM activity_logs ${whereClause}`,
            values
        );
        const total = parseInt(countResult.rows[0].count);

        // Get paginated logs
        const offset = (page - 1) * limit;
        values.push(limit, offset);

        const result = await db.query(
            `SELECT al.*, u.name as user_name, u.email as user_email
             FROM activity_logs al
             LEFT JOIN users u ON al.user_id = u.id
             ${whereClause}
             ORDER BY al.created_at DESC
             LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
            values
        );

        res.json({
            success: true,
            data: {
                logs: result.rows,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    totalPages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        console.error('Get logs error:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting activity logs'
        });
    }
});

/**
 * GET /admin/stats
 * Get system statistics
 */
router.get('/stats', async (req, res) => {
    try {
        const stats = {};

        // Total users
        const usersResult = await db.query('SELECT COUNT(*) FROM users');
        stats.total_users = parseInt(usersResult.rows[0].count);

        // Total events
        const eventsResult = await db.query('SELECT COUNT(*) FROM events');
        stats.total_events = parseInt(eventsResult.rows[0].count);

        // Approved events
        const approvedResult = await db.query("SELECT COUNT(*) FROM events WHERE status = 'Approved'");
        stats.approved_events = parseInt(approvedResult.rows[0].count);

        // Pending events
        const pendingResult = await db.query("SELECT COUNT(*) FROM events WHERE status = 'Pending'");
        stats.pending_events = parseInt(pendingResult.rows[0].count);

        // Total registrations
        const regsResult = await db.query('SELECT COUNT(*) FROM registrations');
        stats.total_registrations = parseInt(regsResult.rows[0].count);

        // Users by role
        const roleResult = await db.query(
            `SELECT role, COUNT(*) as count FROM users GROUP BY role`
        );
        stats.users_by_role = roleResult.rows;

        // Events by status
        const statusResult = await db.query(
            `SELECT status, COUNT(*) as count FROM events GROUP BY status`
        );
        stats.events_by_status = statusResult.rows;

        res.json({
            success: true,
            data: {
                stats
            }
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting system statistics'
        });
    }
});

module.exports = router;
