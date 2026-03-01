'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Event } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Users, Ticket, TrendingUp, Plus, ArrowRight, Clock, MapPin, Activity } from 'lucide-react';
import Link from 'next/link';

// Mock data for demonstration (not connected to backend)
const mockRecentEvents: Partial<Event>[] = [
    {
        id: '1',
        title: 'Tech Conference 2026',
        description: 'Annual technology conference',
        category: 'Technology',
        date: '2026-03-15T09:00:00Z',
        capacity: 500,
        registeredCount: 342,
        location: { address: '123 Tech Blvd', city: 'San Francisco', country: 'USA' },
        status: 'approved',
        isFree: false,
        ticketPrice: 99.99,
    },
    {
        id: '2',
        title: 'Music Festival',
        description: 'Annual music celebration',
        category: 'Music',
        date: '2026-04-20T14:00:00Z',
        capacity: 1000,
        registeredCount: 756,
        location: { address: '456 Park Ave', city: 'New York', country: 'USA' },
        status: 'approved',
        isFree: false,
        ticketPrice: 149.99,
    },
    {
        id: '3',
        title: 'Art Workshop',
        description: 'Hands-on art workshop',
        category: 'Art',
        date: '2026-03-25T10:00:00Z',
        capacity: 50,
        registeredCount: 45,
        location: { address: '789 Art St', city: 'Los Angeles', country: 'USA' },
        status: 'pending',
        isFree: true,
        ticketPrice: 0,
    },
];

const stats = {
    totalEvents: mockRecentEvents.length,
    pendingEvents: mockRecentEvents.filter(e => e.status === 'pending').length,
    approvedEvents: mockRecentEvents.filter(e => e.status === 'approved').length,
    totalAttendees: mockRecentEvents.reduce((sum, e) => sum + (e.registeredCount || 0), 0),
    revenue: mockRecentEvents.reduce((sum, e) => sum + ((e.registeredCount || 0) * (e.ticketPrice || 0)), 0),
};

export default function DashboardOverview() {
    const { user } = useAuth();
    const [events, setEvents] = useState<Partial<Event>[]>(mockRecentEvents);
    const [loading, setLoading] = useState(false);

    const recentEvents = events.slice(0, 3);

    // 30-60-10 Color Scheme
    // Primary: #AC1212 (Red) - 30% - Main actions, highlights
    // Secondary: Grays - 60% - Backgrounds, containers  
    // Accent: #EEB42C (Gold) - 10% - Special highlights

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            approved: 'bg-green-100 text-green-700 border-green-200',
            rejected: 'bg-red-100 text-red-700 border-red-200',
            pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        };
        return styles[status] || styles.pending;
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };

    return (
        <div className="space-y-8">
            {/* Header Section - Visual Hierarchy */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
                    <p className="text-gray-500 mt-1">Welcome back, {user?.displayName || 'Organizer'}! Here's your event overview.</p>
                </div>
                <Link href="/organiser/create">
                    <Button className="bg-[#AC1212] hover:bg-[#8a0f0f] shadow-lg shadow-[#AC1212]/25 font-medium">
                        <Plus className="w-5 h-5 mr-2" />
                        Create Event
                    </Button>
                </Link>
            </div>

            {/* Stats Grid - 30-60-10 Design */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Events Card - Primary Focus */}
                <Card className="border-l-4 border-l-[#AC1212] hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Events</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalEvents}</p>
                                <p className="text-xs text-gray-400 mt-1">Active: {stats.approvedEvents}</p>
                            </div>
                            <div className="w-14 h-14 rounded-xl bg-[#AC1212]/10 flex items-center justify-center">
                                <Calendar className="w-7 h-7 text-[#AC1212]" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Pending Card */}
                <Card className="border-l-4 border-l-yellow-500 hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Pending Approval</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.pendingEvents}</p>
                                <p className="text-xs text-gray-400 mt-1">Awaiting review</p>
                            </div>
                            <div className="w-14 h-14 rounded-xl bg-yellow-50 flex items-center justify-center">
                                <Clock className="w-7 h-7 text-yellow-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Total Attendees Card */}
                <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Attendees</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalAttendees.toLocaleString()}</p>
                                <p className="text-xs text-gray-400 mt-1">Across all events</p>
                            </div>
                            <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center">
                                <Users className="w-7 h-7 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Revenue Card - Accent */}
                <Card className="border-l-4 border-l-[#EEB42C] hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{formatCurrency(stats.revenue)}</p>
                                <p className="text-xs text-gray-400 mt-1">Ticket sales</p>
                            </div>
                            <div className="w-14 h-14 rounded-xl bg-[#EEB42C]/10 flex items-center justify-center">
                                <TrendingUp className="w-7 h-7 text-[#EEB42C]" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs for different sections */}
            <Tabs defaultValue="recent" className="space-y-4">
                <div className="flex items-center justify-between">
                    <TabsList className="bg-gray-100">
                        <TabsTrigger value="recent" className="data-[state=active]:bg-[#AC1212] data-[state=active]:text-white">
                            <Activity className="w-4 h-4 mr-2" />
                            Recent Events
                        </TabsTrigger>
                        <TabsTrigger value="upcoming" className="data-[state=active]:bg-[#AC1212] data-[state=active]:text-white">
                            <Calendar className="w-4 h-4 mr-2" />
                            Upcoming
                        </TabsTrigger>
                    </TabsList>
                    <Link href="/organiser/events" className="text-sm text-[#AC1212] hover:underline flex items-center gap-1 font-medium">
                        View all events <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <TabsContent value="recent" className="space-y-4">
                    <Card>
                        <CardHeader className="border-b pb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl">Recent Events</CardTitle>
                                    <CardDescription>Your latest created events</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-4">
                            {recentEvents.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                                        <Calendar className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No events yet</h3>
                                    <p className="text-gray-500 mb-6">Create your first event to get started</p>
                                    <Link href="/organiser/create">
                                        <Button className="bg-[#AC1212] hover:bg-[#8a0f0f]">
                                            <Plus className="w-5 h-5 mr-2" />
                                            Create Your First Event
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {recentEvents.map((event) => (
                                        <div
                                            key={event.id}
                                            className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50 hover:border-gray-200 transition-all group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#AC1212]/10 to-[#AC1212]/5 flex items-center justify-center group-hover:scale-105 transition-transform">
                                                    <Calendar className="w-6 h-6 text-[#AC1212]" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900 text-lg">{event.title}</h3>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <span className="text-sm text-gray-500 flex items-center gap-1">
                                                            <Clock className="w-3.5 h-3.5" />
                                                            {new Date(event.date!).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        </span>
                                                        <span className="text-sm text-gray-400">•</span>
                                                        <span className="text-sm text-gray-500 flex items-center gap-1">
                                                            <MapPin className="w-3.5 h-3.5" />
                                                            {event.location?.city}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {event.registeredCount}/{event.capacity}
                                                    </p>
                                                    <p className="text-xs text-gray-500">attendees</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {event.isFree ? (
                                                        <Badge variant="secondary" className="bg-green-100 text-green-700">Free</Badge>
                                                    ) : (
                                                        <Badge className="bg-[#EEB42C] text-gray-900">{formatCurrency(event.ticketPrice!)}</Badge>
                                                    )}
                                                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusBadge(event.status!)}`}>
                                                        {event.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="upcoming" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Upcoming Events</CardTitle>
                            <CardDescription>Events scheduled for the future</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-8">
                                <p className="text-gray-500">No upcoming events scheduled</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Quick Actions Section - 10% Accent */}
            <Card className="bg-gradient-to-r from-[#AC1212] to-[#8a0f0f] text-white border-0">
                <CardContent className="pt-6 pb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h3 className="text-xl font-bold">Ready to grow your audience?</h3>
                            <p className="text-white/80 mt-1">Create a new event and start selling tickets today.</p>
                        </div>
                        <Link href="/organiser/create">
                            <Button className="bg-white text-[#AC1212] hover:bg-gray-100 font-semibold">
                                <Plus className="w-5 h-5 mr-2" />
                                Create New Event
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
