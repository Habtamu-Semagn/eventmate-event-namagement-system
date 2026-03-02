"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { useTheme } from "@/components/theme-provider"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Users,
    Search,
    Mail,
    Calendar,
    Shield,
    User,
    MoreHorizontal,
    Eye,
    Edit,
    Trash2,
    Ban,
    CheckCircle,
    XCircle
} from "lucide-react"

// Mock users data
const mockUsers = [
    { id: '1', name: 'John Doe', email: 'john.doe@email.com', role: 'organizer', status: 'active', events: 5, joinedDate: '2025-06-15', avatar: 'JD' },
    { id: '2', name: 'Sarah Wilson', email: 'sarah.wilson@email.com', role: 'attendee', status: 'active', events: 12, joinedDate: '2025-08-20', avatar: 'SW' },
    { id: '3', name: 'Mike Johnson', email: 'mike.johnson@email.com', role: 'organizer', status: 'active', events: 3, joinedDate: '2025-09-10', avatar: 'MJ' },
    { id: '4', name: 'Emily Brown', email: 'emily.brown@email.com', role: 'attendee', status: 'inactive', events: 0, joinedDate: '2025-07-05', avatar: 'EB' },
    { id: '5', name: 'David Lee', email: 'david.lee@email.com', role: 'admin', status: 'active', events: 0, joinedDate: '2025-01-01', avatar: 'DL' },
    { id: '6', name: 'Lisa Anderson', email: 'lisa.anderson@email.com', role: 'attendee', status: 'active', events: 8, joinedDate: '2025-10-12', avatar: 'LA' },
    { id: '7', name: 'Robert Taylor', email: 'robert.taylor@email.com', role: 'organizer', status: 'suspended', events: 2, joinedDate: '2025-04-22', avatar: 'RT' },
]

export default function AdminUsersPage() {
    const { theme } = useTheme()
    const [searchQuery, setSearchQuery] = useState('')
    const [roleFilter, setRoleFilter] = useState('all')
    const [statusFilter, setStatusFilter] = useState('all')

    const filteredUsers = mockUsers.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
        return matchesSearch && matchesRole && matchesStatus;
    })

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            active: theme === "dark" ? "bg-green-900/30 text-green-400 border-green-800" : "bg-green-100 text-green-700 border-green-200",
            inactive: theme === "dark" ? "bg-slate-800 text-slate-400 border-slate-700" : "bg-slate-100 text-slate-700 border-slate-200",
            suspended: theme === "dark" ? "bg-red-900/30 text-red-400 border-red-800" : "bg-red-100 text-red-700 border-red-200",
        };
        return styles[status] || styles.active;
    }

    const getRoleBadge = (role: string) => {
        const styles: Record<string, string> = {
            admin: theme === "dark" ? "bg-purple-900/30 text-purple-400 border-purple-800" : "bg-purple-100 text-purple-700 border-purple-200",
            organizer: theme === "dark" ? "bg-blue-900/30 text-blue-400 border-blue-800" : "bg-blue-100 text-blue-700 border-blue-200",
            attendee: theme === "dark" ? "bg-slate-800 text-slate-300 border-slate-700" : "bg-slate-100 text-slate-700 border-slate-200",
        };
        return styles[role] || styles.attendee;
    }

    const activeCount = mockUsers.filter(u => u.status === 'active').length
    const organizerCount = mockUsers.filter(u => u.role === 'organizer').length
    const attendeeCount = mockUsers.filter(u => u.role === 'attendee').length

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className={`text-3xl font-bold tracking-tight ${theme === "dark" ? "text-slate-100" : ""}`}>User Management</h1>
                    <p className={theme === "dark" ? "text-slate-400" : "text-muted-foreground"}>Manage and monitor platform users</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <Card className={theme === "dark" ? "border-slate-800 bg-slate-900" : ""}>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-green-500/10">
                                <Users className="h-6 w-6 text-green-500" />
                            </div>
                            <div>
                                <p className={`text-2xl font-bold ${theme === "dark" ? "text-slate-100" : ""}`}>{activeCount}</p>
                                <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-muted-foreground"}`}>Active Users</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className={theme === "dark" ? "border-slate-800 bg-slate-900" : ""}>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-blue-500/10">
                                <Shield className="h-6 w-6 text-blue-500" />
                            </div>
                            <div>
                                <p className={`text-2xl font-bold ${theme === "dark" ? "text-slate-100" : ""}`}>{organizerCount}</p>
                                <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-muted-foreground"}`}>Organizers</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className={theme === "dark" ? "border-slate-800 bg-slate-900" : ""}>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-purple-500/10">
                                <User className="h-6 w-6 text-purple-500" />
                            </div>
                            <div>
                                <p className={`text-2xl font-bold ${theme === "dark" ? "text-slate-100" : ""}`}>{attendeeCount}</p>
                                <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-muted-foreground"}`}>Attendees</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className={theme === "dark" ? "border-slate-800 bg-slate-900" : ""}>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-slate-500/10">
                                <Users className="h-6 w-6 text-slate-500" />
                            </div>
                            <div>
                                <p className={`text-2xl font-bold ${theme === "dark" ? "text-slate-100" : ""}`}>{mockUsers.length}</p>
                                <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-muted-foreground"}`}>Total Users</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card className={theme === "dark" ? "border-slate-800 bg-slate-900" : ""}>
                <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${theme === "dark" ? "text-slate-400" : "text-muted-foreground"}`} />
                            <Input
                                placeholder="Search users by name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`pl-10 ${theme === "dark" ? "bg-slate-800 border-slate-700" : ""}`}
                            />
                        </div>
                        <Select value={roleFilter} onValueChange={setRoleFilter}>
                            <SelectTrigger className={`w-[180px] ${theme === "dark" ? "bg-slate-800 border-slate-700" : ""}`}>
                                <SelectValue placeholder="Filter by role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Roles</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="organizer">Organizer</SelectItem>
                                <SelectItem value="attendee">Attendee</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className={`w-[180px] ${theme === "dark" ? "bg-slate-800 border-slate-700" : ""}`}>
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                                <SelectItem value="suspended">Suspended</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Users Table */}
            <Card className={theme === "dark" ? "border-slate-800 bg-slate-900" : ""}>
                <CardHeader>
                    <CardTitle className={theme === "dark" ? "text-slate-100" : ""}>All Users</CardTitle>
                    <CardDescription className={theme === "dark" ? "text-slate-400" : ""}>Manage user accounts and permissions</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className={theme === "dark" ? "border-slate-800" : ""}>
                                <TableHead className={theme === "dark" ? "text-slate-400" : ""}>User</TableHead>
                                <TableHead className={theme === "dark" ? "text-slate-400" : ""}>Role</TableHead>
                                <TableHead className={theme === "dark" ? "text-slate-400" : ""}>Events</TableHead>
                                <TableHead className={theme === "dark" ? "text-slate-400" : ""}>Joined</TableHead>
                                <TableHead className={theme === "dark" ? "text-slate-400" : ""}>Status</TableHead>
                                <TableHead className={`text-right ${theme === "dark" ? "text-slate-400" : ""}`}>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.map((user) => (
                                <TableRow key={user.id} className={theme === "dark" ? "border-slate-800" : ""}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className={theme === "dark" ? "bg-slate-700" : ""}>
                                                <AvatarFallback className={theme === "dark" ? "bg-slate-600 text-slate-200" : ""}>{user.avatar}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className={`font-medium ${theme === "dark" ? "text-slate-100" : ""}`}>{user.name}</p>
                                                <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-muted-foreground"}`}>{user.email}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={`${getRoleBadge(user.role)} border capitalize`}>
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className={theme === "dark" ? "text-slate-300" : ""}>{user.events}</TableCell>
                                    <TableCell className={theme === "dark" ? "text-slate-300" : ""}>{user.joinedDate}</TableCell>
                                    <TableCell>
                                        <Badge className={`${getStatusBadge(user.status)} border capitalize`}>
                                            {user.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button variant="ghost" size="icon" className={`h-8 w-8 ${theme === "dark" ? "text-slate-400 hover:bg-slate-800" : ""}`}>
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className={`h-8 w-8 ${theme === "dark" ? "text-slate-400 hover:bg-slate-800" : ""}`}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            {user.status === 'active' ? (
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600">
                                                    <Ban className="h-4 w-4" />
                                                </Button>
                                            ) : user.status === 'suspended' ? (
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-green-500 hover:text-green-600">
                                                    <CheckCircle className="h-4 w-4" />
                                                </Button>
                                            ) : null}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
