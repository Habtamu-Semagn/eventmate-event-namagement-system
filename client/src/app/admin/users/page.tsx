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
    Users,
    Search,
    Filter,
    Ban,
    CheckCircle,
    MoreHorizontal,
    Shield,
    UserCog,
    Activity,
    Calendar,
    Mail,
    AlertCircle,
    Eye,
    Edit,
    Trash2
} from 'lucide-react';

// Mock user data
const mockUsers = [
    { id: '1', name: 'John Doe', email: 'john.doe@email.com', role: 'organizer', status: 'active', events: 5, joinedDate: '2025-01-15', lastActive: '2 hours ago' },
    { id: '2', name: 'Jane Smith', email: 'jane.smith@email.com', role: 'user', status: 'active', events: 2, joinedDate: '2025-02-20', lastActive: '1 day ago' },
    { id: '3', name: 'Bob Wilson', email: 'bob.wilson@email.com', role: 'organizer', status: 'active', events: 8, joinedDate: '2024-11-10', lastActive: '3 hours ago' },
    { id: '4', name: 'Alice Brown', email: 'alice.brown@email.com', role: 'user', status: 'suspended', events: 0, joinedDate: '2025-03-01', lastActive: '5 days ago' },
    { id: '5', name: 'Charlie Davis', email: 'charlie.davis@email.com', role: 'user', status: 'active', events: 1, joinedDate: '2025-01-28', lastActive: '6 hours ago' },
    { id: '6', name: 'Diana Evans', email: 'diana.evans@email.com', role: 'admin', status: 'active', events: 0, joinedDate: '2024-06-15', lastActive: 'Just now' },
    { id: '7', name: 'Frank Garcia', email: 'frank.garcia@email.com', role: 'organizer', status: 'active', events: 12, joinedDate: '2024-08-22', lastActive: '1 day ago' },
    { id: '8', name: 'Grace Harris', email: 'grace.harris@email.com', role: 'user', status: 'inactive', events: 0, joinedDate: '2024-12-05', lastActive: '30 days ago' },
];

export default function UserManagementPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredUsers = mockUsers.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
        return matchesSearch && matchesRole && matchesStatus;
    });

    const getRoleBadge = (role: string) => {
        const styles: Record<string, string> = {
            admin: 'bg-purple-100 text-purple-700 border-purple-200',
            organizer: 'bg-blue-100 text-blue-700 border-blue-200',
            user: 'bg-gray-100 text-gray-700 border-gray-200',
        };
        return styles[role] || styles.user;
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            active: 'bg-green-100 text-green-700 border-green-200',
            suspended: 'bg-red-100 text-red-700 border-red-200',
            inactive: 'bg-gray-100 text-gray-500 border-gray-200',
        };
        return styles[status] || styles.inactive;
    };

    const activeCount = mockUsers.filter(u => u.status === 'active').length;
    const suspendedCount = mockUsers.filter(u => u.status === 'suspended').length;
    const inactiveCount = mockUsers.filter(u => u.status === 'inactive').length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">User Management</h1>
                    <p className="text-gray-500 mt-1">Monitor and manage platform users</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Users</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{mockUsers.length}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                                <Users className="w-6 h-6 text-gray-700" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Active</p>
                                <p className="text-3xl font-bold text-green-600 mt-1">{activeCount}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Suspended</p>
                                <p className="text-3xl font-bold text-red-600 mt-1">{suspendedCount}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
                                <Ban className="w-6 h-6 text-red-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card className="border-gray-200 shadow-sm">
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Search users..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={roleFilter} onValueChange={setRoleFilter}>
                            <SelectTrigger className="w-full md:w-[150px]">
                                <SelectValue placeholder="Role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Roles</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="organizer">Organizer</SelectItem>
                                <SelectItem value="user">User</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full md:w-[150px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="suspended">Suspended</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Users Table */}
            <Card className="border-gray-200 shadow-sm">
                <CardHeader className="border-b">
                    <CardTitle className="text-xl">All Users</CardTitle>
                    <CardDescription>{filteredUsers.length} users found</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-gray-50">
                            <TableRow>
                                <TableHead className="font-semibold">User</TableHead>
                                <TableHead className="font-semibold">Role</TableHead>
                                <TableHead className="font-semibold">Status</TableHead>
                                <TableHead className="font-semibold">Events</TableHead>
                                <TableHead className="font-semibold">Joined</TableHead>
                                <TableHead className="font-semibold">Last Active</TableHead>
                                <TableHead className="font-semibold text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.map((user) => (
                                <TableRow key={user.id} className="hover:bg-gray-50/50">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                                <span className="text-sm font-medium text-gray-600">
                                                    {user.name.split(' ').map(n => n[0]).join('')}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{user.name}</p>
                                                <p className="text-sm text-gray-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={getRoleBadge(user.role)}>
                                            <Shield className="w-3 h-3 mr-1" />
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={getStatusBadge(user.status)}>
                                            {user.status === 'active' && <CheckCircle className="w-3 h-3 mr-1" />}
                                            {user.status === 'suspended' && <Ban className="w-3 h-3 mr-1" />}
                                            {user.status === 'inactive' && <AlertCircle className="w-3 h-3 mr-1" />}
                                            {user.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-gray-600">{user.events}</TableCell>
                                    <TableCell className="text-gray-500">{user.joinedDate}</TableCell>
                                    <TableCell className="text-gray-500">{user.lastActive}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-end gap-1">
                                            <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                                                <Eye className="w-4 h-4 text-gray-600" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                                                <Edit className="w-4 h-4 text-gray-600" />
                                            </Button>
                                            {user.status === 'active' ? (
                                                <Button variant="ghost" size="icon" className="hover:bg-red-50">
                                                    <Ban className="w-4 h-4 text-red-500" />
                                                </Button>
                                            ) : (
                                                <Button variant="ghost" size="icon" className="hover:bg-green-50">
                                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                                </Button>
                                            )}
                                        </div>
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
