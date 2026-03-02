'use client';

import { useState } from 'react';
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
import {
    Calendar,
    Search,
    MapPin,
    Users,
    CheckCircle,
    XCircle,
    Clock,
    Eye,
    Edit,
    Trash2,
    Filter,
    AlertCircle
} from 'lucide-react';

// Mock events data
const mockEvents = [
    { id: '1', title: 'Tech Conference 2026', organizer: 'John Doe', category: 'Technology', date: '2026-03-15', location: 'San Francisco', capacity: 500, registered: 342, status: 'pending' },
    { id: '2', title: 'Music Festival', organizer: 'Jane Smith', category: 'Music', date: '2026-04-20', location: 'New York', capacity: 1000, registered: 756, status: 'approved' },
    { id: '3', title: 'Art Workshop', organizer: 'Bob Wilson', category: 'Art', date: '2026-03-25', location: 'Los Angeles', capacity: 50, registered: 45, status: 'pending' },
    { id: '4', title: 'Business Summit', organizer: 'Alice Brown', category: 'Business', date: '2026-05-10', location: 'Chicago', capacity: 200, registered: 180, status: 'rejected' },
    { id: '5', title: 'Sports Day', organizer: 'Charlie Davis', category: 'Sports', date: '2026-06-01', location: 'Boston', capacity: 300, registered: 0, status: 'pending' },
    { id: '6', title: 'Health Expo', organizer: 'Diana Evans', category: 'Health', date: '2026-06-15', location: 'Seattle', capacity: 400, registered: 234, status: 'approved' },
    { id: '7', title: 'Education Fair', organizer: 'Frank Garcia', category: 'Education', date: '2026-07-01', location: 'Denver', capacity: 350, registered: 0, status: 'draft' },
];

export default function AdminEventsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');

    const filteredEvents = mockEvents.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.organizer.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
        const matchesCategory = categoryFilter === 'all' || event.category === categoryFilter;
        return matchesSearch && matchesStatus && matchesCategory;
    });

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            approved: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
            pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
            rejected: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
            draft: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
        };
        return styles[status] || styles.draft;
    };

    const getStatusIcon = (status: string) => {
        const icons: Record<string, any> = {
            approved: CheckCircle,
            pending: Clock,
            rejected: XCircle,
            draft: AlertCircle,
        };
        return icons[status] || Clock;
    };

    const pendingCount = mockEvents.filter(e => e.status === 'pending').length;
    const approvedCount = mockEvents.filter(e => e.status === 'approved').length;
    const rejectedCount = mockEvents.filter(e => e.status === 'rejected').length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Event Management</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Approve, manage, and moderate events</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Events</p>
                                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{mockEvents.length}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Pending Review</p>
                                <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">{pendingCount}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-yellow-50 dark:bg-yellow-900/30 flex items-center justify-center">
                                <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Approved</p>
                                <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">{approvedCount}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Rejected</p>
                                <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-1">{rejectedCount}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-900/30 flex items-center justify-center">
                                <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card className="border-slate-200 dark:border-slate-700 shadow-sm">
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                            <Input
                                placeholder="Search events..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full md:w-[150px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-full md:w-[150px]">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                <SelectItem value="Technology">Technology</SelectItem>
                                <SelectItem value="Music">Music</SelectItem>
                                <SelectItem value="Art">Art</SelectItem>
                                <SelectItem value="Business">Business</SelectItem>
                                <SelectItem value="Sports">Sports</SelectItem>
                                <SelectItem value="Health">Health</SelectItem>
                                <SelectItem value="Education">Education</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Events Table */}
            <Card className="border-slate-200 dark:border-slate-700 shadow-sm">
                <CardHeader className="border-b dark:border-slate-700">
                    <CardTitle className="text-xl">All Events</CardTitle>
                    <CardDescription>{filteredEvents.length} events found</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-slate-50 dark:bg-slate-800">
                            <TableRow>
                                <TableHead className="font-semibold">Event</TableHead>
                                <TableHead className="font-semibold">Organizer</TableHead>
                                <TableHead className="font-semibold">Category</TableHead>
                                <TableHead className="font-semibold">Date</TableHead>
                                <TableHead className="font-semibold">Location</TableHead>
                                <TableHead className="font-semibold">Capacity</TableHead>
                                <TableHead className="font-semibold">Status</TableHead>
                                <TableHead className="font-semibold text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredEvents.map((event) => {
                                const StatusIcon = getStatusIcon(event.status);
                                return (
                                    <TableRow key={event.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                                        <TableCell>
                                            <span className="font-medium text-slate-900 dark:text-white">{event.title}</span>
                                        </TableCell>
                                        <TableCell className="text-slate-600 dark:text-slate-300">{event.organizer}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                                                {event.category}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-slate-600 dark:text-slate-300">{event.date}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                                                <MapPin className="w-4 h-4" />
                                                {event.location}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                                                <Users className="w-4 h-4" />
                                                {event.registered}/{event.capacity}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={getStatusBadge(event.status)}>
                                                <StatusIcon className="w-3 h-3 mr-1" />
                                                {event.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-end gap-1">
                                                <Button variant="ghost" size="icon" className="hover:bg-slate-100 dark:hover:bg-slate-800">
                                                    <Eye className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="hover:bg-slate-100 dark:hover:bg-slate-800">
                                                    <Edit className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                                </Button>
                                                {event.status === 'pending' && (
                                                    <>
                                                        <Button variant="ghost" size="icon" className="hover:bg-green-50 dark:hover:bg-green-900/20">
                                                            <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="hover:bg-red-50 dark:hover:bg-red-900/20">
                                                            <XCircle className="w-4 h-4 text-red-500 dark:text-red-400" />
                                                        </Button>
                                                    </>
                                                )}
                                                <Button variant="ghost" size="icon" className="hover:bg-red-50 dark:hover:bg-red-900/20">
                                                    <Trash2 className="w-4 h-4 text-red-500 dark:text-red-400" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
