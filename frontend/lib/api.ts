// API base URL - change this to your backend URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Helper to get the auth token from localStorage
function getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('eventmate_token');
}

// Helper to set the auth token
export function setToken(token: string): void {
    localStorage.setItem('eventmate_token', token);
}

// Helper to remove the auth token
export function removeToken(): void {
    localStorage.removeItem('eventmate_token');
}

// Generic fetch wrapper
async function fetchApi<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = getToken();

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    // Handle 401 - Unauthorized
    if (response.status === 401) {
        removeToken();
        if (typeof window !== 'undefined') {
            window.location.href = '/login';
        }
    }

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'An error occurred');
    }

    return data;
}

// ============ AUTH API ============

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data: {
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
        token: string;
    };
}

export const authApi = {
    login: (credentials: LoginRequest) =>
        fetchApi<AuthResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        }),

    register: (userData: RegisterRequest) =>
        fetchApi<AuthResponse>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        }),

    getCurrentUser: () =>
        fetchApi<{ success: boolean; data: { user: any } }>('/auth/me'),
};

// ============ USER API ============

export interface UserProfile {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
}

export const userApi = {
    getProfile: () =>
        fetchApi<{ success: boolean; data: { user: UserProfile } }>('/user/profile'),

    updateProfile: (name: string) =>
        fetchApi<{ success: boolean; data: { user: UserProfile } }>('/user/profile', {
            method: 'PUT',
            body: JSON.stringify({ name }),
        }),
};

// ============ EVENTS API ============

export interface Event {
    id: number;
    title: string;
    description: string;
    date: string;
    time: string;
    location_venue?: string;
    location?: string;
    category: string;
    organizer_id: number;
    organizer_name: string;
    status: string;
    capacity?: number;
    is_paid?: boolean;
    created_at: string;
}

export interface EventsResponse {
    success: boolean;
    data: {
        events: Event[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    };
}

export interface EventResponse {
    success: boolean;
    data: {
        event: Event;
    };
}

export interface OrganizerEventsResponse {
    success: boolean;
    data: {
        events: any[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    };
}

export const eventsApi = {
    getAll: (params?: {
        category?: string;
        date?: string;
        search?: string;
        page?: number;
        limit?: number;
    }) => {
        const searchParams = new URLSearchParams();
        if (params?.category) searchParams.set('category', params.category);
        if (params?.date) searchParams.set('date', params.date);
        if (params?.search) searchParams.set('search', params.search);
        if (params?.page) searchParams.set('page', params.page.toString());
        if (params?.limit) searchParams.set('limit', params.limit.toString());

        const query = searchParams.toString();
        return fetchApi<EventsResponse>(`/events${query ? `?${query}` : ''}`);
    },

    getById: (id: number) =>
        fetchApi<EventResponse>(`/events/${id}`),

    create: (eventData: Partial<Event>) =>
        fetchApi<EventResponse>('/events', {
            method: 'POST',
            body: JSON.stringify(eventData),
        }),

    update: (id: number, eventData: Partial<Event>) =>
        fetchApi<EventResponse>(`/events/${id}`, {
            method: 'PUT',
            body: JSON.stringify(eventData),
        }),

    delete: (id: number) =>
        fetchApi<{ success: boolean }>(`/events/${id}`, {
            method: 'DELETE',
        }),

    getOrganizerEvents: (params?: { page?: number; limit?: number }) => {
        const searchParams = new URLSearchParams();
        if (params?.page) searchParams.set('page', params.page.toString());
        if (params?.limit) searchParams.set('limit', params.limit.toString());
        const query = searchParams.toString();
        return fetchApi<OrganizerEventsResponse>(`/events/organizer/my-events${query ? `?${query}` : ''}`);
    },

    rsvp: (eventId: number) =>
        fetchApi<{ success: boolean }>(`/events/${eventId}/rsvp`, {
            method: 'POST',
        }),

    cancelRsvp: (eventId: number) =>
        fetchApi<{ success: boolean }>(`/events/${eventId}/rsvp`, {
            method: 'DELETE',
        }),
};

// ============ REGISTRATIONS API ============

export interface Registration {
    id: number;
    event_id: number;
    user_id: number;
    status: string;
    created_at: string;
}

export const registrationsApi = {
    getMyRegistrations: () =>
        fetchApi<{ success: boolean; data: { registrations: any[] } }>('/user/registrations'),

    register: (eventId: number) =>
        fetchApi<{ success: boolean }>(`/events/${eventId}/register`, {
            method: 'POST',
        }),

    cancelRegistration: (eventId: number) =>
        fetchApi<{ success: boolean }>(`/events/${eventId}/register`, {
            method: 'DELETE',
        }),

    getMyEvents: () =>
        fetchApi<{ success: boolean; data: { events: any[] } }>('/user/my-events'),
};

// ============ FAVORITES API ============

export const favoritesApi = {
    getMyFavorites: () =>
        fetchApi<{ success: boolean; data: { favorites: any[] } }>('/user/favorites'),

    addFavorite: (eventId: number) =>
        fetchApi<{ success: boolean }>(`/events/${eventId}/favorite`, {
            method: 'POST',
        }),

    removeFavorite: (eventId: number) =>
        fetchApi<{ success: boolean }>(`/events/${eventId}/favorite`, {
            method: 'DELETE',
        }),

    getFavorites: () =>
        fetchApi<{ success: boolean; data: { events: any[] } }>('/user/favorites'),
};

// ============ ADMIN API ============

export interface AdminStats {
    total_users: number;
    total_events: number;
    approved_events: number;
    pending_events: number;
    total_registrations: number;
    users_by_role: { role: string; count: number }[];
    events_by_status: { status: string; count: number }[];
}

export const adminApi = {
    getStats: () =>
        fetchApi<{ success: boolean; data: { stats: AdminStats } }>('/admin/stats'),

    getPendingEvents: (params?: { page?: number; limit?: number }) => {
        const searchParams = new URLSearchParams();
        if (params?.page) searchParams.set('page', params.page.toString());
        if (params?.limit) searchParams.set('limit', params.limit.toString());
        const query = searchParams.toString();
        return fetchApi<{ success: boolean; data: { events: any[]; pagination: any } }>(`/admin/pending-events${query ? `?${query}` : ''}`);
    },

    updateEventStatus: (eventId: number, status: string) =>
        fetchApi<{ success: boolean }>(`/admin/events/${eventId}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        }),

    getUsers: (params?: { page?: number; limit?: number; role?: string }) => {
        const searchParams = new URLSearchParams();
        if (params?.page) searchParams.set('page', params.page.toString());
        if (params?.limit) searchParams.set('limit', params.limit.toString());
        if (params?.role) searchParams.set('role', params.role);
        const query = searchParams.toString();
        return fetchApi<{ success: boolean; data: { users: any[]; pagination: any } }>(`/admin/users${query ? `?${query}` : ''}`);
    },

    updateUserRole: (userId: number, role: string) =>
        fetchApi<{ success: boolean }>(`/admin/users/${userId}/role`, {
            method: 'PATCH',
            body: JSON.stringify({ role }),
        }),

    deleteUser: (userId: number) =>
        fetchApi<{ success: boolean }>(`/admin/users/${userId}`, {
            method: 'DELETE',
        }),

    getLogs: (params?: { page?: number; limit?: number; user_id?: number }) => {
        const searchParams = new URLSearchParams();
        if (params?.page) searchParams.set('page', params.page.toString());
        if (params?.limit) searchParams.set('limit', params.limit.toString());
        if (params?.user_id) searchParams.set('user_id', params.user_id.toString());
        const query = searchParams.toString();
        return fetchApi<{ success: boolean; data: { logs: any[]; pagination: any } }>(`/admin/logs${query ? `?${query}` : ''}`);
    },
};
