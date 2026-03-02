'use client';

import { useAuth } from '@/components/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users } from 'lucide-react';
import Link from 'next/link';

export default function MyEventsPage() {
    const { user } = useAuth();

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

    // Mock registered events data
    const registeredEvents = [
        {
            id: 1,
            title: 'Tech Conference 2024',
            date: 'March 15, 2024',
            location: 'San Francisco, CA',
            attendees: 500,
            status: 'upcoming',
        },
        {
            id: 2,
            title: 'Music Festival',
            date: 'April 20, 2024',
            location: 'Austin, TX',
            attendees: 2000,
            status: 'upcoming',
        },
        {
            id: 3,
            title: 'Art Exhibition',
            date: 'February 10, 2024',
            location: 'New York, NY',
            attendees: 150,
            status: 'past',
        },
    ];

    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 py-8">
                <div className="container mx-auto px-4">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold">My Registered Events</h1>
                        <p className="text-muted-foreground">Events you have registered for</p>
                    </div>

                    {registeredEvents.length === 0 ? (
                        <div className="text-center py-12">
                            <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                            <h2 className="text-xl font-semibold mb-2">No events yet</h2>
                            <p className="text-muted-foreground mb-4">Start discovering events and register for ones you love</p>
                            <Button asChild className="bg-[#AC1212] hover:bg-[#8a0f0f]">
                                <Link href="/">Explore Events</Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {registeredEvents.map((event) => (
                                <div
                                    key={event.id}
                                    className="rounded-lg border bg-card p-6 shadow-sm"
                                >
                                    <div className="mb-4">
                                        <span
                                            className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${event.status === 'upcoming'
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                    : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                                                }`}
                                        >
                                            {event.status === 'upcoming' ? 'Upcoming' : 'Past'}
                                        </span>
                                    </div>
                                    <h3 className="mb-2 text-xl font-semibold">{event.title}</h3>
                                    <div className="space-y-2 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            {event.date}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4" />
                                            {event.location}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4" />
                                            {event.attendees} attendees
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
