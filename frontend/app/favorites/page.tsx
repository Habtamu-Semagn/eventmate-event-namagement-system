'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MapPin, Heart, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { favoritesApi } from '@/lib/api';

export default function FavoritesPage() {
    const { user } = useAuth();
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchFavorites = async () => {
            if (!user) return;

            try {
                setLoading(true);
                const response = await favoritesApi.getFavorites();
                setEvents(response.data.events || []);
            } catch (err: any) {
                console.error('Failed to fetch favorites:', err);
                setError('Failed to load favorites');
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, [user]);

    if (!user) {
        return (
            <div className="flex min-h-screen flex-col">
                <Navbar />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-4">Please sign in to view your favorites</h2>
                        <Button asChild className="bg-[#AC1212] hover:bg-[#8a0f0f]">
                            <a href="/login">Sign In</a>
                        </Button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

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
                        <h1 className="text-3xl font-bold">Saved Events</h1>
                        <p className="text-muted-foreground">Events you have saved for later</p>
                    </div>

                    {loading && (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#AC1212] mx-auto"></div>
                            <p className="mt-4 text-muted-foreground">Loading your favorites...</p>
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
                            <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                            <h2 className="text-xl font-semibold mb-2">No saved events</h2>
                            <p className="text-muted-foreground mb-4">Save events you are interested in to see them here</p>
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
                                        <div className="mb-4 flex items-center justify-between">
                                            <span className="inline-block rounded-full bg-[#AC1212]/10 px-3 py-1 text-xs font-medium text-[#AC1212]">
                                                {event.category}
                                            </span>
                                            <Heart className="h-5 w-5 fill-current text-red-500" />
                                        </div>
                                        <h3 className="mb-2 text-xl font-semibold">{event.title}</h3>
                                        <div className="space-y-2 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4" />
                                                {formatDate(event.date)}
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
