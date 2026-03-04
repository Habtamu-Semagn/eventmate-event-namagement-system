"use client"

import { useState, useEffect } from 'react'
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
    Calendar,
    Loader2
} from "lucide-react"
import { eventsApi } from '@/lib/api'

export default function OrganiserAttendeesPage() {
    const { theme } = useTheme()
    const [searchQuery, setSearchQuery] = useState('')
    const [eventFilter, setEventFilter] = useState('all')
    const [statusFilter, setStatusFilter] = useState('all')
    const [attendees, setAttendees] = useState<any[]>([])
    const [myEvents, setMyEvents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const [eventsRes, regRes] = await Promise.all([
                    eventsApi.getOrganizerEvents(),
                    eventsApi.getOrganizerRegistrations({
                        event_id: eventFilter !== 'all' ? eventFilter : undefined,
                        status: statusFilter !== 'all' ? statusFilter : undefined
                    })
                ])
                setMyEvents(eventsRes.data.events)
                setAttendees(regRes.data.registrations)
            } catch (err) {
                console.error('Failed to fetch organiser data:', err)
                setError('Failed to load attendees data')
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [eventFilter, statusFilter])

    const filteredAttendees = attendees.filter(attendee => {
        const matchesSearch = attendee.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            attendee.user_email.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    })

    const getStatusBadge = (status: string) => {
        const s = status.toLowerCase();
        const styles: Record<string, string> = {
            confirmed: theme === "dark" ? "bg-green-900/30 text-green-400 border-green-800" : "bg-green-100 text-green-700 border-green-200",
            rsvped: theme === "dark" ? "bg-green-900/30 text-green-400 border-green-800" : "bg-green-100 text-green-700 border-green-200",
            purchased: theme === "dark" ? "bg-blue-900/30 text-blue-400 border-blue-800" : "bg-blue-100 text-blue-700 border-blue-200",
            pending: theme === "dark" ? "bg-yellow-900/30 text-yellow-400 border-yellow-800" : "bg-yellow-100 text-yellow-700 border-yellow-200",
            cancelled: theme === "dark" ? "bg-red-900/30 text-red-400 border-red-800" : "bg-red-100 text-red-700 border-red-200",
            'checked-in': theme === "dark" ? "bg-blue-900/30 text-blue-400 border-blue-800" : "bg-blue-100 text-blue-700 border-blue-200",
        };
        return styles[s] || styles.pending;
    }

    const formatCurrency = (amount: number | null) => {
        if (!amount) return '$0.00';
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    }

    const confirmedCount = attendees.filter(a => ['Confirmed', 'RSVPed', 'Purchased'].includes(a.status)).length
    const checkedInCount = attendees.filter(a => a.status === 'Checked-In').length
    const totalRevenue = attendees.reduce((sum, a) => sum + (Number(a.paid_amount) || 0), 0)

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
                                <p className={`text-2xl font-bold ${theme === "dark" ? "text-slate-100" : ""}`}>{attendees.filter(a => a.status === 'Pending').length}</p>
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
                                {myEvents.map(event => (
                                    <SelectItem key={event.id} value={event.id.toString()}>{event.title}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className={`w-[180px] ${theme === "dark" ? "bg-slate-800 border-slate-700" : ""}`}>
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="RSVPed">RSVPed</SelectItem>
                                <SelectItem value="Purchased">Purchased</SelectItem>
                                <SelectItem value="Checked-In">Checked In</SelectItem>
                                <SelectItem value="Cancelled">Cancelled</SelectItem>
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
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-[#AC1212] mb-4" />
                            <p className="text-muted-foreground">Loading attendees...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <p className="text-red-500">{error}</p>
                            <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>Try Again</Button>
                        </div>
                    ) : filteredAttendees.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            No attendees found
                        </div>
                    ) : (
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
                                                    <AvatarFallback className={theme === "dark" ? "bg-slate-600 text-slate-200" : ""}>{attendee.user_name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className={`font-medium ${theme === "dark" ? "text-slate-100" : ""}`}>{attendee.user_name}</p>
                                                    <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-muted-foreground"}`}>{attendee.user_email}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className={theme === "dark" ? "text-slate-300" : ""}>{attendee.event_title}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={theme === "dark" ? "border-slate-700 text-slate-300" : ""}>{attendee.ticket_type || 'General'}</Badge>
                                        </TableCell>
                                        <TableCell className={theme === "dark" ? "text-slate-300" : ""}>{new Date(attendee.created_at).toLocaleDateString()}</TableCell>
                                        <TableCell className={theme === "dark" ? "text-slate-300" : ""}>{formatCurrency(attendee.paid_amount)}</TableCell>
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
                                                {(attendee.status === 'Confirmed' || attendee.status === 'RSVPed' || attendee.status === 'Purchased') && (
                                                    <Button variant="ghost" size="icon" className={`h-8 w-8 ${theme === "dark" ? "text-green-400 hover:bg-slate-800" : "text-green-600"}`}>
                                                        <CheckCircle className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                {(attendee.status === 'Confirmed' || attendee.status === 'RSVPed' || attendee.status === 'Purchased') && (
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
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
