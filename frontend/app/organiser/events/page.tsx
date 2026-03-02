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
import Link from 'next/link'
import {
    Calendar,
    Search,
    MapPin,
    Users,
    Clock,
    Eye,
    Edit,
    Trash2,
    Plus,
    MoreHorizontal,
    Ticket,
    DollarSign
} from "lucide-react"

// Mock organiser events data
const mockEvents = [
    { id: '1', title: 'Tech Conference 2026', category: 'Technology', date: '2026-03-15', location: 'San Francisco', capacity: 500, registered: 342, revenue: 33858, status: 'active' },
    { id: '2', title: 'Music Festival', category: 'Music', date: '2026-04-20', location: 'New York', capacity: 1000, registered: 756, revenue: 113028, status: 'active' },
    { id: '3', title: 'Art Workshop', category: 'Art', date: '2026-03-25', location: 'Los Angeles', capacity: 50, registered: 45, revenue: 0, status: 'pending' },
    { id: '4', title: 'Business Summit', category: 'Business', date: '2026-05-10', location: 'Chicago', capacity: 200, registered: 0, revenue: 0, status: 'draft' },
    { id: '5', title: 'Sports Day', category: 'Sports', date: '2026-06-01', location: 'Boston', capacity: 300, registered: 0, revenue: 0, status: 'draft' },
]

export default function OrganiserEventsPage() {
    const { theme } = useTheme()
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')

    const filteredEvents = mockEvents.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
        return matchesSearch && matchesStatus;
    })

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            active: theme === "dark" ? "bg-green-900/30 text-green-400 border-green-800" : "bg-green-100 text-green-700 border-green-200",
            pending: theme === "dark" ? "bg-yellow-900/30 text-yellow-400 border-yellow-800" : "bg-yellow-100 text-yellow-700 border-yellow-200",
            draft: theme === "dark" ? "bg-slate-800 text-slate-400 border-slate-700" : "bg-slate-100 text-slate-700 border-slate-200",
        };
        return styles[status] || styles.draft;
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    }

    const activeCount = mockEvents.filter(e => e.status === 'active').length
    const pendingCount = mockEvents.filter(e => e.status === 'pending').length
    const draftCount = mockEvents.filter(e => e.status === 'draft').length
    const totalRevenue = mockEvents.reduce((sum, e) => sum + e.revenue, 0)

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className={`text-3xl font-bold tracking-tight ${theme === "dark" ? "text-slate-100" : ""}`}>My Events</h1>
                    <p className={theme === "dark" ? "text-slate-400" : "text-muted-foreground"}>Manage and track your events</p>
                </div>
                <Link href="/organiser/create">
                    <Button className={theme === "dark" ? "bg-primary" : ""}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Event
                    </Button>
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <Card className={theme === "dark" ? "border-slate-800 bg-slate-900" : ""}>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-green-500/10">
                                <Calendar className="h-6 w-6 text-green-500" />
                            </div>
                            <div>
                                <p className={`text-2xl font-bold ${theme === "dark" ? "text-slate-100" : ""}`}>{activeCount}</p>
                                <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-muted-foreground"}`}>Active Events</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className={theme === "dark" ? "border-slate-800 bg-slate-900" : ""}>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-yellow-500/10">
                                <Clock className="h-6 w-6 text-yellow-500" />
                            </div>
                            <div>
                                <p className={`text-2xl font-bold ${theme === "dark" ? "text-slate-100" : ""}`}>{pendingCount}</p>
                                <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-muted-foreground"}`}>Pending</p>
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
                                <p className={`text-2xl font-bold ${theme === "dark" ? "text-slate-100" : ""}`}>{mockEvents.reduce((sum, e) => sum + e.registered, 0)}</p>
                                <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-muted-foreground"}`}>Total Attendees</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className={theme === "dark" ? "border-slate-800 bg-slate-900" : ""}>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-green-500/10">
                                <DollarSign className="h-6 w-6 text-green-500" />
                            </div>
                            <div>
                                <p className={`text-2xl font-bold ${theme === "dark" ? "text-slate-100" : ""}`}>{formatCurrency(totalRevenue)}</p>
                                <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-muted-foreground"}`}>Total Revenue</p>
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
                                placeholder="Search events..."
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
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Events Table */}
            <Card className={theme === "dark" ? "border-slate-800 bg-slate-900" : ""}>
                <CardHeader>
                    <CardTitle className={theme === "dark" ? "text-slate-100" : ""}>All Events</CardTitle>
                    <CardDescription className={theme === "dark" ? "text-slate-400" : ""}>View and manage your events</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className={theme === "dark" ? "border-slate-800" : ""}>
                                <TableHead className={theme === "dark" ? "text-slate-400" : ""}>Event</TableHead>
                                <TableHead className={theme === "dark" ? "text-slate-400" : ""}>Category</TableHead>
                                <TableHead className={theme === "dark" ? "text-slate-400" : ""}>Date</TableHead>
                                <TableHead className={theme === "dark" ? "text-slate-400" : ""}>Location</TableHead>
                                <TableHead className={theme === "dark" ? "text-slate-400" : ""}>Attendees</TableHead>
                                <TableHead className={theme === "dark" ? "text-slate-400" : ""}>Revenue</TableHead>
                                <TableHead className={theme === "dark" ? "text-slate-400" : ""}>Status</TableHead>
                                <TableHead className={`text-right ${theme === "dark" ? "text-slate-400" : ""}`}>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredEvents.map((event) => (
                                <TableRow key={event.id} className={theme === "dark" ? "border-slate-800" : ""}>
                                    <TableCell className={`font-medium ${theme === "dark" ? "text-slate-100" : ""}`}>{event.title}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={theme === "dark" ? "border-slate-700 text-slate-300" : ""}>{event.category}</Badge>
                                    </TableCell>
                                    <TableCell className={theme === "dark" ? "text-slate-300" : ""}>{event.date}</TableCell>
                                    <TableCell className={theme === "dark" ? "text-slate-300" : ""}>{event.location}</TableCell>
                                    <TableCell className={theme === "dark" ? "text-slate-300" : ""}>{event.registered}/{event.capacity}</TableCell>
                                    <TableCell className={theme === "dark" ? "text-slate-300" : ""}>{formatCurrency(event.revenue)}</TableCell>
                                    <TableCell>
                                        <Badge className={`${getStatusBadge(event.status)} border capitalize`}>
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
                                            <Button variant="ghost" size="icon" className={`h-8 w-8 ${theme === "dark" ? "text-slate-400 hover:bg-slate-800" : ""}`}>
                                                <Ticket className="h-4 w-4" />
                                            </Button>
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
