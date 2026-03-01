'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { UserData } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Attendee {
    id: string;
    userId: string;
    user?: UserData;
    status: 'confirmed' | 'cancelled' | 'waitlisted';
    createdAt: string;
}

interface AttendeeListProps {
    eventId: string;
    eventTitle: string;
    onClose?: () => void;
}

export default function AttendeeList({ eventId, eventTitle, onClose }: AttendeeListProps) {
    const { user } = useAuth();
    const [attendees, setAttendees] = useState<Attendee[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchAttendees();
    }, [eventId]);

    const fetchAttendees = async () => {
        try {
            const token = await user?.getIdToken();
            const response = await fetch(`/api/registrations/event/${eventId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch attendees');
            }

            const data = await response.json();
            setAttendees(data.registrations || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load attendees');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'confirmed':
                return <Badge className="bg-green-500">Confirmed</Badge>;
            case 'cancelled':
                return <Badge className="bg-red-500">Cancelled</Badge>;
            case 'waitlisted':
                return <Badge className="bg-yellow-500">Waitlisted</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    const confirmedCount = attendees.filter(a => a.status === 'confirmed').length;
    const cancelledCount = attendees.filter(a => a.status === 'cancelled').length;
    const waitlistedCount = attendees.filter(a => a.status === 'waitlisted').length;

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Attendees</CardTitle>
                        <CardDescription>{eventTitle}</CardDescription>
                    </div>
                    {onClose && (
                        <Button variant="outline" size="sm" onClick={onClose}>
                            Close
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                {error && (
                    <div className="mb-4 rounded-md bg-red-100 p-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {/* Summary Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{confirmedCount}</div>
                        <div className="text-sm text-green-600">Confirmed</div>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">{waitlistedCount}</div>
                        <div className="text-sm text-yellow-600">Waitlisted</div>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">{cancelledCount}</div>
                        <div className="text-sm text-red-600">Cancelled</div>
                    </div>
                </div>

                {loading ? (
                    <p className="text-center text-gray-500 py-4">Loading attendees...</p>
                ) : attendees.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">No one has registered for this event yet.</p>
                ) : (
                    <div className="space-y-3">
                        {attendees.map((attendee) => (
                            <div
                                key={attendee.id}
                                className="flex items-center justify-between p-3 border rounded-lg"
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium">
                                        {attendee.user?.displayName || 'Unknown User'}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {attendee.user?.email || 'No email'}
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1">
                                        Registered: {new Date(attendee.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="ml-4">
                                    {getStatusBadge(attendee.status)}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
