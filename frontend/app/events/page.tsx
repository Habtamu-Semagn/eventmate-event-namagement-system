'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, Users, Search, Heart, Loader2 } from 'lucide-react';
import { eventsApi, registrationsApi, favoritesApi, Event, API_BASE_URL } from '@/lib/api';
import { useAuth } from '@/components/AuthContext';
import { useSearchParams } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';

const categories = ['All', 'Technology', 'Music', 'Art', 'Business', 'Food', 'Sports'];

function EventsList() {
    const { user } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const searchParams = useSearchParams();
    const initialSearch = searchParams.get('search') || '';
    const [searchQuery, setSearchQuery] = useState(initialSearch);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [registeringEventId, setRegisteringEventId] = useState<number | null>(null);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, totalPages: 0 });
    const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
    const [togglingFavorite, setTogglingFavorite] = useState<number | null>(null);

    // Redirect to login when user logs out
    useEffect(() => {
        if (!user) {
            router.push('/login');
        }
    }, [user, router]);

    // Update search query when URL param changes
    useEffect(() => {
        const query = searchParams.get('search');
        if (query !== null) {
            setSearchQuery(query);
        }
    }, [searchParams]);

    // Fetch favorites when user is available
    useEffect(() => {
        const fetchFavorites = async () => {
            if (!user) {
                setFavoriteIds([]);
                return;
            }
            try {
                const response = await favoritesApi.getMyFavorites();
                const favIds = (response.data.favorites || []).map((fav: any) => fav.event_id);
                setFavoriteIds(favIds);
            } catch (err) {
                console.error('Failed to fetch favorites:', err);
            }
        };
        fetchFavorites();
    }, [user]);

    const handleToggleFavorite = async (eventId: number) => {
        if (!user) {
            router.push('/login');
            return;
        }

        const isFavorite = favoriteIds.includes(eventId);
        setTogglingFavorite(eventId);

        try {
            if (isFavorite) {
                await favoritesApi.removeFavorite(eventId);
                setFavoriteIds(prev => prev.filter(id => id !== eventId));
                toast({ title: "Removed from favorites" });
            } else {
                await favoritesApi.addFavorite(eventId);
                setFavoriteIds(prev => [...prev, eventId]);
                toast({ title: "Added to favorites" });
            }
        } catch (err: any) {
            toast({ title: "Error", description: err.message || "Failed to update favorite", variant: "destructive" });
        } finally {
            setTogglingFavorite(null);
        }
    };

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                const response = await eventsApi.getAll({
                    category: selectedCategory !== 'All' ? selectedCategory : undefined,
                    search: searchQuery || undefined,
                    page: page,
                    limit: 12,
                });
                setEvents(response.data.events);
                if (response.data.pagination) {
                    setPagination(response.data.pagination);
                }
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
    }, [selectedCategory, searchQuery, page]);

    const handleRegister = async (eventId: number) => {
        if (!user) {
            window.location.href = '/login';
            return;
        }

        try {
            setRegisteringEventId(eventId);
            await registrationsApi.register(eventId);
            toast({
                title: "Registration Successful",
                description: "You have successfully registered for the event!",
                variant: "success",
            });
        } catch (err: any) {
            toast({
                title: "Registration Failed",
                description: err.message || "Failed to register for event",
                variant: "destructive",
            });
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
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {events.map((event) => (
                                <Card key={event.id} className="group overflow-hidden border-none shadow-none bg-zinc-50/50 dark:bg-zinc-900/30 hover:bg-zinc-100 dark:hover:bg-zinc-900/50 transition-colors">
                                    <div className="aspect-[4/3] relative bg-muted flex items-center justify-center overflow-hidden rounded-2xl mb-3">
                                        {event.image_url ? (
                                            <img
                                                src={`${API_BASE_URL}${event.image_url}`}
                                                alt={event.title}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        ) : (
                                            <Calendar className="h-10 w-10 text-muted-foreground/30" />
                                        )}
                                        <div className="absolute top-2.5 left-2.5">
                                            <span className="bg-white/95 dark:bg-black/80 backdrop-blur-md text-[10px] font-black px-2.5 py-1 rounded-full text-black dark:text-white border border-zinc-200/50 dark:border-white/10 uppercase tracking-wider shadow-sm">
                                                {event.category}
                                            </span>
                                        </div>
                                        <button
                                            className={`absolute top-2.5 right-2.5 h-8 w-8 flex items-center justify-center bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm rounded-full shadow-sm border border-zinc-200 dark:border-zinc-800 transition-colors ${favoriteIds.includes(event.id) ? 'text-red-500' : 'text-zinc-400 hover:text-red-500'
                                                }`}
                                            onClick={() => handleToggleFavorite(event.id)}
                                            disabled={togglingFavorite === event.id}
                                        >
                                            {togglingFavorite === event.id ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Heart className={`h-4 w-4 ${favoriteIds.includes(event.id) ? 'fill-current' : ''}`} />
                                            )}
                                        </button>
                                    </div>
                                    <div className="px-1.5 pb-2">
                                        <div className="cursor-pointer" onClick={() => router.push(`/events/${event.id}`)}>
                                            <h3 className="text-base font-bold line-clamp-1 mb-1 group-hover:text-[#AC1212] transition-colors">{event.title}</h3>
                                            <div className="flex flex-col gap-1 text-[11px] font-medium text-muted-foreground">
                                                <div className="flex items-center gap-1.5 text-zinc-900 dark:text-zinc-100">
                                                    <Calendar className="h-3.5 w-3.5 text-[#AC1212]" />
                                                    <span>{new Date(event.date).toLocaleDateString()} • {event.time}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 opacity-70">
                                                    <MapPin className="h-3.5 w-3.5" />
                                                    <span className="line-clamp-1">{event.location_venue || 'Location TBD'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            className="w-full mt-3 h-8 text-[11px] font-bold bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 hover:bg-[#AC1212] hover:text-white hover:border-[#AC1212] dark:hover:bg-[#AC1212] dark:hover:border-[#AC1212] transition-all rounded-lg"
                                            onClick={() => router.push(`/events/${event.id}`)}
                                        >
                                            {event.is_paid ? 'Buy Tickets' : 'Register'}
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-8">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={pagination.page <= 1}
                            >
                                Previous
                            </Button>
                            <span className="text-sm">
                                Page {pagination.page} of {pagination.totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                                disabled={pagination.page >= pagination.totalPages}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default function EventsPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen flex-col">
                <Navbar />
                <main className="flex-1 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-[#AC1212]" />
                </main>
                <Footer />
            </div>
        }>
            <EventsList />
        </Suspense>
    );
}
