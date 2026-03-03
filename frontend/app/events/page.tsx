'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, Users, Search, Heart, Loader2 } from 'lucide-react';
import { eventsApi, registrationsApi, Event } from '@/lib/api';
import { useAuth } from '@/components/AuthContext';

const categories = ['All', 'Technology', 'Music', 'Art', 'Business', 'Food', 'Sports'];

export default function EventsPage() {
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [registeringEventId, setRegisteringEventId] = useState<number | null>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                const response = await eventsApi.getAll({
                    category: selectedCategory !== 'All' ? selectedCategory : undefined,
                    search: searchQuery || undefined,
                });
                setEvents(response.data.events);
            } catch (err: any) {
                console.error('Failed to fetch events:', err);
                setError('Failed to load events');
            } finally {
                setLoading(false);
            }
        };

        // Debounce search
        const timeoutId = setTimeout(() => {
            fetchEvents();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [selectedCategory, searchQuery]);

    const handleRegister = async (eventId: number) => {
        if (!user) {
            window.location.href = '/login';
            return;
        }

        try {
            setRegisteringEventId(eventId);
            await registrationsApi.register(eventId);
            alert('Successfully registered for the event!');
        } catch (err: any) {
            alert(err.message || 'Failed to register for event');
        } finally {
            setRegisteringEventId(null);
        }
    };

    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 py-8">
                <div className="container mx-auto px-4">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold mb-2">Discover Events</h1>
                        <p className="text-muted-foreground">Find events that match your interests</p>
                    </div>

                    {/* Search and Filter */}
                    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search events..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex gap-2 flex-wrap">
                                {categories.map((category) => (
                                    <Button
                                        key={category}
                                        variant={selectedCategory === category ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setSelectedCategory(category)}
                                        className={selectedCategory === category ? 'bg-[#AC1212] hover:bg-[#8a0f0f]' : ''}
                                    >
                                        {category}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#AC1212] mx-auto"></div>
                            <p className="mt-4 text-muted-foreground">Loading events...</p>
                        </div>
                    )}

                    {/* Error State */}
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

                    {/* Events Grid */}
                    {!loading && !error && events.length === 0 && (
                        <div className="text-center py-12">
                            <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                            <h2 className="text-xl font-semibold mb-2">No events found</h2>
                            <p className="text-muted-foreground">Try adjusting your search or filters</p>
                        </div>
                    )}

                    {!loading && !error && events.length > 0 && (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {events.map((event) => (
                                <Card key={event.id} className="overflow-hidden">
                                    <div className="aspect-video bg-muted flex items-center justify-center">
                                        <Calendar className="h-12 w-12 text-muted-foreground" />
                                    </div>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-medium text-[#AC1212]">
                                                {event.category}
                                            </span>
                                        </div>
                                        <CardTitle className="line-clamp-1">{event.title}</CardTitle>
                                        <CardDescription className="line-clamp-2">
                                            {event.description}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4" />
                                                {new Date(event.date).toLocaleDateString()} at {event.time}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4" />
                                                {event.location_venue || event.location || 'Location TBD'}
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button
                                            className="w-full bg-[#AC1212] hover:bg-[#8a0f0f]"
                                            onClick={() => handleRegister(event.id)}
                                            disabled={registeringEventId === event.id}
                                        >
                                            {registeringEventId === event.id ? (
                                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registering...</>
                                            ) : (
                                                'Register Now'
                                            )}
                                        </Button>
                                    </CardFooter>
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
