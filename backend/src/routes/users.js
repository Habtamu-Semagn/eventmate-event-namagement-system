const express = require('express');
const router = express.Router();
const authService = require('../services/authService');
const { UserRole } = require('../schema/firestore');

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

// Register new user
router.post('/register', async (req, res) => {
    try {
        const { email, password, displayName, role } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        // Default role is REGISTERED_USER unless specified
        const userRole = role && Object.values(UserRole).includes(role)
            ? role
            : UserRole.REGISTERED_USER;

        const user = await authService.register(email, password, displayName, userRole);
        res.status(201).json(user);
    } catch (error) {
        console.error('Error registering user:', error);
        if (error.message === 'Email already registered') {
            res.status(409).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Failed to register user' });
        }
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const user = await authService.login(email);
        res.json(user);
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ error: 'Failed to log in user' });
    }
});

// Verify token
router.post('/verify', authenticate, async (req, res) => {
    try {
        res.json({ user: req.user });
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(500).json({ error: 'Failed to verify token' });
    }
});

// Get current user profile
router.get('/me', authenticate, async (req, res) => {
    try {
        const user = await authService.getUserById(req.user.uid);
        res.json(user);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

// Update current user profile
router.put('/me', authenticate, async (req, res) => {
    try {
        const profileData = req.body;
        const updatedProfile = await authService.updateProfile(req.user.uid, profileData);
        res.json(updatedProfile);
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

// Get user by ID (admin only)
router.get('/:id', authenticate, async (req, res) => {
    try {
        // Only admins can view other users
        if (req.user.role !== UserRole.SYSTEM_ADMIN) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const user = await authService.getUserById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

// Update user role (admin only)
router.patch('/:id/role', authenticate, async (req, res) => {
    try {
        // Only admins can update roles
        if (req.user.role !== UserRole.SYSTEM_ADMIN) {
            return res.status(403).json({ error: 'Unauthorized - Admin access required' });
        }

        const { role } = req.body;
        if (!role || !Object.values(UserRole).includes(role)) {
            return res.status(400).json({ error: 'Invalid role' });
        }

        const result = await authService.updateUserRole(req.params.id, role);
        res.json(result);
    } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).json({ error: 'Failed to update user role' });
    }
});

// Delete user (admin only)
router.delete('/:id', authenticate, async (req, res) => {
    try {
        // Only admins can delete users
        if (req.user.role !== UserRole.SYSTEM_ADMIN) {
            return res.status(403).json({ error: 'Unauthorized - Admin access required' });
        }

        const result = await authService.deleteUser(req.params.id);
        res.json(result);
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

// Check if email exists
router.get('/check-email/:email', async (req, res) => {
    try {
        const exists = await authService.checkEmailExists(req.params.email);
        res.json({ exists });
    } catch (error) {
        console.error('Error checking email:', error);
        res.status(500).json({ error: 'Failed to check email' });
    }
});

module.exports = router;
