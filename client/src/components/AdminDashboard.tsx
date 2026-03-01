'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { fetchPendingEvents, updateEventStatus } from '@/lib/api';
import { Event } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminDashboard() {
    const { user } = useAuth();
    const [pendingEvents, setPendingEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updating, setUpdating] = useState<string | null>(null);

    useEffect(() => {
        loadPendingEvents();
    }, []);

    const loadPendingEvents = async () => {
        if (!user) return;

        try {
            const token = await user.getIdToken();
            const events = await fetchPendingEvents(token);
            setPendingEvents(Array.isArray(events) ? events : []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch pending events');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (eventId: string) => {
        await changeEventStatus(eventId, 'approved');
    };

    const handleReject = async (eventId: string) => {
        await changeEventStatus(eventId, 'rejected');
    };

    const changeEventStatus = async (eventId: string, status: string) => {
        if (!user) return;

        setUpdating(eventId);
        try {
            const token = await user.getIdToken();
            await updateEventStatus(eventId, status, token);
            setPendingEvents(prev => prev.filter(e => e.id !== eventId));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update event');
        } finally {
            setUpdating(null);
        }
    };

    const formatDate = (dateString?: string): string => {
        if (!dateString) return 'TBD';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return <div className="py-8 text-center text-gray-500">Loading pending events...</div>;
    }

    return (
        <Card className="mx-auto max-w-[900px]">
            <CardHeader>
                <CardTitle>Admin Dashboard - Event Approvals</CardTitle>
                <CardDescription>Review and approve or reject pending events</CardDescription>
            </CardHeader>
            <CardContent>
                {error && (
                    <div className="mb-4 rounded-md bg-red-100 p-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {pendingEvents.length === 0 ? (
                    <div className="py-16 text-center text-gray-500">
                        <h3 className="mb-2 text-lg font-semibold">No pending events</h3>
                        <p>All events have been reviewed.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {pendingEvents.map(event => (
                            <div key={event.id} className="rounded-lg border p-6">
                                <div className="mb-3 flex items-center justify-between">
                                    <span className="rounded-full bg-[#EEB42C] px-3 py-1 text-xs font-semibold uppercase text-[#180404]">
                                        {event.category}
                                    </span>
                                    <span className="rounded bg-yellow-500 px-2 py-1 text-xs font-semibold text-white">
                                        Pending
                                    </span>
                                </div>

                                <h3 className="mb-2 text-lg font-semibold">{event.title}</h3>
                                <p className="mb-4 text-sm text-gray-500 line-clamp-2">{event.description}</p>

                                <div className="mb-4 grid grid-cols-2 gap-2 text-sm text-gray-600">
                                    <div>
                                        <strong>Date:</strong> {formatDate(event.date)}
                                    </div>
                                    <div>
                                        <strong>Location:</strong> {event.location?.city}, {event.location?.country}
                                    </div>
                                    <div>
                                        <strong>Capacity:</strong> {event.capacity}
                                    </div>
                                    <div>
                                        <strong>Organizer:</strong> {event.organizerName}
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <Button
                                        className="bg-green-600 hover:bg-green-700"
                                        onClick={() => handleApprove(event.id)}
                                        disabled={updating === event.id}
                                    >
                                        {updating === event.id ? 'Processing...' : '✓ Approve'}
                                    </Button>
                                    <Button
                                        className="bg-red-600 hover:bg-red-700"
                                        onClick={() => handleReject(event.id)}
                                        disabled={updating === event.id}
                                    >
                                        {updating === event.id ? 'Processing...' : '✗ Reject'}
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
