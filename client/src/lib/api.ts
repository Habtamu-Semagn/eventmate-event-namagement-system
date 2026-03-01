// API Utility for making requests to backend

import { Event, Registration } from '@/types';

const API_BASE = '/api';

export async function fetchEvents(): Promise<Event[]> {
    const response = await fetch(`${API_BASE}/events`);
    return response.json();
}

export async function fetchRegistrations(token: string): Promise<Registration[]> {
    const response = await fetch(`${API_BASE}/registrations/my`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.json();
}

export async function registerForEvent(eventId: string, token: string): Promise<Response> {
    const response = await fetch(`${API_BASE}/registrations`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ eventId })
    });
    return response;
}

export async function createEvent(eventData: Partial<Event>, token: string): Promise<Response> {
    const response = await fetch(`${API_BASE}/events`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(eventData)
    });
    return response;
}

export async function updateEventStatus(
    eventId: string,
    status: string,
    token: string
): Promise<Response> {
    const response = await fetch(`${API_BASE}/events/${eventId}/status`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
    });
    return response;
}

export async function fetchPendingEvents(token: string): Promise<Event[]> {
    const response = await fetch(`${API_BASE}/events/pending`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.json();
}

export async function getUserProfile(token: string): Promise<Response> {
    const response = await fetch(`${API_BASE}/users/me`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.json();
}

export async function fetchEventById(eventId: string): Promise<Event | null> {
    const response = await fetch(`${API_BASE}/events/${eventId}`);
    if (!response.ok) {
        return null;
    }
    return response.json();
}
