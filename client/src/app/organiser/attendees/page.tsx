'use client';

import { useState } from 'react';
import { Event } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Users, User, Mail, Clock, Download, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

// Mock data for demonstration (not connected to backend)
const mockEvents: Partial<Event>[] = [
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
    },
];

interface Attendee {
    id: string;
    name: string;
    email: string;
    status: 'confirmed' | 'cancelled' | 'waitlisted';
    registrationDate: string;
    ticketType?: string;
}

const mockAttendees: Record<string, Attendee[]> = {
    '1': [
        { id: '1', name: 'John Smith', email: 'john@example.com', status: 'confirmed', registrationDate: '2026-01-15', ticketType: 'VIP' },
        { id: '2', name: 'Sarah Johnson', email: 'sarah@example.com', status: 'confirmed', registrationDate: '2026-01-16', ticketType: 'Standard' },
        { id: '3', name: 'Mike Davis', email: 'mike@example.com', status: 'confirmed', registrationDate: '2026-01-17', ticketType: 'Standard' },
        { id: '4', name: 'Emily Brown', email: 'emily@example.com', status: 'waitlisted', registrationDate: '2026-01-18' },
        { id: '5', name: 'David Wilson', email: 'david@example.com', status: 'cancelled', registrationDate: '2026-01-10' },
    ],
    '2': [
        { id: '6', name: 'Alex Turner', email: 'alex@example.com', status: 'confirmed', registrationDate: '2026-02-01', ticketType: 'VIP' },
        { id: '7', name: 'Lisa Anderson', email: 'lisa@example.com', status: 'confirmed', registrationDate: '2026-02-02', ticketType: 'Standard' },
        { id: '8', name: 'Chris Martinez', email: 'chris@example.com', status: 'confirmed', registrationDate: '2026-02-03', ticketType: 'Standard' },
    ],
    '3': [
        { id: '9', name: 'Jennifer Lee', email: 'jennifer@example.com', status: 'confirmed', registrationDate: '2026-02-10', ticketType: 'Standard' },
        { id: '10', name: 'Robert Taylor', email: 'robert@example.com', status: 'waitlisted', registrationDate: '2026-02-11' },
    ],
};

export default function AttendeesPage() {
    const [selectedEventId, setSelectedEventId] = useState<string>('1');
    const [searchQuery, setSearchQuery] = useState('');

    const selectedEvent = mockEvents.find(e => e.id === selectedEventId);
    const attendees = mockAttendees[selectedEventId] || [];

    const filteredAttendees = attendees.filter(attendee =>
        attendee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        attendee.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusBadge = (status: string) => {
        const styles: Record<string, { bg: string; text: string; icon: any }> = {
            confirmed: { bg: 'bg-green-100 text-green-700 border-green-200', text: 'Confirmed', icon: CheckCircle },
            cancelled: { bg: 'bg-red-100 text-red-700 border-red-200', text: 'Cancelled', icon: XCircle },
            waitlisted: { bg: 'bg-yellow-100 text-yellow-700 border-yellow-200', text: 'Waitlisted', icon: AlertCircle },
        };
        const style = styles[status] || styles.waitlisted;
        const Icon = style.icon;
        return (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${style.bg}`}>
                <Icon className="w-3.5 h-3.5" />
                {style.text}
            </span>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Attendees</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">View and manage attendees for your events</p>
                </div>

                {/* Event Selector and Export Button */}
                <div className="flex items-center gap-3">
                    <Select value={selectedEventId} onValueChange={setSelectedEventId}>
                        <SelectTrigger className="w-[250px] border-gray-200 focus:border-[#AC1212] focus:ring-[#AC1212]">
                            <SelectValue placeholder="Select an event" />
                        </SelectTrigger>
                        <SelectContent>
                            {mockEvents.map(event => (
                                <SelectItem key={event.id} value={event.id!}>
                                    {event.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button className="bg-[#AC1212] hover:bg-[#8a0f0f] text-white">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Registered Attendees Heading */}
            <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Registered Attendees</h2>

                {/* Search */}
                <div className="mb-4">
                    <div className="relative max-w-md">
                        <Input
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 border-gray-200"
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">🔍</span>
                    </div>
                </div>

                {/* Table */}
                <Card className="border-gray-200 dark:border-gray-700 shadow-sm">
                    <Table>
                        <TableHeader className="bg-gray-50 dark:bg-gray-800">
                            <TableRow>
                                <TableHead className="font-semibold">Attendee</TableHead>
                                <TableHead className="font-semibold">Email</TableHead>
                                <TableHead className="font-semibold">Ticket Type</TableHead>
                                <TableHead className="font-semibold">Registration Date</TableHead>
                                <TableHead className="font-semibold">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredAttendees.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-12">
                                        <div className="flex flex-col items-center">
                                            <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
                                            <p className="text-gray-500 dark:text-gray-400">
                                                {searchQuery ? 'No attendees match your search' : 'No attendees found'}
                                            </p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredAttendees.map((attendee) => (
                                    <TableRow key={attendee.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-[#AC1212]/10 flex items-center justify-center">
                                                    <User className="w-5 h-5 text-[#AC1212]" />
                                                </div>
                                                <span className="font-medium text-gray-900 dark:text-white">{attendee.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                                <Mail className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                                {attendee.email}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {attendee.ticketType ? (
                                                <Badge variant="outline" className="border-gray-200 dark:border-gray-700">
                                                    {attendee.ticketType}
                                                </Badge>
                                            ) : (
                                                <span className="text-gray-400 dark:text-gray-500">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                                <Clock className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                                {new Date(attendee.registrationDate).toLocaleDateString()}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(attendee.status)}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </Card>
            </div>
        </div>
    );
}
