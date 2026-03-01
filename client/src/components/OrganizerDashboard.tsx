'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Event } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface OrganizerDashboardProps {
    onEditEvent?: (event: Event) => void;
    onDeleteEvent?: (eventId: string) => void;
    onViewAttendees?: (eventId: string) => void;
}

export default function OrganizerDashboard({ onEditEvent, onDeleteEvent, onViewAttendees }: OrganizerDashboardProps) {
    const { user } = useAuth();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            fetchMyEvents();
        }
    }, [user]);

    const fetchMyEvents = async () => {
        try {
            const token = await user?.getIdToken();
            const response = await fetch('/api/events/my-events', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch events');
            }

            const data = await response.json();
            setEvents(data.events || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load events');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (eventId: string) => {
        if (!confirm('Are you sure you want to delete this event?')) return;

        try {
            const token = await user?.getIdToken();
            const response = await fetch(`/api/events/${eventId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete event');
            }

            setEvents(events.filter(e => e.id !== eventId));
            onDeleteEvent?.(eventId);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete event');
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return <Badge className="bg-green-500">Approved</Badge>;
            case 'rejected':
                return <Badge className="bg-red-500">Rejected</Badge>;
            case 'pending':
            default:
                return <Badge className="bg-yellow-500">Pending</Badge>;
        }
    };

    const getTicketingInfo = (event: Event) => {
        if (event.isFree) {
            return <span className="text-green-600 font-medium">Free (RSVP)</span>;
        }
        return <span className="text-[#AC1212] font-medium">${event.ticketPrice?.toFixed(2)}</span>;
    };

    if (loading) {
        return (
            <Card>
                <CardContent className="py-10 text-center">
                    <p className="text-gray-500">Loading your events...</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>My Events</CardTitle>
                <CardDescription>
                    Manage your created events
                </CardDescription>
            </CardHeader>
            <CardContent>
                {error && (
                    <div className="mb-4 rounded-md bg-red-100 p-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {events.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500">You haven't created any events yet.</p>
                        <p className="text-sm text-gray-400 mt-1">Create your first event to get started!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {events.map((event) => (
                            <div
                                key={event.id}
                                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-semibold truncate">{event.title}</h3>
                                        {getStatusBadge(event.status)}
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <span>{new Date(event.date).toLocaleDateString()}</span>
                                        <span>•</span>
                                        <span>{event.registeredCount || 0} / {event.capacity} registered</span>
                                        <span>•</span>
                                        {getTicketingInfo(event)}
                                    </div>
                                    <div className="text-sm text-gray-400 mt-1">
                                        {event.location.city}, {event.location.country}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onViewAttendees?.(event.id)}
                                    >
                                        Attendees
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onEditEvent?.(event)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDelete(event.id)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
