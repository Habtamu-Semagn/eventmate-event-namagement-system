"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
} from "lucide-react"

// Mock events data
const mockEvents = [
    { id: '1', title: 'Tech Conference 2026', organizer: 'John Doe', category: 'Technology', date: '2026-03-15', location: 'San Francisco', capacity: 500, registered: 342, status: 'pending' },
    { id: '2', title: 'Music Festival', organizer: 'Jane Smith', category: 'Music', date: '2026-04-20', location: 'New York', capacity: 1000, registered: 756, status: 'approved' },
    { id: '3', title: 'Art Workshop', organizer: 'Bob Wilson', category: 'Art', date: '2026-03-25', location: 'Los Angeles', capacity: 50, registered: 45, status: 'pending' },
    { id: '4', title: 'Business Summit', organizer: 'Alice Brown', category: 'Business', date: '2026-05-10', location: 'Chicago', capacity: 200, registered: 180, status: 'rejected' },
    { id: '5', title: 'Sports Day', organizer: 'Charlie Davis', category: 'Sports', date: '2026-06-01', location: 'Boston', capacity: 300, registered: 0, status: 'pending' },
    { id: '6', title: 'Health Expo', organizer: 'Diana Evans', category: 'Health', date: '2026-06-15', location: 'Seattle', capacity: 400, registered: 234, status: 'approved' },
    { id: '7', title: 'Education Fair', organizer: 'Frank Garcia', category: 'Education', date: '2026-07-01', location: 'Denver', capacity: 350, registered: 0, status: 'draft' },
]

export default function AdminEventsPage() {
    const { theme } = useTheme()
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [categoryFilter, setCategoryFilter] = useState('all')

    const filteredEvents = mockEvents.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.organizer.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
        const matchesCategory = categoryFilter === 'all' || event.category === categoryFilter;
        return matchesSearch && matchesStatus && matchesCategory;
    })

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            approved: theme === "dark" ? "bg-green-900/30 text-green-400 border-green-800" : "bg-green-100 text-green-700 border-green-200",
            pending: theme === "dark" ? "bg-yellow-900/30 text-yellow-400 border-yellow-800" : "bg-yellow-100 text-yellow-700 border-yellow-200",
            rejected: theme === "dark" ? "bg-red-900/30 text-red-400 border-red-800" : "bg-red-100 text-red-700 border-red-200",
            draft: theme === "dark" ? "bg-slate-800 text-slate-300 border-slate-700" : "bg-slate-100 text-slate-700 border-slate-200",
        };
        return styles[status] || styles.draft;
    }

    const getStatusIcon = (status: string) => {
        const icons: Record<string, any> = {
            approved: CheckCircle,
            pending: Clock,
            rejected: XCircle,
            draft: AlertCircle,
        };
        return icons[status] || Clock;
    }

    const pendingCount = mockEvents.filter(e => e.status === 'pending').length
    const approvedCount = mockEvents.filter(e => e.status === 'approved').length
    const rejectedCount = mockEvents.filter(e => e.status === 'rejected').length

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className={`text-3xl font-bold tracking-tight ${theme === "dark" ? "text-slate-100" : ""}`}>Event Management</h1>
                    <p className={theme === "dark" ? "text-slate-400" : "text-muted-foreground"}>Approve, manage, and moderate events</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <Card className={theme === "dark" ? "border-slate-800 bg-slate-900" : ""}>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-yellow-500/10">
                                <Clock className="h-6 w-6 text-yellow-500" />
                            </div>
                            <div>
                                <p className={`text-2xl font-bold ${theme === "dark" ? "text-slate-100" : ""}`}>{pendingCount}</p>
                                <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-muted-foreground"}`}>Pending Approval</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className={theme === "dark" ? "border-slate-800 bg-slate-900" : ""}>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-green-500/10">
                                <CheckCircle className="h-6 w-6 text-green-500" />
                            </div>
                            <div>
                                <p className={`text-2xl font-bold ${theme === "dark" ? "text-slate-100" : ""}`}>{approvedCount}</p>
                                <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-muted-foreground"}`}>Approved</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className={theme === "dark" ? "border-slate-800 bg-slate-900" : ""}>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-red-500/10">
                                <XCircle className="h-6 w-6 text-red-500" />
                            </div>
                            <div>
                                <p className={`text-2xl font-bold ${theme === "dark" ? "text-slate-100" : ""}`}>{rejectedCount}</p>
                                <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-muted-foreground"}`}>Rejected</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className={theme === "dark" ? "border-slate-800 bg-slate-900" : ""}>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-blue-500/10">
                                <Calendar className="h-6 w-6 text-blue-500" />
                            </div>
                            <div>
                                <p className={`text-2xl font-bold ${theme === "dark" ? "text-slate-100" : ""}`}>{mockEvents.length}</p>
                                <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-muted-foreground"}`}>Total Events</p>
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
                                placeholder="Search events or organizers..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`pl-10 ${theme === "dark" ? "bg-slate-800 border-slate-700" : ""}`}
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className={`w-[180px] ${theme === "dark" ? "bg-slate-800 border-slate-700" : ""}`}>
                                <SelectValue placeholder="Filter by status" />
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
                            <SelectTrigger className={`w-[180px] ${theme === "dark" ? "bg-slate-800 border-slate-700" : ""}`}>
                                <SelectValue placeholder="Filter by category" />
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
            <Card className={theme === "dark" ? "border-slate-800 bg-slate-900" : ""}>
                <CardHeader>
                    <CardTitle className={theme === "dark" ? "text-slate-100" : ""}>All Events</CardTitle>
                    <CardDescription className={theme === "dark" ? "text-slate-400" : ""}>Manage and review event submissions</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className={theme === "dark" ? "border-slate-800" : ""}>
                                <TableHead className={theme === "dark" ? "text-slate-400" : ""}>Event</TableHead>
                                <TableHead className={theme === "dark" ? "text-slate-400" : ""}>Organizer</TableHead>
                                <TableHead className={theme === "dark" ? "text-slate-400" : ""}>Category</TableHead>
                                <TableHead className={theme === "dark" ? "text-slate-400" : ""}>Date</TableHead>
                                <TableHead className={theme === "dark" ? "text-slate-400" : ""}>Location</TableHead>
                                <TableHead className={theme === "dark" ? "text-slate-400" : ""}>Capacity</TableHead>
                                <TableHead className={theme === "dark" ? "text-slate-400" : ""}>Registered</TableHead>
                                <TableHead className={theme === "dark" ? "text-slate-400" : ""}>Status</TableHead>
                                <TableHead className={`text-right ${theme === "dark" ? "text-slate-400" : ""}`}>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredEvents.map((event) => {
                                const StatusIcon = getStatusIcon(event.status)
                                return (
                                    <TableRow key={event.id} className={theme === "dark" ? "border-slate-800" : ""}>
                                        <TableCell className={`font-medium ${theme === "dark" ? "text-slate-100" : ""}`}>{event.title}</TableCell>
                                        <TableCell className={theme === "dark" ? "text-slate-300" : ""}>{event.organizer}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={theme === "dark" ? "border-slate-700 text-slate-300" : ""}>{event.category}</Badge>
                                        </TableCell>
                                        <TableCell className={theme === "dark" ? "text-slate-300" : ""}>{event.date}</TableCell>
                                        <TableCell className={theme === "dark" ? "text-slate-300" : ""}>{event.location}</TableCell>
                                        <TableCell className={theme === "dark" ? "text-slate-300" : ""}>{event.capacity}</TableCell>
                                        <TableCell className={theme === "dark" ? "text-slate-300" : ""}>{event.registered}/{event.capacity}</TableCell>
                                        <TableCell>
                                            <Badge className={`${getStatusBadge(event.status)} border`}>
                                                <StatusIcon className="w-3 h-3 mr-1" />
                                                {event.status}
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
                                                {event.status === 'pending' && (
                                                    <>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-green-500 hover:text-green-600">
                                                            <CheckCircle className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600">
                                                            <XCircle className="h-4 w-4" />
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
