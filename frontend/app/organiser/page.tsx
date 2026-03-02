"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useTheme } from "@/components/theme-provider"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Users,
    Calendar,
    Ticket,
    DollarSign,
    TrendingUp,
    Plus,
    Eye,
    MoreHorizontal,
    Clock,
    CheckCircle2,
    XCircle,
    CalendarDays,
    BarChart3,
} from "lucide-react"

// My Events Data
const myEvents = [
    { id: 1, name: "Tech Conference 2026", date: "Mar 15, 2026", attendees: 450, tickets: 500, status: "active", revenue: "$12,500" },
    { id: 2, name: "Music Festival", date: "Mar 20, 2026", attendees: 1200, tickets: 1500, status: "active", revenue: "$35,000" },
    { id: 3, name: "Business Workshop", date: "Mar 22, 2026", attendees: 45, tickets: 100, status: "upcoming", revenue: "$4,250" },
    { id: 4, name: "Art Exhibition", date: "Mar 25, 2026", attendees: 0, tickets: 200, status: "draft", revenue: "$0" },
]

// Recent Attendees Data
const recentAttendees = [
    { id: 1, name: "Alice Johnson", email: "alice@example.com", event: "Tech Conference", ticketType: "VIP", status: "confirmed" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", event: "Music Festival", ticketType: "General", status: "confirmed" },
    { id: 3, name: "Carol Williams", email: "carol@example.com", event: "Tech Conference", ticketType: "General", status: "pending" },
    { id: 4, name: "David Brown", email: "david@example.com", event: "Business Workshop", ticketType: "VIP", status: "confirmed" },
    { id: 5, name: "Eva Martinez", email: "eva@example.com", event: "Music Festival", ticketType: "General", status: "cancelled" },
]

// Notifications Data
const notifications = [
    { id: 1, title: "New ticket purchase", message: "Alice Johnson purchased a VIP ticket", time: "5 mins ago", type: "success" },
    { id: 2, title: "Event reminder", message: "Tech Conference starts in 3 days", time: "1 hour ago", type: "info" },
    { id: 3, title: "Payment received", message: "Payment of $500 received", time: "2 hours ago", type: "success" },
    { id: 4, title: "Refund request", message: "Bob Smith requested a refund", time: "3 hours ago", type: "warning" },
    { id: 5, title: "Attendee check-in", message: "50 attendees checked in", time: "5 hours ago", type: "info" },
]

// Status Badge Component
function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        active: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
        upcoming: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
        draft: "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20",
        confirmed: "bg-green-500/10 text-green-500",
        pending: "bg-yellow-500/10 text-yellow-500",
        cancelled: "bg-red-500/10 text-red-500",
        success: "bg-green-500/10 text-green-500",
        info: "bg-blue-500/10 text-blue-500",
        warning: "bg-yellow-500/10 text-yellow-500",
    }

    return (
        <Badge className={styles[status] || styles.info}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
    )
}

// Quick Action Button
function QuickAction({ icon: Icon, label, onClick }: { icon: React.ElementType, label: string, onClick?: () => void }) {
    const { theme } = useTheme()

    return (
        <Button variant="outline" className={`h-auto py-4 flex-col gap-2 ${theme === "dark" ? "border-slate-700 hover:bg-slate-800" : ""}`} onClick={onClick}>
            <Icon className={`h-5 w-5 ${theme === "dark" ? "text-slate-400" : ""}`} />
            <span className={`text-xs ${theme === "dark" ? "text-slate-400" : ""}`}>{label}</span>
        </Button>
    )
}

export default function OrganiserDashboard() {
    const { theme } = useTheme()

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className={`text-3xl font-bold tracking-tight ${theme === "dark" ? "text-slate-100" : ""}`}>Dashboard</h1>
                    <p className={theme === "dark" ? "text-slate-400" : "text-muted-foreground"}>Welcome back! Here's your event overview.</p>
                </div>
                <Button className={theme === "dark" ? "bg-primary text-primary-foreground" : ""}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Event
                </Button>
            </div>

            {/* Stats Grid - 30-60-10 Design */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className={`border-l-4 border-l-red-600 transition-all duration-200 hover:shadow-lg ${theme === "dark" ? "border-slate-800 bg-slate-900" : ""}`}>
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                            <div className="space-y-2">
                                <p className={`text-sm font-medium ${theme === "dark" ? "text-slate-400" : "text-muted-foreground"}`}>Total Events</p>
                                <p className={`text-3xl font-bold ${theme === "dark" ? "text-slate-100" : ""}`}>12</p>
                                <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-muted-foreground"}`}>Active: 9</p>
                            </div>
                            <div className="p-3 rounded-xl bg-red-500/10">
                                <Calendar className="h-6 w-6 text-red-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className={`border-l-4 border-l-yellow-500 transition-all duration-200 hover:shadow-lg ${theme === "dark" ? "border-slate-800 bg-slate-900" : ""}`}>
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                            <div className="space-y-2">
                                <p className={`text-sm font-medium ${theme === "dark" ? "text-slate-400" : "text-muted-foreground"}`}>Pending Approval</p>
                                <p className={`text-3xl font-bold ${theme === "dark" ? "text-slate-100" : ""}`}>3</p>
                                <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-muted-foreground"}`}>Awaiting review</p>
                            </div>
                            <div className="p-3 rounded-xl bg-yellow-500/10">
                                <Clock className="h-6 w-6 text-yellow-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className={`border-l-4 border-l-blue-500 transition-all duration-200 hover:shadow-lg ${theme === "dark" ? "border-slate-800 bg-slate-900" : ""}`}>
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                            <div className="space-y-2">
                                <p className={`text-sm font-medium ${theme === "dark" ? "text-slate-400" : "text-muted-foreground"}`}>Total Attendees</p>
                                <p className={`text-3xl font-bold ${theme === "dark" ? "text-slate-100" : ""}`}>1,695</p>
                                <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-muted-foreground"}`}>Across all events</p>
                            </div>
                            <div className="p-3 rounded-xl bg-blue-500/10">
                                <Users className="h-6 w-6 text-blue-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className={`border-l-4 border-l-amber-500 transition-all duration-200 hover:shadow-lg ${theme === "dark" ? "border-slate-800 bg-slate-900" : ""}`}>
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                            <div className="space-y-2">
                                <p className={`text-sm font-medium ${theme === "dark" ? "text-slate-400" : "text-muted-foreground"}`}>Total Revenue</p>
                                <p className={`text-3xl font-bold ${theme === "dark" ? "text-slate-100" : ""}`}>$51,750</p>
                                <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-muted-foreground"}`}>Ticket sales</p>
                            </div>
                            <div className="p-3 rounded-xl bg-amber-500/10">
                                <TrendingUp className="h-6 w-6 text-amber-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-4">
                <QuickAction icon={Plus} label="Create Event" />
                <QuickAction icon={Calendar} label="View Events" />
                <QuickAction icon={Users} label="Manage Attendees" />
                <QuickAction icon={BarChart3} label="View Analytics" />
            </div>

            {/* Content Tabs */}
            <Tabs defaultValue="events" className="space-y-4">
                <TabsList className={theme === "dark" ? "bg-slate-800" : ""}>
                    <TabsTrigger value="events" className={theme === "dark" ? "data-[state=active]:bg-slate-700 data-[state=active]:text-slate-100" : ""}>My Events</TabsTrigger>
                    <TabsTrigger value="attendees" className={theme === "dark" ? "data-[state=active]:bg-slate-700 data-[state=active]:text-slate-100" : ""}>Recent Attendees</TabsTrigger>
                    <TabsTrigger value="notifications" className={theme === "dark" ? "data-[state=active]:bg-slate-700 data-[state=active]:text-slate-100" : ""}>Notifications</TabsTrigger>
                </TabsList>

                <TabsContent value="events" className="space-y-4">
                    <Card className={theme === "dark" ? "border-slate-800 bg-slate-900" : ""}>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className={theme === "dark" ? "text-slate-100" : ""}>My Events</CardTitle>
                                <CardDescription className={theme === "dark" ? "text-slate-400" : ""}>Manage and track your events</CardDescription>
                            </div>
                            <Button variant="outline" size="sm" className={theme === "dark" ? "border-slate-700 hover:bg-slate-800 text-slate-200" : ""}>View All Events</Button>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow className={theme === "dark" ? "border-slate-800" : ""}>
                                        <TableHead className={theme === "dark" ? "text-slate-400" : ""}>Event Name</TableHead>
                                        <TableHead className={theme === "dark" ? "text-slate-400" : ""}>Date</TableHead>
                                        <TableHead className={theme === "dark" ? "text-slate-400" : ""}>Attendees</TableHead>
                                        <TableHead className={theme === "dark" ? "text-slate-400" : ""}>Tickets</TableHead>
                                        <TableHead className={theme === "dark" ? "text-slate-400" : ""}>Revenue</TableHead>
                                        <TableHead className={theme === "dark" ? "text-slate-400" : ""}>Status</TableHead>
                                        <TableHead className={`text-right ${theme === "dark" ? "text-slate-400" : ""}`}>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {myEvents.map((event) => (
                                        <TableRow key={event.id} className={theme === "dark" ? "border-slate-800" : ""}>
                                            <TableCell className={`font-medium ${theme === "dark" ? "text-slate-100" : ""}`}>{event.name}</TableCell>
                                            <TableCell>
                                                <div className={`flex items-center gap-2 ${theme === "dark" ? "text-slate-300" : ""}`}>
                                                    <CalendarDays className={`h-4 w-4 ${theme === "dark" ? "text-slate-500" : "text-muted-foreground"}`} />
                                                    {event.date}
                                                </div>
                                            </TableCell>
                                            <TableCell className={theme === "dark" ? "text-slate-300" : ""}>{event.attendees}</TableCell>
                                            <TableCell className={theme === "dark" ? "text-slate-300" : ""}>{event.tickets}</TableCell>
                                            <TableCell className={`font-medium ${theme === "dark" ? "text-slate-100" : ""}`}>{event.revenue}</TableCell>
                                            <TableCell>
                                                <StatusBadge status={event.status} />
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" className={`h-8 w-8 ${theme === "dark" ? "text-slate-400 hover:bg-slate-800" : ""}`}>
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className={`h-8 w-8 ${theme === "dark" ? "text-slate-400 hover:bg-slate-800" : ""}`}>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="attendees" className="space-y-4">
                    <Card className={theme === "dark" ? "border-slate-800 bg-slate-900" : ""}>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className={theme === "dark" ? "text-slate-100" : ""}>Recent Attendees</CardTitle>
                                <CardDescription className={theme === "dark" ? "text-slate-400" : ""}>Latest attendee registrations</CardDescription>
                            </div>
                            <Button variant="outline" size="sm" className={theme === "dark" ? "border-slate-700 hover:bg-slate-800 text-slate-200" : ""}>View All</Button>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow className={theme === "dark" ? "border-slate-800" : ""}>
                                        <TableHead className={theme === "dark" ? "text-slate-400" : ""}>Attendee</TableHead>
                                        <TableHead className={theme === "dark" ? "text-slate-400" : ""}>Event</TableHead>
                                        <TableHead className={theme === "dark" ? "text-slate-400" : ""}>Ticket Type</TableHead>
                                        <TableHead className={theme === "dark" ? "text-slate-400" : ""}>Status</TableHead>
                                        <TableHead className={`text-right ${theme === "dark" ? "text-slate-400" : ""}`}>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentAttendees.map((attendee) => (
                                        <TableRow key={attendee.id} className={theme === "dark" ? "border-slate-800" : ""}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className={`h-8 w-8 ${theme === "dark" ? "bg-slate-700" : ""}`}>
                                                        <AvatarFallback className={theme === "dark" ? "bg-slate-600 text-slate-200" : ""}>{attendee.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className={`font-medium ${theme === "dark" ? "text-slate-100" : ""}`}>{attendee.name}</p>
                                                        <p className={`text-xs ${theme === "dark" ? "text-slate-500" : "text-muted-foreground"}`}>{attendee.email}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className={theme === "dark" ? "text-slate-300" : ""}>{attendee.event}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={theme === "dark" ? "border-slate-700 text-slate-300" : ""}>{attendee.ticketType}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <StatusBadge status={attendee.status} />
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" className={`h-8 w-8 ${theme === "dark" ? "text-slate-400 hover:bg-slate-800" : ""}`}>
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className={`h-8 w-8 ${theme === "dark" ? "text-slate-400 hover:bg-slate-800" : ""}`}>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications" className="space-y-4">
                    <Card className={theme === "dark" ? "border-slate-800 bg-slate-900" : ""}>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className={theme === "dark" ? "text-slate-100" : ""}>Notifications</CardTitle>
                                <CardDescription className={theme === "dark" ? "text-slate-400" : ""}>Stay updated with your events</CardDescription>
                            </div>
                            <Button variant="outline" size="sm" className={theme === "dark" ? "border-slate-700 hover:bg-slate-800 text-slate-200" : ""}>Mark All Read</Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`flex items-start gap-4 p-4 rounded-lg border transition-colors cursor-pointer ${theme === "dark" ? "border-slate-800 hover:bg-slate-800/50" : ""}`}
                                    >
                                        <div className={`p-2 rounded-full ${notification.type === 'success' ? 'bg-green-500/10' :
                                            notification.type === 'warning' ? 'bg-yellow-500/10' :
                                                'bg-blue-500/10'
                                            }`}>
                                            {notification.type === 'success' ? (
                                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                            ) : notification.type === 'warning' ? (
                                                <XCircle className="h-4 w-4 text-yellow-500" />
                                            ) : (
                                                <Clock className="h-4 w-4 text-blue-500" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`font-medium ${theme === "dark" ? "text-slate-100" : ""}`}>{notification.title}</p>
                                            <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-muted-foreground"}`}>{notification.message}</p>
                                            <p className={`text-xs ${theme === "dark" ? "text-slate-500" : "text-muted-foreground"} mt-1`}>{notification.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Quick Actions Banner - Gradient CTA */}
            <Card className={theme === "dark" ? "bg-gradient-to-r from-red-900 to-slate-900 border-slate-800" : "bg-gradient-to-r from-red-600 to-red-700 border-0"}>
                <CardContent className="pt-6 pb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h3 className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-white"}`}>Ready to grow your audience?</h3>
                            <p className={theme === "dark" ? "text-slate-300 mt-1" : "text-white/80 mt-1"}>Create a new event and start selling tickets today.</p>
                        </div>
                        <Button className={theme === "dark" ? "bg-white text-slate-900 hover:bg-slate-100 font-semibold" : "bg-white text-red-600 hover:bg-gray-100 font-semibold"}>
                            <Plus className="h-5 w-5 mr-2" />
                            Create New Event
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
