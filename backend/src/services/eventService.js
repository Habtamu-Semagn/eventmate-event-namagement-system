const { db } = require('../config/firebase');
const { EventStatus, UserRole } = require('../schema/firestore');

/**
 * Event Service
 * Handles event CRUD operations with role-based access
 */
class EventService {

    /**
     * Get all events (filtered by status for non-organizers)
     */
    async getAllEvents(filters = {}) {
        try {
            let query = db.collection('events');

            // Filter by status if provided
            if (filters.status) {
                query = query.where('status', '==', filters.status);
            }

            // Filter by category if provided
            if (filters.category) {
                query = query.where('category', '==', filters.category);
            }

            // Filter by organizer if provided
            if (filters.organizerId) {
                query = query.where('organizerId', '==', filters.organizerId);
            }

            const snapshot = await query.get();
            const events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            // Sort by date ascending in memory
            events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            return events;
        } catch (error) {
            console.error('Error fetching events:', error);
            throw error;
        }
    }

    /**
     * Get event by ID
     */
    async getEventById(eventId) {
        try {
            const eventDoc = await db.collection('events').doc(eventId).get();
            if (!eventDoc.exists) {
                return null;
            }
            return { id: eventDoc.id, ...eventDoc.data() };
        } catch (error) {
            console.error('Error fetching event:', error);
            throw error;
        }
    }

    /**
     * Create new event
     */
    async createEvent(eventData, organizerId, organizerName) {
        try {
            const eventRef = await db.collection('events').add({
                title: eventData.title,
                description: eventData.description,
                category: eventData.category,
                date: eventData.date,
                endDate: eventData.endDate || null,
                location: eventData.location,
                capacity: eventData.capacity,
                registeredCount: 0,
                status: EventStatus.PENDING, // Events start as pending
                organizerId,
                organizerName,
                imageUrl: eventData.imageUrl || null,
                tags: eventData.tags || [],
                // Ticketing
                isFree: eventData.isFree !== undefined ? eventData.isFree : true,
                ticketPrice: eventData.ticketPrice || 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });

            return { id: eventRef.id, ...eventData };
        } catch (error) {
            console.error('Error creating event:', error);
            throw error;
        }
    }

    /**
     * Update event
     */
    async updateEvent(eventId, eventData, userId, userRole) {
        try {
            const eventDoc = await db.collection('events').doc(eventId).get();

            if (!eventDoc.exists) {
                throw new Error('Event not found');
            }

            const event = eventDoc.data();

            // Check authorization: only organizer or admin can update
            if (userRole !== UserRole.SYSTEM_ADMIN && event.organizerId !== userId) {
                throw new Error('Unauthorized to update this event');
            }

            const updates = { ...eventData, updatedAt: new Date().toISOString() };

            // If status is being changed and user is not admin, prevent it
            if (eventData.status && userRole !== UserRole.SYSTEM_ADMIN) {
                delete updates.status;
            }

            await db.collection('events').doc(eventId).update(updates);

            return { id: eventId, ...updates };
        } catch (error) {
            console.error('Error updating event:', error);
            throw error;
        }
    }

    /**
     * Approve or reject event (Admin/Organizer only)
     */
    async updateEventStatus(eventId, status, userRole) {
        try {
            if (!Object.values(EventStatus).includes(status)) {
                throw new Error('Invalid status');
            }

            // Only admin or event organizer can change status
            const eventDoc = await db.collection('events').doc(eventId).get();
            if (!eventDoc.exists) {
                throw new Error('Event not found');
            }

            const event = eventDoc.data();

            // If user is not admin, they can only approve their own events
            if (userRole !== UserRole.SYSTEM_ADMIN && event.organizerId !== userId) {
                throw new Error('Unauthorized to change event status');
            }

            await db.collection('events').doc(eventId).update({
                status,
                updatedAt: new Date().toISOString()
            });

            return { id: eventId, status };
        } catch (error) {
            console.error('Error updating event status:', error);
            throw error;
        }
    }

    /**
     * Delete event
     */
    async deleteEvent(eventId, userId, userRole) {
        try {
            const eventDoc = await db.collection('events').doc(eventId).get();

            if (!eventDoc.exists) {
                throw new Error('Event not found');
            }

            const event = eventDoc.data();

            // Check authorization: only organizer or admin can delete
            if (userRole !== UserRole.SYSTEM_ADMIN && event.organizerId !== userId) {
                throw new Error('Unauthorized to delete this event');
            }

            await db.collection('events').doc(eventId).delete();

            return { message: 'Event deleted successfully' };
        } catch (error) {
            console.error('Error deleting event:', error);
            throw error;
        }
    }

    /**
     * Get events by category
     */
    async getEventsByCategory(category) {
        try {
            const snapshot = await db.collection('events')
                .where('category', '==', category)
                .where('status', '==', EventStatus.APPROVED)
                .get();

            const events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            // Sort by date ascending in memory
            events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            return events;
        } catch (error) {
            console.error('Error fetching events by category:', error);
            throw error;
        }
    }

    /**
     * Get events organized by a user
     */
    async getEventsByOrganizer(organizerId) {
        try {
            const snapshot = await db.collection('events')
                .where('organizerId', '==', organizerId)
                .get();

            const events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            // Sort by createdAt descending in memory
            events.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            return events;
        } catch (error) {
            console.error('Error fetching events by organizer:', error);
            throw error;
        }
    }
}

module.exports = new EventService();
module.exports.EventStatus = EventStatus;
