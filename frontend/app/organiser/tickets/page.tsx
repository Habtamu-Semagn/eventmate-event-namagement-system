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
    Ticket,
    Search,
    Download,
    Eye,
    MoreHorizontal,
    DollarSign,
    Users,
    Calendar,
    CheckCircle,
    Clock,
    XCircle
} from "lucide-react"

// Mock tickets data
const mockTickets = [
    { id: 'TKT-001', event: 'Tech Conference 2026', type: 'VIP', price: 199.99, sold: 45, revenue: 8999.55, status: 'active' },
    { id: 'TKT-002', event: 'Tech Conference 2026', type: 'General', price: 99.99, sold: 297, revenue: 29700.03, status: 'active' },
    { id: 'TKT-003', event: 'Music Festival', type: 'VIP', price: 299.99, sold: 120, revenue: 35998.80, status: 'active' },
    { id: 'TKT-004', event: 'Music Festival', type: 'General', price: 149.99, sold: 636, revenue: 95393.64, status: 'active' },
    { id: 'TKT-005', event: 'Art Workshop', type: 'Early Bird', price: 49.99, sold: 45, revenue: 2249.55, status: 'soldout' },
    { id: 'TKT-006', event: 'Art Workshop', type: 'Standard', price: 79.99, sold: 0, revenue: 0, status: 'active' },
    { id: 'TKT-007', event: 'Business Summit', type: 'VIP', price: 499.99, sold: 0, revenue: 0, status: 'draft' },
    { id: 'TKT-008', event: 'Business Summit', type: 'General', price: 249.99, sold: 0, revenue: 0, status: 'draft' },
]

export default function OrganiserTicketsPage() {
    const { theme } = useTheme()
    const [searchQuery, setSearchQuery] = useState('')
    const [eventFilter, setEventFilter] = useState('all')
    const [statusFilter, setStatusFilter] = useState('all')

    const filteredTickets = mockTickets.filter(ticket => {
        const matchesSearch = ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ticket.type.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesEvent = eventFilter === 'all' || ticket.event === eventFilter;
        const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
        return matchesSearch && matchesEvent && matchesStatus;
    })

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            active: theme === "dark" ? "bg-green-900/30 text-green-400 border-green-800" : "bg-green-100 text-green-700 border-green-200",
            soldout: theme === "dark" ? "bg-red-900/30 text-red-400 border-red-800" : "bg-red-100 text-red-700 border-red-200",
            draft: theme === "dark" ? "bg-slate-800 text-slate-400 border-slate-700" : "bg-slate-100 text-slate-700 border-slate-200",
        };
        return styles[status] || styles.draft;
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    }

    const uniqueEvents = [...new Set(mockTickets.map(t => t.event))]
    const activeTickets = mockTickets.filter(t => t.status === 'active').length
    const totalSold = mockTickets.reduce((sum, t) => sum + t.sold, 0)
    const totalRevenue = mockTickets.reduce((sum, t) => sum + t.revenue, 0)

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className={`text-3xl font-bold tracking-tight ${theme === "dark" ? "text-slate-100" : ""}`}>Tickets</h1>
                    <p className={theme === "dark" ? "text-slate-400" : "text-muted-foreground"}>Manage ticket types and pricing</p>
                </div>
                <Button variant="outline" className={theme === "dark" ? "border-slate-700 hover:bg-slate-800" : ""}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <Card className={theme === "dark" ? "border-slate-800 bg-slate-900" : ""}>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-blue-500/10">
                                <Ticket className="h-6 w-6 text-blue-500" />
                            </div>
                            <div>
                                <p className={`text-2xl font-bold ${theme === "dark" ? "text-slate-100" : ""}`}>{mockTickets.length}</p>
                                <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-muted-foreground"}`}>Total Ticket Types</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className={theme === "dark" ? "border-slate-800 bg-slate-900" : ""}>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-green-500/10">
                                <Ticket className="h-6 w-6 text-green-500" />
                            </div>
                            <div>
                                <p className={`text-2xl font-bold ${theme === "dark" ? "text-slate-100" : ""}`}>{activeTickets}</p>
                                <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-muted-foreground"}`}>Active</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className={theme === "dark" ? "border-slate-800 bg-slate-900" : ""}>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-purple-500/10">
                                <Users className="h-6 w-6 text-purple-500" />
                            </div>
                            <div>
                                <p className={`text-2xl font-bold ${theme === "dark" ? "text-slate-100" : ""}`}>{totalSold}</p>
                                <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-muted-foreground"}`}>Tickets Sold</p>
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
                                placeholder="Search tickets..."
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
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="soldout">Sold Out</SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Tickets Table */}
            <Card className={theme === "dark" ? "border-slate-800 bg-slate-900" : ""}>
                <CardHeader>
                    <CardTitle className={theme === "dark" ? "text-slate-100" : ""}>Ticket Types</CardTitle>
                    <CardDescription className={theme === "dark" ? "text-slate-400" : ""}>Manage your ticket types and track sales</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className={theme === "dark" ? "border-slate-800" : ""}>
                                <TableHead className={theme === "dark" ? "text-slate-400" : ""}>Ticket ID</TableHead>
                                <TableHead className={theme === "dark" ? "text-slate-400" : ""}>Event</TableHead>
                                <TableHead className={theme === "dark" ? "text-slate-400" : ""}>Type</TableHead>
                                <TableHead className={theme === "dark" ? "text-slate-400" : ""}>Price</TableHead>
                                <TableHead className={theme === "dark" ? "text-slate-400" : ""}>Sold</TableHead>
                                <TableHead className={theme === "dark" ? "text-slate-400" : ""}>Revenue</TableHead>
                                <TableHead className={theme === "dark" ? "text-slate-400" : ""}>Status</TableHead>
                                <TableHead className={`text-right ${theme === "dark" ? "text-slate-400" : ""}`}>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredTickets.map((ticket) => (
                                <TableRow key={ticket.id} className={theme === "dark" ? "border-slate-800" : ""}>
                                    <TableCell className={`font-mono text-sm ${theme === "dark" ? "text-slate-300" : ""}`}>{ticket.id}</TableCell>
                                    <TableCell className={theme === "dark" ? "text-slate-300" : ""}>{ticket.event}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={theme === "dark" ? "border-slate-700 text-slate-300" : ""}>{ticket.type}</Badge>
                                    </TableCell>
                                    <TableCell className={theme === "dark" ? "text-slate-300" : ""}>{formatCurrency(ticket.price)}</TableCell>
                                    <TableCell className={theme === "dark" ? "text-slate-300" : ""}>{ticket.sold}</TableCell>
                                    <TableCell className={theme === "dark" ? "text-slate-300" : ""}>{formatCurrency(ticket.revenue)}</TableCell>
                                    <TableCell>
                                        <Badge className={`${getStatusBadge(ticket.status)} border capitalize`}>
                                            {ticket.status === 'soldout' && <XCircle className="w-3 h-3 mr-1" />}
                                            {ticket.status === 'active' && <CheckCircle className="w-3 h-3 mr-1" />}
                                            {ticket.status === 'draft' && <Clock className="w-3 h-3 mr-1" />}
                                            {ticket.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button variant="ghost" size="icon" className={`h-8 w-8 ${theme === "dark" ? "text-slate-400 hover:bg-slate-800" : ""}`}>
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className={`h-8 w-8 ${theme === "dark" ? "text-slate-400 hover:bg-slate-800" : ""}`}>
                                                <MoreHorizontal className="h-4 w-4" />
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
