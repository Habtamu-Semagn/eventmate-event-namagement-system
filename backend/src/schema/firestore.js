/**
 * Firestore Schema Definitions for Eventmate
 * 
 * Collections:
 * - users: User profiles with roles
 * - events: Event details
 * - registrations: Event registrations
 */

// User Roles
const UserRole = {
    VISITOR: 'visitor',
    REGISTERED_USER: 'registered_user',
    EVENT_ORGANIZER: 'event_organizer',
    SYSTEM_ADMIN: 'system_admin'
};

// Event Status
const EventStatus = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    CANCELLED: 'cancelled'
};

// Registration Status
const RegistrationStatus = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    CANCELLED: 'cancelled',
    ATTENDED: 'attended'
};

// User Schema
const userSchema = {
    collection: 'users',
    fields: {
        uid: { type: 'string', required: true },
        email: { type: 'string', required: true, unique: true },
        displayName: { type: 'string', required: false },
        role: {
            type: 'string',
            required: true,
            default: 'visitor',
            enum: Object.values(UserRole)
        },
        interests: { type: 'array', items: { type: 'string' }, default: [] },
        createdAt: { type: 'timestamp', required: true },
        updatedAt: { type: 'timestamp', required: true },
        lastLogin: { type: 'timestamp', required: false },
        profileImage: { type: 'string', required: false },
        bio: { type: 'string', required: false }
    }
};

// Event Schema
const eventSchema = {
    collection: 'events',
    fields: {
        id: { type: 'string', required: true },
        title: { type: 'string', required: true },
        description: { type: 'string', required: true },
        category: { type: 'string', required: true },
        date: { type: 'timestamp', required: true },
        endDate: { type: 'timestamp', required: false },
        location: {
            type: 'object',
            fields: {
                address: { type: 'string', required: true },
                city: { type: 'string', required: true },
                country: { type: 'string', required: true },
                coordinates: {
                    type: 'object',
                    fields: {
                        latitude: { type: 'number' },
                        longitude: { type: 'number' }
                    }
                }
            }
        },
        capacity: { type: 'number', required: true },
        registeredCount: { type: 'number', default: 0 },
        status: {
            type: 'string',
            required: true,
            default: 'pending',
            enum: Object.values(EventStatus)
        },
        organizerId: { type: 'string', required: true },
        organizerName: { type: 'string', required: true },
        imageUrl: { type: 'string', required: false },
        tags: { type: 'array', items: { type: 'string' }, default: [] },
        createdAt: { type: 'timestamp', required: true },
        updatedAt: { type: 'timestamp', required: true }
    }
};

// Registration Schema
const registrationSchema = {
    collection: 'registrations',
    fields: {
        id: { type: 'string', required: true },
        userId: { type: 'string', required: true },
        eventId: { type: 'string', required: true },
        status: {
            type: 'string',
            required: true,
            default: 'pending',
            enum: Object.values(RegistrationStatus)
        },
        registeredAt: { type: 'timestamp', required: true },
        updatedAt: { type: 'timestamp', required: true },
        notes: { type: 'string', required: false }
    }
};

// Indexes (for Firestore composite indexes)
const indexes = {
    events: [
        { fields: ['status', 'date'] },
        { fields: ['organizerId', 'status'] },
        { fields: ['category', 'status'] }
    ],
    registrations: [
        { fields: ['userId', 'eventId'] },
        { fields: ['eventId', 'status'] },
        { fields: ['userId', 'status'] }
    ]
};

module.exports = {
    UserRole,
    EventStatus,
    RegistrationStatus,
    userSchema,
    eventSchema,
    registrationSchema,
    indexes
};
