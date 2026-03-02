'use client';

import { useState } from 'react';
import { Event } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Calendar, Users, Edit, Trash2, Eye, Plus, MapPin, Search, Filter, MoreHorizontal, DollarSign } from 'lucide-react';
import Link from 'next/link';

// Mock data for demonstration (not connected to backend)
const mockEvents: Partial<Event>[] = [
    {
        id: '1',
        title: 'Tech Conference 2026',
        description: 'Annual technology conference featuring industry leaders',
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
    {
        id: '4',
        title: 'Business Summit',
        description: 'Annual business networking event',
        category: 'Business',
        date: '2026-05-10T09:00:00Z',
        capacity: 200,
        registeredCount: 180,
        location: { address: '321 Business Ave', city: 'Chicago', country: 'USA' },
        status: 'approved',
        isFree: false,
        ticketPrice: 299.99,
    },
    {
        id: '5',
        title: 'Sports Day',
        description: 'Community sports event',
        category: 'Sports',
        date: '2026-06-01T08:00:00Z',
        capacity: 300,
        registeredCount: 0,
        location: { address: '555 Stadium Rd', city: 'Boston', country: 'USA' },
        status: 'rejected',
        isFree: true,
        ticketPrice: 0,
    },
];

const categories = ['All', 'Technology', 'Music', 'Art', 'Business', 'Sports', 'Cultural', 'Educational'];

export default function DashboardEvents() {
    const [events, setEvents] = useState<Partial<Event>[]>(mockEvents);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [statusFilter, setStatusFilter] = useState('all');
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const handleDelete = async (eventId: string) => {
        if (!confirm('Are you sure you want to delete this event?')) return;
        setDeleteId(eventId);
        // Simulate deletion
        setTimeout(() => {
            setEvents(events.filter(e => e.id !== eventId));
            setDeleteId(null);
        }, 500);
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            approved: 'bg-green-100 text-green-700 border-green-200',
            rejected: 'bg-red-100 text-red-700 border-red-200',
            pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        };
        return styles[status] || styles.pending;
    };

    const getTicketingInfo = (event: Partial<Event>) => {
        if (event.isFree) {
            return <span className="text-green-600 font-medium">Free</span>;
        }
        return <span className="text-[#AC1212] font-semibold">${event.ticketPrice?.toFixed(2)}</span>;
    };

    const filteredEvents = events.filter(event => {
        const matchesSearch = event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.category?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
        const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
        return matchesSearch && matchesCategory && matchesStatus;
    });

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">My Events</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and monitor your events</p>
                </div>
                <Link href="/dashboard/create">
                    <Button className="bg-[#AC1212] hover:bg-[#8a0f0f] shadow-lg shadow-[#AC1212]/25 font-medium text-white">
                        <Plus className="w-5 h-5 mr-2" />
                        Create Event
                    </Button>
                </Link>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                            <Input
                                placeholder="Search events..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger className="w-full md:w-[180px]">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map(cat => (
                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full md:w-[180px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Events Table */}
            <Card>
                <CardHeader className="border-b pb-4">
                    <CardTitle className="text-xl">All Events</CardTitle>
                    <CardDescription>{filteredEvents.length} events found</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    {filteredEvents.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                <Calendar className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No events found</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">
                                {searchQuery || selectedCategory !== 'All' || statusFilter !== 'all'
                                    ? 'Try adjusting your filters'
                                    : 'Create your first event to get started'}
                            </p>
                            {searchQuery || selectedCategory !== 'All' || statusFilter !== 'all' ? (
                                <Button variant="outline" onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setStatusFilter('all') }}>
                                    Clear Filters
                                </Button>
                            ) : (
                                <Link href="/dashboard/create">
                                    <Button className="bg-[#AC1212] hover:bg-[#8a0f0f]">
                                        <Plus className="w-5 h-5 mr-2" />
                                        Create Event
                                    </Button>
                                </Link>
                            )}
                        </div>
                    ) : (
                        <Table>
                            <TableHeader className="bg-gray-50 dark:bg-gray-800">
                                <TableRow>
                                    <TableHead className="font-semibold">Event</TableHead>
                                    <TableHead className="font-semibold">Date</TableHead>
                                    <TableHead className="font-semibold">Location</TableHead>
                                    <TableHead className="font-semibold">Capacity</TableHead>
                                    <TableHead className="font-semibold">Pricing</TableHead>
                                    <TableHead className="font-semibold">Status</TableHead>
                                    <TableHead className="text-right font-semibold">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredEvents.map((event) => (
                                    <TableRow key={event.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-gray-900 dark:text-white">{event.title}</span>
                                                <span className="text-sm text-gray-500 dark:text-gray-400">{event.category}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                                <Calendar className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                                {formatDate(event.date)}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                                <MapPin className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                                {event.location?.city}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                                <Users className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                                {event.registeredCount || 0} / {event.capacity}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {getTicketingInfo(event)}
                                        </TableCell>
                                        <TableCell>
                                            <span className={`px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusBadge(event.status!)}`}>
                                                {event.status}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-end gap-1">
                                                <Link href={`/dashboard/attendees?event=${event.id}`}>
                                                    <Button variant="ghost" size="icon" title="View Attendees" className="hover:bg-gray-100 dark:hover:bg-gray-800">
                                                        <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                                    </Button>
                                                </Link>
                                                <Button variant="ghost" size="icon" title="Edit" className="hover:bg-gray-100 dark:hover:bg-gray-800">
                                                    <Edit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    title="Delete"
                                                    onClick={() => handleDelete(event.id!)}
                                                    disabled={deleteId === event.id}
                                                    className="hover:bg-red-50 dark:hover:bg-red-900/20"
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-500 dark:text-red-400" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-[#AC1212]/5 to-transparent dark:from-[#AC1212]/10">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-[#AC1212] dark:text-red-400">{events.length}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total Events</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-green-50 to-transparent dark:from-green-900/20 dark:to-transparent">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{events.filter(e => e.status === 'approved').length}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Approved</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-yellow-50 to-transparent dark:from-yellow-900/20 dark:to-transparent">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{events.filter(e => e.status === 'pending').length}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-[#EEB42C]/10 to-transparent dark:from-yellow-600/20">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-[#EEB42C] dark:text-yellow-400">
                                ${events.reduce((sum, e) => sum + ((e.registeredCount || 0) * (e.ticketPrice || 0)), 0).toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
