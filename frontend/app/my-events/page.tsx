'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MapPin, Users } from 'lucide-react';
import Link from 'next/link';
import { registrationsApi } from '@/lib/api';

export default function MyEventsPage() {
    const { user } = useAuth();
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMyEvents = async () => {
            if (!user) return;

            try {
                setLoading(true);
                const response = await registrationsApi.getMyEvents();
                setEvents(response.data.events || []);
            } catch (err: any) {
                console.error('Failed to fetch my events:', err);
                setError('Failed to load your events');
            } finally {
                setLoading(false);
            }
        };

        fetchMyEvents();
    }, [user]);

    if (!user) {
        return (
            <div className="flex min-h-screen flex-col">
                <Navbar />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-4">Please sign in to view your events</h2>
                        <Button asChild className="bg-[#AC1212] hover:bg-[#8a0f0f]">
                            <a href="/login">Sign In</a>
                        </Button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const getStatus = (eventDate: string) => {
        const eventTime = new Date(eventDate).getTime();
        const now = new Date().getTime();
        return eventTime > now ? 'upcoming' : 'past';
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 py-8">
                <div className="container mx-auto px-4">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold">My Registered Events</h1>
                        <p className="text-muted-foreground">Events you have registered for</p>
                    </div>

                    {loading && (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#AC1212] mx-auto"></div>
                            <p className="mt-4 text-muted-foreground">Loading your events...</p>
                        </div>
                    )}

                    {error && !loading && (
                        <div className="text-center py-12">
                            <p className="text-red-500">{error}</p>
                            <Button
                                variant="outline"
                                className="mt-4"
                                onClick={() => window.location.reload()}
                            >
                                Try Again
                            </Button>
                        </div>
                    )}

                    {!loading && !error && events.length === 0 && (
                        <div className="text-center py-12">
                            <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                            <h2 className="text-xl font-semibold mb-2">No events yet</h2>
                            <p className="text-muted-foreground mb-4">Start discovering events and register for ones you love</p>
                            <Button asChild className="bg-[#AC1212] hover:bg-[#8a0f0f]">
                                <Link href="/">Explore Events</Link>
                            </Button>
                        </div>
                    )}

                    {!loading && !error && events.length > 0 && (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {events.map((event) => (
                                <Card key={event.id} className="overflow-hidden">
                                    <CardContent className="p-6">
                                        <div className="mb-4">
                                            <span
                                                className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${getStatus(event.date) === 'upcoming'
                                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                        : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                                                    }`}
                                            >
                                                {getStatus(event.date) === 'upcoming' ? 'Upcoming' : 'Past'}
                                            </span>
                                            <span className="ml-2 inline-block rounded-full px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                                {event.registration_status || 'Registered'}
                                            </span>
                                        </div>
                                        <h3 className="mb-2 text-xl font-semibold">{event.title}</h3>
                                        <div className="space-y-2 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4" />
                                                {formatDate(event.date)} at {event.time}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4" />
                                                {event.location_venue || event.location || 'Location TBD'}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
