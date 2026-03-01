'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Event } from '@/types';
import { fetchEventById, registerForEvent } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
    Calendar,
    MapPin,
    Users,
    Clock,
    ArrowLeft,
    Ticket,
    Share2,
    Heart,
    CheckCircle,
    XCircle
} from 'lucide-react';
import Link from 'next/link';

// Mock event data for demo (since backend isn't connected)
const mockEvent: Event = {
    id: '1',
    title: 'Tech Conference 2026',
    description: 'Join us for the biggest tech conference of the year! This event brings together industry leaders, innovators, and tech enthusiasts from around the world. Expect keynote speeches, workshops, networking opportunities, and hands-on demonstrations of cutting-edge technology.\n\nWhat to expect:\n- Keynote speeches from industry leaders\n- Hands-on workshops and training sessions\n- Networking with 500+ professionals\n- Live demonstrations of emerging technologies\n- Career fair with top tech companies',
    category: 'Technology',
    date: '2026-03-15T09:00:00Z',
    endDate: '2026-03-15T18:00:00Z',
    capacity: 500,
    registeredCount: 342,
    location: {
        address: '123 Tech Blvd',
        city: 'San Francisco',
        country: 'USA'
    },
    status: 'approved',
    isFree: false,
    ticketPrice: 99.99,
    organizerId: 'org1', organizerName: 'Eventmate Organizer', createdAt: '2026-01-01T00:00:00Z',
};

export default function EventDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [registering, setRegistering] = useState(false);
    const [error, setError] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);
    const [ticketQuantity, setTicketQuantity] = useState(1);

    useEffect(() => {
        loadEvent();
    }, [params.id]);

    const loadEvent = async () => {
        setLoading(true);
        try {
            // Try to fetch from API, fall back to mock data
            const data = await fetchEventById(params.id as string);
            setEvent(data || mockEvent);
        } catch (error) {
            console.log('Using mock event data');
            setEvent({ ...mockEvent, id: params.id as string });
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'TBD';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const formatTime = (dateString?: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleRegister = async () => {
        if (!user) {
            router.push('/login');
            return;
        }

        if (!event) return;

        const registeredCount = event.registeredCount || 0;
        const capacity = event.capacity || 0;

        if (registeredCount >= capacity) {
            setError('This event is at full capacity');
            return;
        }

        setRegistering(true);
        setError('');

        try {
            const token = await user.getIdToken();
            await registerForEvent(event.id, token);
            setIsRegistered(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to register');
        } finally {
            setRegistering(false);
        }
    };

    const getStatusBadge = (status?: string) => {
        const styles: Record<string, string> = {
            approved: 'bg-green-100 text-green-700 border-green-200',
            pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
            rejected: 'bg-red-100 text-red-700 border-red-200',
        };
        return styles[status || 'pending'] || styles.pending;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#AC1212] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading event details...</p>
                </div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900">Event not found</h2>
                    <p className="mt-2 text-gray-600">The event you're looking for doesn't exist.</p>
                    <Link href="/">
                        <Button className="mt-4 bg-[#AC1212] hover:bg-[#8a0f0f]">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Events
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    const spotsLeft = (event.capacity || 0) - (event.registeredCount || 0);
    const isFull = spotsLeft <= 0;

    const categoryColors: Record<string, string> = {
        'Cultural': '#AC1212',
        'Educational': '#4A0202',
        'Social': '#DC901E',
        'Technology': '#3B82F6',
        'Music': '#8B5CF6',
        'Sports': '#10B981',
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div
                className="relative h-64 md:h-80"
                style={{ background: categoryColors[event.category] || '#AC1212' }}
            >
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-8xl">🎉</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

                {/* Back Button */}
                <div className="absolute top-4 left-4">
                    <Link href="/">
                        <Button variant="secondary" size="sm" className="bg-white/90 hover:bg-white">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Events
                        </Button>
                    </Link>
                </div>

                {/* Category Badge */}
                <div className="absolute top-4 right-4">
                    <Badge className="bg-white/90 text-gray-900 font-semibold px-4 py-1">
                        {event.category}
                    </Badge>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Title and Status */}
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{event.title}</h1>
                                <div className="flex items-center gap-3 mt-2">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadge(event.status)}`}>
                                        {event.status === 'approved' ? 'Published' : event.status}
                                    </span>
                                    <span className="text-gray-500 text-sm">
                                        {event.registeredCount || 0} / {event.capacity} registered
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="icon">
                                    <Heart className="w-5 h-5" />
                                </Button>
                                <Button variant="outline" size="icon">
                                    <Share2 className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>

                        {/* Date and Location */}
                        <Card>
                            <CardContent className="pt-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-full bg-[#AC1212]/10 flex items-center justify-center">
                                            <Calendar className="w-5 h-5 text-[#AC1212]" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{formatDate(event.date)}</p>
                                            <p className="text-sm text-gray-500">
                                                {formatTime(event.date)} - {formatTime(event.endDate)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-full bg-[#AC1212]/10 flex items-center justify-center">
                                            <MapPin className="w-5 h-5 text-[#AC1212]" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{event.location?.city}</p>
                                            <p className="text-sm text-gray-500">{event.location?.address}, {event.location?.country}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Description */}
                        <Card>
                            <CardHeader>
                                <CardTitle>About This Event</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="prose prose-gray max-w-none">
                                    {event.description?.split('\n').map((paragraph, index) => (
                                        <p key={index} className="mb-4 text-gray-600 whitespace-pre-line">
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Organizer Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Organizer</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-[#AC1212] flex items-center justify-center text-white font-bold text-xl">
                                        A
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">Eventmate Organizer</p>
                                        <p className="text-sm text-gray-500">Event organizer since 2024</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar - Registration */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-8">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Ticket className="w-5 h-5" />
                                    {event.isFree ? 'Free Event' : 'Get Tickets'}
                                </CardTitle>
                                <CardDescription>
                                    {isFull ? (
                                        <span className="text-red-600 font-medium">Event is at full capacity</span>
                                    ) : (
                                        <span>{spotsLeft} spots left</span>
                                    )}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {error && (
                                    <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                                        {error}
                                    </div>
                                )}

                                {isRegistered ? (
                                    <div className="rounded-md bg-green-50 p-4 text-center">
                                        <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-2" />
                                        <p className="font-medium text-green-700">You're registered!</p>
                                        <p className="text-sm text-green-600 mt-1">Check your email for confirmation.</p>
                                    </div>
                                ) : isFull ? (
                                    <div className="rounded-md bg-gray-100 p-4 text-center">
                                        <XCircle className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                        <p className="font-medium text-gray-700">Sold Out</p>
                                        <p className="text-sm text-gray-500 mt-1">Join the waitlist to be notified</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="text-center py-4">
                                            <p className="text-4xl font-bold text-[#AC1212]">
                                                {event.isFree ? 'Free' : `$${event.ticketPrice?.toFixed(2)}`}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {event.isFree ? 'No tickets required' : 'per person'}
                                            </p>
                                        </div>

                                        {!event.isFree && (
                                            <>
                                                <Separator />
                                                <div>
                                                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                                                        Number of tickets
                                                    </label>
                                                    <Input
                                                        type="number"
                                                        min={1}
                                                        max={Math.min(10, spotsLeft)}
                                                        value={ticketQuantity}
                                                        onChange={(e) => setTicketQuantity(parseInt(e.target.value) || 1)}
                                                        className="text-center"
                                                    />
                                                </div>
                                                <div className="flex justify-between font-medium text-gray-900 pt-2">
                                                    <span>Total:</span>
                                                    <span>${((event.ticketPrice || 0) * ticketQuantity).toFixed(2)}</span>
                                                </div>
                                            </>
                                        )}

                                        <Button
                                            className="w-full bg-[#AC1212] hover:bg-[#8a0f0f] h-12 text-lg"
                                            onClick={handleRegister}
                                            disabled={registering}
                                        >
                                            {registering ? 'Registering...' :
                                                !user ? 'Sign in to Register' :
                                                    event.isFree ? 'RSVP Now' : 'Buy Tickets'}
                                        </Button>

                                        <p className="text-xs text-gray-500 text-center">
                                            By registering, you agree to our terms and conditions.
                                        </p>
                                    </>
                                )}

                                <Separator />

                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-sm">
                                        <Users className="w-4 h-4 text-gray-500" />
                                        <span className="text-gray-600">{event.capacity} maximum attendees</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <Clock className="w-4 h-4 text-gray-500" />
                                        <span className="text-gray-600">{formatTime(event.date)} - {formatTime(event.endDate)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
