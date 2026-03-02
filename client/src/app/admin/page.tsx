'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
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
    Users,
    Calendar,
    FileText,
    Activity,
    TrendingUp,
    TrendingDown,
    AlertCircle,
    CheckCircle,
    Clock,
    Search,
    ArrowUpRight,
    ArrowDownRight,
    Eye,
    Ban,
    Shield,
    Database,
    Server,
    HardDrive,
    Wifi
} from 'lucide-react';

// Mock data
const stats = {
    totalUsers: 12453,
    activeUsers: 8234,
    totalEvents: 456,
    pendingEvents: 23,
    totalContent: 1247,
    systemUptime: 99.98,
};

const recentActivity = [
    { id: 1, action: 'New user registered', user: 'john.doe@email.com', time: '2 min ago', type: 'user' },
    { id: 2, action: 'Event submitted for review', user: 'Tech Conference 2026', time: '15 min ago', type: 'event' },
    { id: 3, action: 'Content flagged', user: 'Inappropriate content', time: '1 hour ago', type: 'content' },
    { id: 4, action: 'User banned', user: 'spamuser@email.com', time: '2 hours ago', type: 'user' },
    { id: 5, action: 'Event approved', user: 'Music Festival', time: '3 hours ago', type: 'event' },
];

const pendingApprovals = [
    { id: '1', title: 'Tech Conference 2026', organizer: 'John Doe', date: '2026-03-15', type: 'event' },
    { id: '2', title: 'Art Workshop', organizer: 'Jane Smith', date: '2026-03-20', type: 'event' },
    { id: '3', title: 'Business Summit', organizer: 'Bob Wilson', date: '2026-04-01', type: 'event' },
];

const systemStatus = [
    { service: 'API Server', status: 'healthy', uptime: '99.98%', responseTime: '45ms' },
    { service: 'Database', status: 'healthy', uptime: '99.99%', responseTime: '12ms' },
    { service: 'Storage', status: 'healthy', uptime: '99.95%', responseTime: '8ms' },
    { service: 'Authentication', status: 'healthy', uptime: '99.99%', responseTime: '23ms' },
];

export default function AdminDashboard() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Admin Dashboard</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Monitor and manage your platform</p>
                </div>
            </div>

            {/* Stats Grid - 30-60-10 Design */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Users</p>
                                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{stats.totalUsers.toLocaleString()}</p>
                                <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1 mt-1">
                                    <ArrowUpRight className="w-3 h-3" />
                                    +12.5% this month
                                </p>
                            </div>
                            <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                <Users className="w-7 h-7 text-slate-700 dark:text-slate-300" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Users</p>
                                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{stats.activeUsers.toLocaleString()}</p>
                                <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1 mt-1">
                                    <ArrowUpRight className="w-3 h-3" />
                                    +8.2% this week
                                </p>
                            </div>
                            <div className="w-14 h-14 rounded-xl bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
                                <Activity className="w-7 h-7 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Events</p>
                                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{stats.totalEvents}</p>
                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{stats.pendingEvents} pending approval</p>
                            </div>
                            <div className="w-14 h-14 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                                <Calendar className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>


            </div>

            {/* Tabs Section */}
            <Tabs defaultValue="activity" className="space-y-4">
                <TabsList className="bg-slate-100 dark:bg-slate-800">
                    <TabsTrigger value="activity" className="data-[state=active]:bg-[#AC1212] data-[state=active]:text-white">
                        <Activity className="w-4 h-4 mr-2" />
                        Recent Activity
                    </TabsTrigger>
                    <TabsTrigger value="pending" className="data-[state=active]:bg-[#AC1212] data-[state=active]:text-white">
                        <Clock className="w-4 h-4 mr-2" />
                        Pending Approvals
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="activity" className="space-y-4">
                    <Card className="border-gray-200 dark:border-gray-700 shadow-sm">
                        <CardHeader className="border-b dark:border-gray-700">
                            <CardTitle className="text-xl">Recent Activity</CardTitle>
                            <CardDescription>Latest platform activities</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-gray-50 dark:bg-gray-800">
                                    <TableRow>
                                        <TableHead className="font-semibold">Action</TableHead>
                                        <TableHead className="font-semibold">User/Item</TableHead>
                                        <TableHead className="font-semibold">Time</TableHead>
                                        <TableHead className="font-semibold">Type</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentActivity.map((item) => (
                                        <TableRow key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {item.type === 'user' && <Users className="w-4 h-4 text-blue-500" />}
                                                    {item.type === 'event' && <Calendar className="w-4 h-4 text-green-500" />}
                                                    {item.type === 'content' && <FileText className="w-4 h-4 text-red-500" />}
                                                    <span className="font-medium text-slate-900 dark:text-white">{item.action}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-slate-600 dark:text-slate-300">{item.user}</TableCell>
                                            <TableCell className="text-slate-500 dark:text-slate-400">{item.time}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="capitalize">
                                                    {item.type}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="pending" className="space-y-4">
                    <Card className="border-gray-200 dark:border-gray-700 shadow-sm">
                        <CardHeader className="border-b dark:border-gray-700">
                            <CardTitle className="text-xl">Pending Event Approvals</CardTitle>
                            <CardDescription>Events waiting for admin review</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-gray-50 dark:bg-gray-800">
                                    <TableRow>
                                        <TableHead className="font-semibold">Event</TableHead>
                                        <TableHead className="font-semibold">Organizer</TableHead>
                                        <TableHead className="font-semibold">Date</TableHead>
                                        <TableHead className="font-semibold">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pendingApprovals.map((event) => (
                                        <TableRow key={event.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                                            <TableCell>
                                                <span className="font-medium text-slate-900 dark:text-white">{event.title}</span>
                                            </TableCell>
                                            <TableCell className="text-slate-600 dark:text-slate-300">{event.organizer}</TableCell>
                                            <TableCell className="text-slate-500 dark:text-slate-400">{event.date}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                                        <CheckCircle className="w-4 h-4 mr-1" />
                                                        Approve
                                                    </Button>
                                                    <Button size="sm" variant="outline" className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20">
                                                        <Ban className="w-4 h-4 mr-1" />
                                                        Reject
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
