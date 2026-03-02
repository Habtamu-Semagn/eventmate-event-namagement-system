'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, Users, Search, Filter } from 'lucide-react';

// Mock events data
const mockEvents = [
    {
        id: 1,
        title: 'Tech Conference 2024',
        description: 'Join us for the biggest tech conference of the year featuring industry leaders and innovators.',
        date: 'March 15, 2024',
        location: 'San Francisco, CA',
        attendees: 500,
        category: 'Technology',
        image: '/file.svg',
    },
    {
        id: 2,
        title: 'Music Festival',
        description: 'Experience three days of live music from top artists around the world.',
        date: 'April 20, 2024',
        location: 'Austin, TX',
        attendees: 2000,
        category: 'Music',
        image: '/file.svg',
    },
    {
        id: 3,
        title: 'Art Exhibition',
        description: 'Explore contemporary art from emerging artists in our annual exhibition.',
        date: 'May 5, 2024',
        location: 'New York, NY',
        attendees: 150,
        category: 'Art',
        image: '/file.svg',
    },
    {
        id: 4,
        title: 'Startup Summit',
        description: 'Network with entrepreneurs and investors at this premier startup event.',
        date: 'May 10, 2024',
        location: 'Seattle, WA',
        attendees: 300,
        category: 'Business',
        image: '/file.svg',
    },
    {
        id: 5,
        title: 'Food & Wine Festival',
        description: 'Sample cuisines from top chefs and wines from around the world.',
        date: 'June 5, 2024',
        location: 'Napa Valley, CA',
        attendees: 400,
        category: 'Food',
        image: '/file.svg',
    },
    {
        id: 6,
        title: 'Sports Championship',
        description: 'Watch the finals of our annual sports championship.',
        date: 'June 15, 2024',
        location: 'Chicago, IL',
        attendees: 1000,
        category: 'Sports',
        image: '/file.svg',
    },
];

const categories = ['All', 'Technology', 'Music', 'Art', 'Business', 'Food', 'Sports'];

export default function EventsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const filteredEvents = mockEvents.filter((event) => {
        const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

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
                            <Filter className="h-4 w-4 text-muted-foreground" />
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

                    {/* Events Grid */}
                    {filteredEvents.length === 0 ? (
                        <div className="text-center py-12">
                            <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                            <h2 className="text-xl font-semibold mb-2">No events found</h2>
                            <p className="text-muted-foreground">Try adjusting your search or filters</p>
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {filteredEvents.map((event) => (
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
                                                {event.date}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4" />
                                                {event.location}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Users className="h-4 w-4" />
                                                {event.attendees} attending
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button className="w-full bg-[#AC1212] hover:bg-[#8a0f0f]">
                                            Register Now
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
