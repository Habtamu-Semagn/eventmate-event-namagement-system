export interface Location {
    address: string;
    city: string;
    country: string;
}

export interface Event {
    id: string;
    title: string;
    description: string;
    category: string;
    date: string;
    endDate?: string;
    capacity: number;
    registeredCount?: number;
    location: Location;
    organizerId: string;
    organizerName?: string;
    status: 'pending' | 'approved' | 'rejected';
    // Ticketing
    isFree: boolean;
    ticketPrice?: number;
    createdAt: string;
}

export interface Registration {
    id: string;
    eventId: string;
    userId: string;
    status: 'confirmed' | 'cancelled' | 'waitlisted';
    createdAt: string;
}

export interface UserData {
    uid: string;
    email: string;
    displayName: string;
    role: 'registered_user' | 'event_organizer' | 'system_admin';
    interests?: string[];
    favorites?: string[];
    createdAt: string;
}

export interface EventFilters {
    search: string;
    category: string;
    location: string;
}
