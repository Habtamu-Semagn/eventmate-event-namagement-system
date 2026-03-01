const { db, auth } = require('../config/firebase');
const { UserRole } = require('../schema/firestore');

/**
 * Authentication Service
 * Handles user registration, login, and role management
 */
class AuthService {

    /**
     * Register a new user with Firebase Auth
     */
    async register(email, password, displayName, role = UserRole.REGISTERED_USER) {
        try {
            // First check if user already exists in Firebase Auth
            let userRecord;
            try {
                userRecord = await auth.getUserByEmail(email);
            } catch (getError) {
                // User doesn't exist in Firebase Auth, create them
                userRecord = await auth.createUser({
                    email,
                    password,
                    displayName,
                    emailVerified: false
                });
            }

            // Check if user profile already exists in Firestore
            const existingProfile = await this.getUserById(userRecord.uid);
            if (existingProfile) {
                return {
                    uid: userRecord.uid,
                    email: userRecord.email,
                    displayName: userRecord.displayName || displayName,
                    role: existingProfile.role
                };
            }

            // Create user document in Firestore
            await db.collection('users').doc(userRecord.uid).set({
                uid: userRecord.uid,
                email: userRecord.email,
                displayName: userRecord.displayName || displayName,
                role,
                interests: [],
                favorites: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });

            return {
                uid: userRecord.uid,
                email: userRecord.email,
                displayName: userRecord.displayName || displayName,
                role
            };
        } catch (error) {
            console.error('Error registering user:', error);
            throw error;
        }
    }

    /**
     * Login user and generate custom token
     */
    async login(email) {
        try {
            const userRecord = await auth.getUserByEmail(email);

            // Update last login
            await db.collection('users').doc(userRecord.uid).update({
                lastLogin: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });

            // Generate custom token
            const customToken = await auth.createCustomToken(userRecord.uid);

            // Get user profile
            const userDoc = await db.collection('users').doc(userRecord.uid).get();
            const userData = userDoc.data();

            return {
                token: customToken,
                uid: userRecord.uid,
                email: userRecord.email,
                displayName: userRecord.displayName,
                role: userData?.role || UserRole.VISITOR
            };
        } catch (error) {
            console.error('Error logging in user:', error);
            throw error;
        }
    }

    /**
     * Verify custom token and return user data
     */
    async verifyToken(idToken) {
        try {
            const decodedToken = await auth.verifyIdToken(idToken);
            const userDoc = await db.collection('users').doc(decodedToken.uid).get();

            if (!userDoc.exists) {
                throw new Error('User profile not found');
            }

            return {
                uid: decodedToken.uid,
                ...userDoc.data()
            };
        } catch (error) {
            console.error('Error verifying token:', error);
            throw error;
        }
    }

    /**
     * Check if email already exists
     */
    async checkEmailExists(email) {
        try {
            // Check in Firestore users collection
            const snapshot = await db.collection('users')
                .where('email', '==', email)
                .limit(1)
                .get();

            return !snapshot.empty;
        } catch (error) {
            console.error('Error checking email:', error);
            return false;
        }
    }

    /**
     * Get user by ID
     */
    async getUserById(uid) {
        try {
            const userDoc = await db.collection('users').doc(uid).get();
            if (!userDoc.exists) {
                return null;
            }
            return { id: userDoc.id, ...userDoc.data() };
        } catch (error) {
            console.error('Error getting user:', error);
            throw error;
        }
    }

    /**
     * Update user role
     */
    async updateUserRole(uid, newRole) {
        try {
            // Validate role
            if (!Object.values(UserRole).includes(newRole)) {
                throw new Error('Invalid role');
            }

            await db.collection('users').doc(uid).update({
                role: newRole,
                updatedAt: new Date().toISOString()
            });

            return { uid, role: newRole };
        } catch (error) {
            console.error('Error updating user role:', error);
            throw error;
        }
    }

    /**
     * Update user profile
     */
    async updateProfile(uid, profileData) {
        try {
            const allowedFields = ['displayName', 'interests', 'profileImage', 'bio'];
            const updates = {};

            for (const field of allowedFields) {
                if (profileData[field] !== undefined) {
                    updates[field] = profileData[field];
                }
            }

            updates.updatedAt = new Date().toISOString();

            await db.collection('users').doc(uid).update(updates);

            return { uid, ...updates };
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        }
    }

    /**
     * Check if user has required role
     */
    async hasRole(uid, requiredRoles) {
        try {
            const user = await this.getUserById(uid);
            if (!user) {
                return false;
            }

            if (Array.isArray(requiredRoles)) {
                return requiredRoles.includes(user.role);
            }

            return user.role === requiredRoles;
        } catch (error) {
            console.error('Error checking role:', error);
            return false;
        }
    }

    /**
     * Delete user
     */
    async deleteUser(uid) {
        try {
            // Delete from Firebase Auth
            await auth.deleteUser(uid);

            // Delete from Firestore
            await db.collection('users').doc(uid).delete();

            return { message: 'User deleted successfully' };
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    }
}

module.exports = new AuthService();
module.exports.UserRole = UserRole;
