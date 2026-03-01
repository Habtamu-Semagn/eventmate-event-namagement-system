const { db } = require('../config/firebase');
const { RegistrationStatus, UserRole } = require('../schema/firestore');

/**
 * Registration Service
 * Handles event registration operations
 */
class RegistrationService {

    /**
     * Register for an event
     */
    async registerForEvent(userId, eventId) {
        try {
            // Check if event exists and is approved
            const eventDoc = await db.collection('events').doc(eventId).get();
            if (!eventDoc.exists) {
                throw new Error('Event not found');
            }

            const event = eventDoc.data();

            if (event.status !== 'approved') {
                throw new Error('Event is not available for registration');
            }

            // Check if event is full
            if (event.registeredCount >= event.capacity) {
                throw new Error('Event is full');
            }

            // Check if user already registered
            const existingReg = await db.collection('registrations')
                .where('userId', '==', userId)
                .where('eventId', '==', eventId)
                .limit(1)
                .get();

            if (!existingReg.empty) {
                throw new Error('Already registered for this event');
            }

            // Create registration
            const registrationRef = await db.collection('registrations').add({
                userId,
                eventId,
                status: RegistrationStatus.PENDING,
                registeredAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });

            // Update event registered count
            await db.collection('events').doc(eventId).update({
                registeredCount: event.registeredCount + 1,
                updatedAt: new Date().toISOString()
            });

            return {
                id: registrationRef.id,
                userId,
                eventId,
                status: RegistrationStatus.PENDING
            };
        } catch (error) {
            console.error('Error registering for event:', error);
            throw error;
        }
    }

    /**
     * Get registration by ID
     */
    async getRegistrationById(registrationId) {
        try {
            const regDoc = await db.collection('registrations').doc(registrationId).get();
            if (!regDoc.exists) {
                return null;
            }
            return { id: regDoc.id, ...regDoc.data() };
        } catch (error) {
            console.error('Error fetching registration:', error);
            throw error;
        }
    }

    /**
     * Get user's registrations
     */
    async getUserRegistrations(userId) {
        try {
            const snapshot = await db.collection('registrations')
                .where('userId', '==', userId)
                .get();

            const registrations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            // Sort by registeredAt descending in memory
            registrations.sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime());
            return registrations;
        } catch (error) {
            console.error('Error fetching user registrations:', error);
            throw error;
        }
    }

    /**
     * Get event registrations
     */
    async getEventRegistrations(eventId) {
        try {
            const snapshot = await db.collection('registrations')
                .where('eventId', '==', eventId)
                .get();

            const registrations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            // Sort by registeredAt descending in memory
            registrations.sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime());
            return registrations;
        } catch (error) {
            console.error('Error fetching event registrations:', error);
            throw error;
        }
    }

    /**
     * Update registration status
     */
    async updateRegistrationStatus(registrationId, status, userId, userRole) {
        try {
            if (!Object.values(RegistrationStatus).includes(status)) {
                throw new Error('Invalid status');
            }

            const regDoc = await db.collection('registrations').doc(registrationId).get();
            if (!regDoc.exists) {
                throw new Error('Registration not found');
            }

            const registration = regDoc.data();

            // Check authorization
            // User can update their own registration, or admin can update any
            if (userRole !== UserRole.SYSTEM_ADMIN && registration.userId !== userId) {
                throw new Error('Unauthorized to update this registration');
            }

            // If cancelling, update event count
            if (status === RegistrationStatus.CANCELLED &&
                registration.status !== RegistrationStatus.CANCELLED) {
                const eventDoc = await db.collection('events').doc(registration.eventId).get();
                if (eventDoc.exists) {
                    const event = eventDoc.data();
                    await db.collection('events').doc(registration.eventId).update({
                        registeredCount: Math.max(0, event.registeredCount - 1),
                        updatedAt: new Date().toISOString()
                    });
                }
            }

            await db.collection('registrations').doc(registrationId).update({
                status,
                updatedAt: new Date().toISOString()
            });

            return { id: registrationId, status };
        } catch (error) {
            console.error('Error updating registration:', error);
            throw error;
        }
    }

    /**
     * Cancel registration
     */
    async cancelRegistration(registrationId, userId) {
        try {
            return await this.updateRegistrationStatus(
                registrationId,
                RegistrationStatus.CANCELLED,
                userId,
                UserRole.REGISTERED_USER
            );
        } catch (error) {
            console.error('Error cancelling registration:', error);
            throw error;
        }
    }

    /**
     * Delete registration
     */
    async deleteRegistration(registrationId, userId, userRole) {
        try {
            const regDoc = await db.collection('registrations').doc(registrationId).get();
            if (!regDoc.exists) {
                throw new Error('Registration not found');
            }

            const registration = regDoc.data();

            // Check authorization
            if (userRole !== UserRole.SYSTEM_ADMIN && registration.userId !== userId) {
                throw new Error('Unauthorized to delete this registration');
            }

            // If registration was confirmed, update event count
            if (registration.status === RegistrationStatus.CONFIRMED) {
                const eventDoc = await db.collection('events').doc(registration.eventId).get();
                if (eventDoc.exists) {
                    const event = eventDoc.data();
                    await db.collection('events').doc(registration.eventId).update({
                        registeredCount: Math.max(0, event.registeredCount - 1),
                        updatedAt: new Date().toISOString()
                    });
                }
            }

            await db.collection('registrations').doc(registrationId).delete();

            return { message: 'Registration deleted successfully' };
        } catch (error) {
            console.error('Error deleting registration:', error);
            throw error;
        }
    }
}

module.exports = new RegistrationService();
module.exports.RegistrationStatus = RegistrationStatus;
