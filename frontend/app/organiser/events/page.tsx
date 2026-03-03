"use client"

import { useState, useEffect } from 'react'
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
import { useRouter } from 'next/navigation'
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
    Ticket,
    DollarSign,
    Loader2,
    AlertCircle
} from "lucide-react"
import { useAuth } from '@/components/AuthContext'
import { eventsApi } from '@/lib/api'

export default function OrganiserEventsPage() {
    const { theme } = useTheme()
    const { user, userData } = useAuth()
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [events, setEvents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    // Redirect if not organizer or admin
    useEffect(() => {
        if (!loading && !user) {
            router.push('/login')
        } else if (!loading && user && userData?.role !== 'Organizer' && userData?.role !== 'Administrator') {
            router.push('/')
        }
    }, [user, userData, loading, router])

    useEffect(() => {
        const fetchOrganizerEvents = async () => {
            if (!user || (userData?.role !== 'Organizer' && userData?.role !== 'Administrator')) {
                setLoading(false)
                return
            }

            try {
                setLoading(true)
                const response = await eventsApi.getOrganizerEvents()
                setEvents(response.data.events || [])
            } catch (err: any) {
                console.error('Failed to fetch organizer events:', err)
                setError('Failed to load your events')
            } finally {
                setLoading(false)
            }
        }

        fetchOrganizerEvents()
    }, [user, userData])

    const filteredEvents = events.filter(event => {
        const matchesSearch = event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.category?.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === 'all' || event.status?.toLowerCase() === statusFilter
        return matchesSearch && matchesStatus
    })

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            Approved: theme === "dark" ? "bg-green-900/30 text-green-400 border-green-800" : "bg-green-100 text-green-700 border-green-200",
            Pending: theme === "dark" ? "bg-yellow-900/30 text-yellow-400 border-yellow-800" : "bg-yellow-100 text-yellow-700 border-yellow-200",
            Rejected: theme === "dark" ? "bg-red-900/30 text-red-400 border-red-800" : "bg-red-100 text-red-700 border-red-200",
        }
        return styles[status] || styles.Pending
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0)
    }

    const activeCount = filteredEvents.filter(e => e.status === 'Approved').length
    const pendingCount = filteredEvents.filter(e => e.status === 'Pending').length

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#AC1212]"></div>
            </div>
        )
    }

    if (!user || (userData?.role !== 'Organizer' && userData?.role !== 'Administrator')) {
        return null
    }

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

            {/* Error State */}
            {error && (
                <Card className="border-red-500">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2 text-red-500">
                            <AlertCircle className="h-5 w-5" />
                            <p>{error}</p>
                        </div>
                    </CardContent>
                </Card>
            )}

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
                                <p className={`text-2xl font-bold ${theme === "dark" ? "text-slate-100" : ""}`}>
                                    {filteredEvents.reduce((sum, e) => sum + (parseInt(e.registration_count) || 0), 0)}
                                </p>
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
                                <p className={`text-2xl font-bold ${theme === "dark" ? "text-slate-100" : ""}`}>{formatCurrency(0)}</p>
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
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Events Table */}
            {filteredEvents.length === 0 ? (
                <Card className={theme === "dark" ? "border-slate-800 bg-slate-900" : ""}>
                    <CardContent className="pt-6 text-center py-12">
                        <Calendar className={`mx-auto h-12 w-12 mb-4 ${theme === "dark" ? "text-slate-500" : "text-muted-foreground"}`} />
                        <h2 className={`text-xl font-semibold mb-2 ${theme === "dark" ? "text-slate-100" : ""}`}>No events yet</h2>
                        <p className={`mb-4 ${theme === "dark" ? "text-slate-400" : "text-muted-foreground"}`}>Create your first event to get started</p>
                        <Link href="/organiser/create">
                            <Button className="bg-[#AC1212] hover:bg-[#8a0f0f]">
                                <Plus className="h-4 w-4 mr-2" />
                                Create Event
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
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
                                        <TableCell className={theme === "dark" ? "text-slate-300" : ""}>{event.location_venue || 'TBD'}</TableCell>
                                        <TableCell className={theme === "dark" ? "text-slate-300" : ""}>{event.registration_count || 0}/{event.capacity || '∞'}</TableCell>
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
            )}
        </div>
    )
}
