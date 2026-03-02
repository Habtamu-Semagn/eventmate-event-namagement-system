'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
    Search,
    Filter,
    Download,
    Calendar,
    User,
    FileText,
    CheckCircle,
    XCircle,
    AlertCircle,
    Clock,
    History
} from 'lucide-react';

// Mock audit trail data
interface AuditEntry {
    id: string;
    timestamp: string;
    action: string;
    user: string;
    userEmail: string;
    target: string;
    targetType: 'event' | 'user' | 'content' | 'system';
    status: 'success' | 'failed' | 'warning';
    details: string;
}

const mockAuditTrail: AuditEntry[] = [
    { id: '1', timestamp: '2026-03-01 14:30:25', action: 'Event Approved', user: 'Admin', userEmail: 'admin@eventmate.com', target: 'Tech Conference 2026', targetType: 'event', status: 'success', details: 'Event published successfully' },
    { id: '2', timestamp: '2026-03-01 14:28:15', action: 'User Registered', user: 'John Doe', userEmail: 'john@example.com', target: 'john@example.com', targetType: 'user', status: 'success', details: 'New user account created' },
    { id: '3', timestamp: '2026-03-01 14:25:30', action: 'Event Submitted', user: 'Jane Smith', userEmail: 'jane@example.com', target: 'Art Workshop', targetType: 'event', status: 'success', details: 'Event pending approval' },
    { id: '4', timestamp: '2026-03-01 14:20:45', action: 'Event Rejected', user: 'Admin', userEmail: 'admin@eventmate.com', target: 'Spam Event', targetType: 'event', status: 'success', details: 'Event violated community guidelines' },
    { id: '5', timestamp: '2026-03-01 14:15:10', action: 'Login Failed', user: 'Unknown', userEmail: 'hacker@test.com', target: 'System', targetType: 'system', status: 'failed', details: 'Invalid credentials attempt' },
    { id: '6', timestamp: '2026-03-01 14:10:00', action: 'Content Flagged', user: 'System', userEmail: 'system@eventmate.com', target: 'Inappropriate Content', targetType: 'content', status: 'warning', details: 'Auto-flagged by AI moderation' },
    { id: '7', timestamp: '2026-03-01 14:05:22', action: 'User Banned', user: 'Admin', userEmail: 'admin@eventmate.com', target: 'spammer@email.com', targetType: 'user', status: 'success', details: 'User banned for violations' },
    { id: '8', timestamp: '2026-03-01 13:58:30', action: 'Event Updated', user: 'Organizer', userEmail: 'organizer@eventmate.com', target: 'Music Festival', targetType: 'event', status: 'success', details: 'Event date changed' },
    { id: '9', timestamp: '2026-03-01 13:45:18', action: 'Password Reset', user: 'User', userEmail: 'user@test.com', target: 'user@test.com', targetType: 'user', status: 'success', details: 'Password reset requested' },
    { id: '10', timestamp: '2026-03-01 13:30:00', action: 'Ticket Purchased', user: 'Buyer', userEmail: 'buyer@example.com', target: 'Tech Conference 2026', targetType: 'event', status: 'success', details: 'VIP ticket purchased - $199.99' },
];

export default function AuditTrailPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [actionFilter, setActionFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredAudit = mockAuditTrail.filter(entry => {
        const matchesSearch = entry.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
            entry.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
            entry.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
            entry.target.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesAction = actionFilter === 'all' || entry.action.toLowerCase().includes(actionFilter);
        const matchesStatus = statusFilter === 'all' || entry.status === statusFilter;
        return matchesSearch && matchesAction && matchesStatus;
    });

    const getStatusBadge = (status: string) => {
        const styles: Record<string, { bg: string; text: string; border: string; icon: any; label: string }> = {
            success: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', border: 'border-green-200 dark:border-green-800', icon: CheckCircle, label: 'Success' },
            failed: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', border: 'border-red-200 dark:border-red-800', icon: XCircle, label: 'Failed' },
            warning: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', border: 'border-yellow-200 dark:border-yellow-800', icon: AlertCircle, label: 'Warning' },
        };
        const style = styles[status] || styles.success;
        const Icon = style.icon;
        return (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${style.bg} ${style.text} ${style.border}`}>
                <Icon className="w-3.5 h-3.5" />
                {style.label}
            </span>
        );
    };

    const getTargetTypeIcon = (type: string) => {
        switch (type) {
            case 'event': return <Calendar className="w-4 h-4 text-blue-500 dark:text-blue-400" />;
            case 'user': return <User className="w-4 h-4 text-green-500 dark:text-green-400" />;
            case 'content': return <FileText className="w-4 h-4 text-orange-500 dark:text-orange-400" />;
            default: return <History className="w-4 h-4 text-gray-500 dark:text-gray-400" />;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Audit Trail</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Track all system activities and changes</p>
                </div>
                <Button className="bg-[#AC1212] hover:bg-[#8a0f0f]">
                    <Download className="w-4 h-4 mr-2" />
                    Export Log
                </Button>
            </div>

            {/* Filters */}
            <Card className="border-gray-200 dark:border-gray-700 shadow-sm">
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                            <Input
                                placeholder="Search by user, action, or target..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={actionFilter} onValueChange={setActionFilter}>
                            <SelectTrigger className="w-full md:w-[180px]">
                                <SelectValue placeholder="Action Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Actions</SelectItem>
                                <SelectItem value="event">Event Actions</SelectItem>
                                <SelectItem value="user">User Actions</SelectItem>
                                <SelectItem value="login">Login Attempts</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full md:w-[180px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="success">Success</SelectItem>
                                <SelectItem value="failed">Failed</SelectItem>
                                <SelectItem value="warning">Warning</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Events</p>
                                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{mockAuditTrail.filter(e => e.targetType === 'event').length}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">User Actions</p>
                                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{mockAuditTrail.filter(e => e.targetType === 'user').length}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
                                <User className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Failed Attempts</p>
                                <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-1">{mockAuditTrail.filter(e => e.status === 'failed').length}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-900/30 flex items-center justify-center">
                                <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Warnings</p>
                                <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">{mockAuditTrail.filter(e => e.status === 'warning').length}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-yellow-50 dark:bg-yellow-900/30 flex items-center justify-center">
                                <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Audit Trail Table */}
            <Card className="border-slate-200 dark:border-slate-700 shadow-sm">
                <CardHeader className="border-b dark:border-slate-700 pb-4">
                    <CardTitle className="text-xl">Activity Log</CardTitle>
                    <CardDescription>{filteredAudit.length} entries found</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-slate-50 dark:bg-slate-800">
                            <TableRow>
                                <TableHead className="font-semibold">Timestamp</TableHead>
                                <TableHead className="font-semibold">Action</TableHead>
                                <TableHead className="font-semibold">User</TableHead>
                                <TableHead className="font-semibold">Target</TableHead>
                                <TableHead className="font-semibold">Details</TableHead>
                                <TableHead className="font-semibold">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredAudit.map((entry) => (
                                <TableRow key={entry.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                            <Clock className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                                            {entry.timestamp}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {getTargetTypeIcon(entry.targetType)}
                                            <span className="font-medium text-slate-900 dark:text-white">{entry.action}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium text-slate-900 dark:text-white">{entry.user}</p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">{entry.userEmail}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-slate-600 dark:text-slate-300">{entry.target}</TableCell>
                                    <TableCell className="text-slate-500 dark:text-slate-400 text-sm max-w-xs truncate">
                                        {entry.details}
                                    </TableCell>
                                    <TableCell>
                                        {getStatusBadge(entry.status)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
