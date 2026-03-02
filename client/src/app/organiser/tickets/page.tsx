'use client';

import { useState } from 'react';
import { Event } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import {
    Ticket,
    DollarSign,
    Users,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    Search,
    Download,
    Plus,
    CreditCard,
    RefreshCw,
    CheckCircle,
    Clock,
    XCircle,
    AlertCircle,
    Filter
} from 'lucide-react';

// Mock data for demonstration (not connected to backend)
const mockEvents: Partial<Event>[] = [
    {
        id: '1',
        title: 'Tech Conference 2026',
        category: 'Technology',
        date: '2026-03-15T09:00:00Z',
        capacity: 500,
        registeredCount: 342,
        isFree: false,
        ticketPrice: 99.99,
    },
    {
        id: '2',
        title: 'Music Festival',
        category: 'Music',
        date: '2026-04-20T14:00:00Z',
        capacity: 1000,
        registeredCount: 756,
        isFree: false,
        ticketPrice: 149.99,
    },
    {
        id: '3',
        title: 'Art Workshop',
        category: 'Art',
        date: '2026-03-25T10:00:00Z',
        capacity: 50,
        registeredCount: 45,
        isFree: true,
        ticketPrice: 0,
    },
];

interface TicketSale {
    id: string;
    eventId: string;
    eventTitle: string;
    buyerName: string;
    buyerEmail: string;
    ticketType: string;
    quantity: number;
    amount: number;
    status: 'completed' | 'pending' | 'refunded' | 'failed';
    purchaseDate: string;
}

const mockTicketSales: TicketSale[] = [
    { id: '1', eventId: '1', eventTitle: 'Tech Conference 2026', buyerName: 'John Smith', buyerEmail: 'john@example.com', ticketType: 'VIP', quantity: 2, amount: 199.98, status: 'completed', purchaseDate: '2026-01-15' },
    { id: '2', eventId: '1', eventTitle: 'Tech Conference 2026', buyerName: 'Sarah Johnson', buyerEmail: 'sarah@example.com', ticketType: 'Standard', quantity: 1, amount: 99.99, status: 'completed', purchaseDate: '2026-01-16' },
    { id: '3', eventId: '2', eventTitle: 'Music Festival', buyerName: 'Mike Davis', buyerEmail: 'mike@example.com', ticketType: 'VIP', quantity: 4, amount: 599.96, status: 'completed', purchaseDate: '2026-01-17' },
    { id: '4', eventId: '2', eventTitle: 'Music Festival', buyerName: 'Emily Brown', buyerEmail: 'emily@example.com', ticketType: 'Standard', quantity: 2, amount: 299.98, status: 'pending', purchaseDate: '2026-01-18' },
    { id: '5', eventId: '1', eventTitle: 'Tech Conference 2026', buyerName: 'David Wilson', buyerEmail: 'david@example.com', ticketType: 'Standard', quantity: 1, amount: 99.99, status: 'refunded', purchaseDate: '2026-01-10' },
    { id: '6', eventId: '2', eventTitle: 'Music Festival', buyerName: 'Lisa Anderson', buyerEmail: 'lisa@example.com', ticketType: 'VIP', quantity: 1, amount: 149.99, status: 'completed', purchaseDate: '2026-01-19' },
    { id: '7', eventId: '1', eventTitle: 'Tech Conference 2026', buyerName: 'Chris Martinez', buyerEmail: 'chris@example.com', ticketType: 'Standard', quantity: 3, amount: 299.97, status: 'failed', purchaseDate: '2026-01-20' },
];

// Calculate stats
const totalRevenue = mockTicketSales.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.amount, 0);
const pendingAmount = mockTicketSales.filter(t => t.status === 'pending').reduce((sum, t) => sum + t.amount, 0);
const refundedAmount = mockTicketSales.filter(t => t.status === 'refunded').reduce((sum, t) => sum + t.amount, 0);
const totalTicketsSold = mockTicketSales.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.quantity, 0);

export default function TicketsPage() {
    const [selectedEventId, setSelectedEventId] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredSales = mockTicketSales.filter(sale => {
        const matchesEvent = selectedEventId === 'all' || sale.eventId === selectedEventId;
        const matchesStatus = statusFilter === 'all' || sale.status === statusFilter;
        const matchesSearch = sale.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            sale.buyerEmail.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesEvent && matchesStatus && matchesSearch;
    });

    const getStatusBadge = (status: string) => {
        const styles: Record<string, { bg: string; text: string; icon: any }> = {
            completed: { bg: 'bg-green-100 text-green-700 border-green-200', text: 'Completed', icon: CheckCircle },
            pending: { bg: 'bg-yellow-100 text-yellow-700 border-yellow-200', text: 'Pending', icon: Clock },
            refunded: { bg: 'bg-blue-100 text-blue-700 border-blue-200', text: 'Refunded', icon: RefreshCw },
            failed: { bg: 'bg-red-100 text-red-700 border-red-200', text: 'Failed', icon: XCircle },
        };
        const style = styles[status] || styles.pending;
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
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Tickets</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage tickets and track sales</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="border-gray-200 hover:bg-gray-50">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-l-4 border-l-green-500 hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Revenue</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">${totalRevenue.toLocaleString()}</p>
                                <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1 mt-1">
                                    <ArrowUpRight className="w-3 h-3" />
                                    +12.5% from last month
                                </p>
                            </div>
                            <div className="w-14 h-14 rounded-xl bg-green-50 flex items-center justify-center">
                                <DollarSign className="w-7 h-7 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-yellow-500 hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">${pendingAmount.toLocaleString()}</p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Awaiting payment</p>
                            </div>
                            <div className="w-14 h-14 rounded-xl bg-yellow-50 flex items-center justify-center">
                                <Clock className="w-7 h-7 text-yellow-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tickets Sold</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{totalTicketsSold}</p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">This period</p>
                            </div>
                            <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center">
                                <Ticket className="w-7 h-7 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>


            </div>

            {/* Tabs */}
            <Tabs defaultValue="sales" className="space-y-4">
                <TabsList className="dark:bg-slate-700">
                    <TabsTrigger value="sales" className="data-[state=active]:bg-[#AC1212] data-[state=active]:text-white">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Sales
                    </TabsTrigger>
                    <TabsTrigger value="events" className="data-[state=active]:bg-[#AC1212] data-[state=active]:text-white">
                        <Calendar className="w-4 h-4 mr-2" />
                        Events
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="sales" className="space-y-4">
                    <Card className="border-gray-200 shadow-sm">
                        <CardHeader className="border-b">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div>
                                    <CardTitle className="text-xl">Ticket Sales</CardTitle>
                                    <CardDescription>{filteredSales.length} transactions</CardDescription>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                                        <Input
                                            placeholder="Search..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-9 w-full sm:w-[200px] border-gray-200"
                                        />
                                    </div>
                                    <Select value={selectedEventId} onValueChange={setSelectedEventId}>
                                        <SelectTrigger className="w-full sm:w-[180px] border-gray-200">
                                            <SelectValue placeholder="All Events" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Events</SelectItem>
                                            {mockEvents.map(event => (
                                                <SelectItem key={event.id} value={event.id!}>{event.title}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                                        <SelectTrigger className="w-full sm:w-[150px] border-gray-200">
                                            <SelectValue placeholder="Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Status</SelectItem>
                                            <SelectItem value="completed">Completed</SelectItem>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="refunded">Refunded</SelectItem>
                                            <SelectItem value="failed">Failed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {filteredSales.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                        <Ticket className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No sales found</h3>
                                    <p className="text-gray-500 dark:text-gray-400">Try adjusting your filters</p>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader className="bg-gray-50 dark:bg-gray-800">
                                        <TableRow>
                                            <TableHead className="font-semibold">Event</TableHead>
                                            <TableHead className="font-semibold">Buyer</TableHead>
                                            <TableHead className="font-semibold">Ticket Type</TableHead>
                                            <TableHead className="font-semibold">Qty</TableHead>
                                            <TableHead className="font-semibold">Amount</TableHead>
                                            <TableHead className="font-semibold">Date</TableHead>
                                            <TableHead className="font-semibold">Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredSales.map((sale) => (
                                            <TableRow key={sale.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                                                <TableCell>
                                                    <span className="font-medium text-gray-900 dark:text-white">{sale.eventTitle}</span>
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-white">{sale.buyerName}</p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">{sale.buyerEmail}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="border-gray-200 dark:border-gray-700">
                                                        {sale.ticketType}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-gray-900 dark:text-white">{sale.quantity}</span>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="font-semibold text-gray-900 dark:text-white">${sale.amount.toFixed(2)}</span>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-gray-600 dark:text-gray-300">{sale.purchaseDate}</span>
                                                </TableCell>
                                                <TableCell>
                                                    {getStatusBadge(sale.status)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="events" className="space-y-4">
                    <Card className="border-gray-200 dark:border-gray-700 shadow-sm">
                        <CardHeader className="border-b dark:border-gray-700">
                            <CardTitle className="text-xl">Event Tickets</CardTitle>
                            <CardDescription>Manage ticket types for your events</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {mockEvents.filter(e => !e.isFree).map((event) => (
                                    <div key={event.id} className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-[#AC1212]/10 flex items-center justify-center">
                                                <Ticket className="w-6 h-6 text-[#AC1212]" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900 dark:text-white">{event.title}</h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">${event.ticketPrice} per ticket</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="font-semibold text-gray-900 dark:text-white">{event.registeredCount}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">sold</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-green-600 dark:text-green-400">${((event.registeredCount || 0) * (event.ticketPrice || 0)).toLocaleString()}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">revenue</p>
                                            </div>
                                            <Button variant="outline" size="sm" className="border-gray-200 dark:border-gray-700">
                                                Edit
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div >
    );
}
