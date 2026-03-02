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
    Download,
    Eye,
    MoreHorizontal,
    CheckCircle,
    XCircle,
    Clock,
    Calendar
} from "lucide-react"

// Mock attendees data
const mockAttendees = [
    { id: '1', name: 'Alice Johnson', email: 'alice@example.com', event: 'Tech Conference 2026', ticketType: 'VIP', status: 'confirmed', purchaseDate: '2026-02-10', amount: 199.99 },
    { id: '2', name: 'Bob Smith', email: 'bob@example.com', event: 'Music Festival', ticketType: 'General', status: 'confirmed', purchaseDate: '2026-02-15', amount: 149.99 },
    { id: '3', name: 'Carol Williams', email: 'carol@example.com', event: 'Tech Conference 2026', ticketType: 'General', status: 'pending', purchaseDate: '2026-02-20', amount: 99.99 },
    { id: '4', name: 'David Brown', email: 'david@example.com', event: 'Art Workshop', ticketType: 'VIP', status: 'confirmed', purchaseDate: '2026-02-18', amount: 79.99 },
    { id: '5', name: 'Eva Martinez', email: 'eva@example.com', event: 'Music Festival', ticketType: 'General', status: 'cancelled', purchaseDate: '2026-02-12', amount: 149.99 },
    { id: '6', name: 'Frank Wilson', email: 'frank@example.com', event: 'Tech Conference 2026', ticketType: 'VIP', status: 'confirmed', purchaseDate: '2026-02-22', amount: 199.99 },
    { id: '7', name: 'Grace Lee', email: 'grace@example.com', event: 'Art Workshop', ticketType: 'General', status: 'checked-in', purchaseDate: '2026-02-25', amount: 49.99 },
]

export default function OrganiserAttendeesPage() {
    const { theme } = useTheme()
    const [searchQuery, setSearchQuery] = useState('')
    const [eventFilter, setEventFilter] = useState('all')
    const [statusFilter, setStatusFilter] = useState('all')

    const filteredAttendees = mockAttendees.filter(attendee => {
        const matchesSearch = attendee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            attendee.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesEvent = eventFilter === 'all' || attendee.event === eventFilter;
        const matchesStatus = statusFilter === 'all' || attendee.status === statusFilter;
        return matchesSearch && matchesEvent && matchesStatus;
    })

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            confirmed: theme === "dark" ? "bg-green-900/30 text-green-400 border-green-800" : "bg-green-100 text-green-700 border-green-200",
            pending: theme === "dark" ? "bg-yellow-900/30 text-yellow-400 border-yellow-800" : "bg-yellow-100 text-yellow-700 border-yellow-200",
            cancelled: theme === "dark" ? "bg-red-900/30 text-red-400 border-red-800" : "bg-red-100 text-red-700 border-red-200",
            'checked-in': theme === "dark" ? "bg-blue-900/30 text-blue-400 border-blue-800" : "bg-blue-100 text-blue-700 border-blue-200",
        };
        return styles[status] || styles.pending;
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    }

    const uniqueEvents = [...new Set(mockAttendees.map(a => a.event))]
    const confirmedCount = mockAttendees.filter(a => a.status === 'confirmed').length
    const checkedInCount = mockAttendees.filter(a => a.status === 'checked-in').length
    const totalRevenue = mockAttendees.filter(a => a.status !== 'cancelled').reduce((sum, a) => sum + a.amount, 0)

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className={`text-3xl font-bold tracking-tight ${theme === "dark" ? "text-slate-100" : ""}`}>Attendees</h1>
                    <p className={theme === "dark" ? "text-slate-400" : "text-muted-foreground"}>Manage event attendees and registrations</p>
                </div>
                <Button variant="outline" className={theme === "dark" ? "border-slate-700 hover:bg-slate-800" : ""}>
                    <Download className="h-4 w-4 mr-2" />
                    Export List
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <Card className={theme === "dark" ? "border-slate-800 bg-slate-900" : ""}>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-green-500/10">
                                <CheckCircle className="h-6 w-6 text-green-500" />
                            </div>
                            <div>
                                <p className={`text-2xl font-bold ${theme === "dark" ? "text-slate-100" : ""}`}>{confirmedCount}</p>
                                <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-muted-foreground"}`}>Confirmed</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className={theme === "dark" ? "border-slate-800 bg-slate-900" : ""}>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-blue-500/10">
                                <Users className="h-6 w-6 text-blue-500" />
                            </div>
                            <div>
                                <p className={`text-2xl font-bold ${theme === "dark" ? "text-slate-100" : ""}`}>{checkedInCount}</p>
                                <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-muted-foreground"}`}>Checked In</p>
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
                                <p className={`text-2xl font-bold ${theme === "dark" ? "text-slate-100" : ""}`}>{mockAttendees.filter(a => a.status === 'pending').length}</p>
                                <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-muted-foreground"}`}>Pending</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className={theme === "dark" ? "border-slate-800 bg-slate-900" : ""}>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-green-500/10">
                                <Users className="h-6 w-6 text-green-500" />
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
                                placeholder="Search attendees..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`pl-10 ${theme === "dark" ? "bg-slate-800 border-slate-700" : ""}`}
                            />
                        </div>
                        <Select value={eventFilter} onValueChange={setEventFilter}>
                            <SelectTrigger className={`w-[200px] ${theme === "dark" ? "bg-slate-800 border-slate-700" : ""}`}>
                                <SelectValue placeholder="Filter by event" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Events</SelectItem>
                                {uniqueEvents.map(event => (
                                    <SelectItem key={event} value={event}>{event}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className={`w-[180px] ${theme === "dark" ? "bg-slate-800 border-slate-700" : ""}`}>
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                                <SelectItem value="checked-in">Checked In</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Attendees Table */}
            <Card className={theme === "dark" ? "border-slate-800 bg-slate-900" : ""}>
                <CardHeader>
                    <CardTitle className={theme === "dark" ? "text-slate-100" : ""}>All Attendees</CardTitle>
                    <CardDescription className={theme === "dark" ? "text-slate-400" : ""}>View and manage event attendees</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className={theme === "dark" ? "border-slate-800" : ""}>
                                <TableHead className={theme === "dark" ? "text-slate-400" : ""}>Attendee</TableHead>
                                <TableHead className={theme === "dark" ? "text-slate-400" : ""}>Event</TableHead>
                                <TableHead className={theme === "dark" ? "text-slate-400" : ""}>Ticket Type</TableHead>
                                <TableHead className={theme === "dark" ? "text-slate-400" : ""}>Purchase Date</TableHead>
                                <TableHead className={theme === "dark" ? "text-slate-400" : ""}>Amount</TableHead>
                                <TableHead className={theme === "dark" ? "text-slate-400" : ""}>Status</TableHead>
                                <TableHead className={`text-right ${theme === "dark" ? "text-slate-400" : ""}`}>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredAttendees.map((attendee) => (
                                <TableRow key={attendee.id} className={theme === "dark" ? "border-slate-800" : ""}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className={theme === "dark" ? "bg-slate-700" : ""}>
                                                <AvatarFallback className={theme === "dark" ? "bg-slate-600 text-slate-200" : ""}>{attendee.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className={`font-medium ${theme === "dark" ? "text-slate-100" : ""}`}>{attendee.name}</p>
                                                <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-muted-foreground"}`}>{attendee.email}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className={theme === "dark" ? "text-slate-300" : ""}>{attendee.event}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={theme === "dark" ? "border-slate-700 text-slate-300" : ""}>{attendee.ticketType}</Badge>
                                    </TableCell>
                                    <TableCell className={theme === "dark" ? "text-slate-300" : ""}>{attendee.purchaseDate}</TableCell>
                                    <TableCell className={theme === "dark" ? "text-slate-300" : ""}>{formatCurrency(attendee.amount)}</TableCell>
                                    <TableCell>
                                        <Badge className={`${getStatusBadge(attendee.status)} border capitalize`}>
                                            {attendee.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button variant="ghost" size="icon" className={`h-8 w-8 ${theme === "dark" ? "text-slate-400 hover:bg-slate-800" : ""}`}>
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            {attendee.status === 'confirmed' && (
                                                <Button variant="ghost" size="icon" className={`h-8 w-8 ${theme === "dark" ? "text-green-400 hover:bg-slate-800" : "text-green-600"}`}>
                                                    <CheckCircle className="h-4 w-4" />
                                                </Button>
                                            )}
                                            {attendee.status === 'confirmed' && (
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600">
                                                    <XCircle className="h-4 w-4" />
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
    )
}
