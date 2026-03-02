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
    TrendingDown,
    Eye,
    Edit,
    Trash2,
    MoreHorizontal,
    FileText,
    AlertCircle,
    CheckCircle2,
    Clock,
    XCircle
} from "lucide-react"

// Recent Events Data
const recentEvents = [
    { id: 1, name: "Tech Conference 2026", date: "Mar 15, 2026", attendees: 450, status: "active", revenue: "$12,500" },
    { id: 2, name: "Music Festival", date: "Mar 20, 2026", attendees: 1200, status: "active", revenue: "$35,000" },
    { id: 3, name: "Business Workshop", date: "Mar 22, 2026", attendees: 85, status: "pending", revenue: "$4,250" },
    { id: 4, name: "Art Exhibition", date: "Mar 25, 2026", attendees: 200, status: "active", revenue: "$8,000" },
    { id: 5, name: "Sports Tournament", date: "Mar 28, 2026", attendees: 350, status: "draft", revenue: "$0" },
]

// Recent Users Data
const recentUsers = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Organizer", joined: "2 hours ago", avatar: "" },
    { id: 2, name: "Sarah Wilson", email: "sarah@example.com", role: "Attendee", joined: "5 hours ago", avatar: "" },
    { id: 3, name: "Mike Johnson", email: "mike@example.com", role: "Organizer", joined: "1 day ago", avatar: "" },
    { id: 4, name: "Emily Brown", email: "emily@example.com", role: "Attendee", joined: "2 days ago", avatar: "" },
    { id: 5, name: "David Lee", email: "david@example.com", role: "Attendee", joined: "3 days ago", avatar: "" },
]

// Audit Trail Data
const auditTrail = [
    { id: 1, action: "User Login", user: "admin@eventmate.com", ip: "192.168.1.1", time: "10 mins ago", status: "success" },
    { id: 2, action: "Event Created", user: "john@example.com", ip: "192.168.1.45", time: "1 hour ago", status: "success" },
    { id: 3, action: "User Deleted", user: "admin@eventmate.com", ip: "192.168.1.1", time: "2 hours ago", status: "warning" },
    { id: 4, action: "Content Updated", user: "sarah@example.com", ip: "192.168.1.78", time: "3 hours ago", status: "success" },
    { id: 5, action: "Failed Login", user: "unknown", ip: "192.168.1.200", time: "5 hours ago", status: "error" },
]


function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        active: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
        pending: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
        draft: "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20",
        success: "bg-green-500/10 text-green-500",
        warning: "bg-yellow-500/10 text-yellow-500",
        error: "bg-red-500/10 text-red-500",
    }

    return (
        <Badge className={styles[status] || styles.active} >
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
    )
}

export default function AdminDashboard() {
    const { theme } = useTheme()

    return (
        <div className="space-y-6">
            {/* Page Header - Visual Hierarchy */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className={`text-3xl font-bold tracking-tight ${theme === "dark" ? "text-slate-100" : ""}`}>Admin Dashboard</h1>
                    <p className={theme === "dark" ? "text-slate-400" : "text-muted-foreground"}>Monitor and manage your platform</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className={theme === "dark" ? "border-slate-700 hover:bg-slate-800 text-slate-200" : ""}>
                        <FileText className="h-4 w-4 mr-2" />
                        Export Report
                    </Button>
                    <Button className={theme === "dark" ? "bg-primary text-primary-foreground" : ""}>
                        <Calendar className="h-4 w-4 mr-2" />
                        Create Event
                    </Button>
                </div>
            </div>

            {/* Stats Grid - 30-60-10 Design */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className={`border-l-4 border-l-blue-500 transition-all duration-200 hover:shadow-lg ${theme === "dark" ? "border-slate-800 bg-slate-900" : ""}`}>
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                            <div className="space-y-2">
                                <p className={`text-sm font-medium ${theme === "dark" ? "text-slate-400" : "text-muted-foreground"}`}>Total Users</p>
                                <p className={`text-3xl font-bold ${theme === "dark" ? "text-slate-100" : ""}`}>12,453</p>
                            </div>
                            <div className="p-3 rounded-xl bg-blue-500/10">
                                <Users className="h-6 w-6 text-blue-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className={`border-l-4 border-l-green-500 transition-all duration-200 hover:shadow-lg ${theme === "dark" ? "border-slate-800 bg-slate-900" : ""}`}>
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                            <div className="space-y-2">
                                <p className={`text-sm font-medium ${theme === "dark" ? "text-slate-400" : "text-muted-foreground"}`}>Active Users</p>
                                <p className={`text-3xl font-bold ${theme === "dark" ? "text-slate-100" : ""}`}>8,234</p>
                            </div>
                            <div className="p-3 rounded-xl bg-green-500/10">
                                <TrendingUp className="h-6 w-6 text-green-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className={`border-l-4 border-l-purple-500 transition-all duration-200 hover:shadow-lg ${theme === "dark" ? "border-slate-800 bg-slate-900" : ""}`}>
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                            <div className="space-y-2">
                                <p className={`text-sm font-medium ${theme === "dark" ? "text-slate-400" : "text-muted-foreground"}`}>Total Events</p>
                                <p className={`text-3xl font-bold ${theme === "dark" ? "text-slate-100" : ""}`}>456</p>
                            </div>
                            <div className="p-3 rounded-xl bg-purple-500/10">
                                <Calendar className="h-6 w-6 text-purple-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className={`border-l-4 border-l-orange-500 transition-all duration-200 hover:shadow-lg ${theme === "dark" ? "border-slate-800 bg-slate-900" : ""}`}>
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                            <div className="space-y-2">
                                <p className={`text-sm font-medium ${theme === "dark" ? "text-slate-400" : "text-muted-foreground"}`}>Total Revenue</p>
                                <p className={`text-3xl font-bold ${theme === "dark" ? "text-slate-100" : ""}`}>$234,567</p>
                            </div>
                            <div className="p-3 rounded-xl bg-orange-500/10">
                                <DollarSign className="h-6 w-6 text-orange-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts & Tables */}
            <div className="grid gap-4 lg:grid-cols-7">
                {/* Main Chart Area */}
                <Card className={`lg:col-span-4 ${theme === "dark" ? "border-slate-800 bg-slate-900" : ""}`}>
                    <CardHeader>
                        <CardTitle className={theme === "dark" ? "text-slate-100" : ""}>Overview</CardTitle>
                        <CardDescription className={theme === "dark" ? "text-slate-400" : ""}>Platform performance over the last 6 months</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className={`h-[300px] flex items-center justify-center rounded-lg ${theme === "dark" ? "bg-slate-800/50" : "bg-muted/30"}`}>
                            <div className="text-center space-y-2">
                                <TrendingUp className={`h-12 w-12 mx-auto ${theme === "dark" ? "text-slate-600" : "text-muted-foreground/50"}`} />
                                <p className={theme === "dark" ? "text-slate-500" : "text-muted-foreground"}>Chart visualization would appear here</p>
                                <p className={`text-sm ${theme === "dark" ? "text-slate-600" : "text-muted-foreground/70"}`}>Connect to your analytics provider</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className={`lg:col-span-3 ${theme === "dark" ? "border-slate-800 bg-slate-900" : ""}`}>
                    <CardHeader>
                        <CardTitle className={theme === "dark" ? "text-slate-100" : ""}>Recent Activity</CardTitle>
                        <CardDescription className={theme === "dark" ? "text-slate-400" : ""}>Latest platform activities</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { icon: Users, title: "New user registered", time: "5 mins ago", color: "bg-blue-500" },
                                { icon: Calendar, title: "Event created: Tech Conference", time: "1 hour ago", color: "bg-purple-500" },
                                { icon: Ticket, title: "50 tickets purchased", time: "2 hours ago", color: "bg-green-500" },
                                { icon: DollarSign, title: "Revenue: $1,234", time: "3 hours ago", color: "bg-orange-500" },
                                { icon: AlertCircle, title: "New report submitted", time: "5 hours ago", color: "bg-yellow-500" },
                            ].map((activity, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <div className={`p-2 rounded-full ${activity.color}/10`}>
                                        <activity.icon className={`h-4 w-4 ${activity.color.replace('bg-', 'text-')}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-medium truncate ${theme === "dark" ? "text-slate-200" : ""}`}>{activity.title}</p>
                                        <p className={`text-xs ${theme === "dark" ? "text-slate-500" : "text-muted-foreground"}`}>{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Data Tables */}
            <Tabs defaultValue="events" className="space-y-4">
                <TabsList className={theme === "dark" ? "bg-slate-800" : ""}>
                    <TabsTrigger value="events" className={theme === "dark" ? "data-[state=active]:bg-slate-700 data-[state=active]:text-slate-100" : ""}>Recent Events</TabsTrigger>
                    <TabsTrigger value="pending" className={theme === "dark" ? "data-[state=active]:bg-slate-700 data-[state=active]:text-slate-100" : ""}>Pending Approvals</TabsTrigger>
                    <TabsTrigger value="users" className={theme === "dark" ? "data-[state=active]:bg-slate-700 data-[state=active]:text-slate-100" : ""}>Recent Users</TabsTrigger>
                    <TabsTrigger value="audit" className={theme === "dark" ? "data-[state=active]:bg-slate-700 data-[state=active]:text-slate-100" : ""}>Audit Trail</TabsTrigger>
                </TabsList>

                <TabsContent value="events" className="space-y-4">
                    <Card className={theme === "dark" ? "border-slate-800 bg-slate-900" : ""}>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className={theme === "dark" ? "text-slate-100" : ""}>Recent Events</CardTitle>
                                <CardDescription className={theme === "dark" ? "text-slate-400" : ""}>Manage your recent events</CardDescription>
                            </div>
                            <Button variant="outline" size="sm" className={theme === "dark" ? "border-slate-700 hover:bg-slate-800 text-slate-200" : ""}>View All</Button>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow className={theme === "dark" ? "border-slate-800" : ""}>
                                        <TableHead className={theme === "dark" ? "text-slate-400" : ""}>Event Name</TableHead>
                                        <TableHead className={theme === "dark" ? "text-slate-400" : ""}>Date</TableHead>
                                        <TableHead className={theme === "dark" ? "text-slate-400" : ""}>Attendees</TableHead>
                                        <TableHead className={theme === "dark" ? "text-slate-400" : ""}>Revenue</TableHead>
                                        <TableHead className={theme === "dark" ? "text-slate-400" : ""}>Status</TableHead>
                                        <TableHead className={`text-right ${theme === "dark" ? "text-slate-400" : ""}`}>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentEvents.map((event) => (
                                        <TableRow key={event.id} className={theme === "dark" ? "border-slate-800" : ""}>
                                            <TableCell className={`font-medium ${theme === "dark" ? "text-slate-100" : ""}`}>{event.name}</TableCell>
                                            <TableCell className={theme === "dark" ? "text-slate-300" : ""}>{event.date}</TableCell>
                                            <TableCell className={theme === "dark" ? "text-slate-300" : ""}>{event.attendees}</TableCell>
                                            <TableCell className={theme === "dark" ? "text-slate-300" : ""}>{event.revenue}</TableCell>
                                            <TableCell>
                                                <StatusBadge status={event.status} />
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button variant="ghost" size="icon" className={`h-8 w-8 ${theme === "dark" ? "text-slate-400 hover:bg-slate-800" : ""}`}>
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className={`h-8 w-8 ${theme === "dark" ? "text-slate-400 hover:bg-slate-800" : ""}`}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className={`h-8 w-8 text-destructive ${theme === "dark" ? "hover:bg-slate-800" : ""}`}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="users" className="space-y-4">
                    <Card className={theme === "dark" ? "border-slate-800 bg-slate-900" : ""}>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className={theme === "dark" ? "text-slate-100" : ""}>Recent Users</CardTitle>
                                <CardDescription className={theme === "dark" ? "text-slate-400" : ""}>Latest user registrations</CardDescription>
                            </div>
                            <Button variant="outline" size="sm" className={theme === "dark" ? "border-slate-700 hover:bg-slate-800 text-slate-200" : ""}>View All</Button>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow className={theme === "dark" ? "border-slate-800" : ""}>
                                        <TableHead className={theme === "dark" ? "text-slate-400" : ""}>User</TableHead>
                                        <TableHead className={theme === "dark" ? "text-slate-400" : ""}>Role</TableHead>
                                        <TableHead className={theme === "dark" ? "text-slate-400" : ""}>Joined</TableHead>
                                        <TableHead className={`text-right ${theme === "dark" ? "text-slate-400" : ""}`}>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentUsers.map((user) => (
                                        <TableRow key={user.id} className={theme === "dark" ? "border-slate-800" : ""}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className={`h-8 w-8 ${theme === "dark" ? "bg-slate-700" : ""}`}>
                                                        <AvatarFallback className={theme === "dark" ? "bg-slate-600 text-slate-200" : ""}>{user.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className={`font-medium ${theme === "dark" ? "text-slate-100" : ""}`}>{user.name}</p>
                                                        <p className={`text-xs ${theme === "dark" ? "text-slate-500" : "text-muted-foreground"}`}>{user.email}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={user.role === "Organizer" ? "default" : "secondary"} className={theme === "dark" ? "bg-slate-800" : ""}>
                                                    {user.role}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className={theme === "dark" ? "text-slate-400" : "text-muted-foreground"}>{user.joined}</TableCell>
                                            <TableCell className="text-right">
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

                <TabsContent value="pending" className="space-y-4">
                    <Card className={theme === "dark" ? "border-slate-800 bg-slate-900" : ""}>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className={theme === "dark" ? "text-slate-100" : ""}>Pending Event Approvals</CardTitle>
                                <CardDescription className={theme === "dark" ? "text-slate-400" : ""}>Events waiting for admin review</CardDescription>
                            </div>
                            <Button variant="outline" size="sm" className={theme === "dark" ? "border-slate-700 hover:bg-slate-800 text-slate-200" : ""}>View All Pending</Button>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow className={theme === "dark" ? "border-slate-800" : ""}>
                                        <TableHead className={theme === "dark" ? "text-slate-400" : ""}>Event</TableHead>
                                        <TableHead className={theme === "dark" ? "text-slate-400" : ""}>Organizer</TableHead>
                                        <TableHead className={theme === "dark" ? "text-slate-400" : ""}>Date</TableHead>
                                        <TableHead className={theme === "dark" ? "text-slate-400" : ""}>Type</TableHead>
                                        <TableHead className={`text-right ${theme === "dark" ? "text-slate-400" : ""}`}>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {[
                                        { id: '1', title: 'Tech Conference 2026', organizer: 'John Doe', date: '2026-03-15', type: 'event' },
                                        { id: '2', title: 'Art Workshop', organizer: 'Jane Smith', date: '2026-03-20', type: 'event' },
                                        { id: '3', title: 'Business Summit', organizer: 'Bob Wilson', date: '2026-04-01', type: 'event' },
                                    ].map((event) => (
                                        <TableRow key={event.id} className={theme === "dark" ? "border-slate-800" : ""}>
                                            <TableCell className={`font-medium ${theme === "dark" ? "text-slate-100" : ""}`}>{event.title}</TableCell>
                                            <TableCell className={theme === "dark" ? "text-slate-300" : ""}>{event.organizer}</TableCell>
                                            <TableCell className={theme === "dark" ? "text-slate-400" : ""}>{event.date}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={theme === "dark" ? "border-slate-700 text-slate-300" : ""}>{event.type}</Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        className={theme === "dark" ? "bg-green-600 hover:bg-green-700 text-white" : "bg-green-600 hover:bg-green-700 text-white"}
                                                    >
                                                        <CheckCircle2 className="h-4 w-4 mr-1" />
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className={theme === "dark" ? "border-red-800 text-red-400 hover:bg-red-900/20" : "text-red-600 border-red-200 hover:bg-red-50"}
                                                    >
                                                        <XCircle className="h-4 w-4 mr-1" />
                                                        Reject
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="audit" className="space-y-4">
                    <Card className={theme === "dark" ? "border-slate-800 bg-slate-900" : ""}>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className={theme === "dark" ? "text-slate-100" : ""}>Audit Trail</CardTitle>
                                <CardDescription className={theme === "dark" ? "text-slate-400" : ""}>System activity log</CardDescription>
                            </div>
                            <Button variant="outline" size="sm" className={theme === "dark" ? "border-slate-700 hover:bg-slate-800 text-slate-200" : ""}>Export Logs</Button>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow className={theme === "dark" ? "border-slate-800" : ""}>
                                        <TableHead className={theme === "dark" ? "text-slate-400" : ""}>Action</TableHead>
                                        <TableHead className={theme === "dark" ? "text-slate-400" : ""}>User</TableHead>
                                        <TableHead className={theme === "dark" ? "text-slate-400" : ""}>IP Address</TableHead>
                                        <TableHead className={theme === "dark" ? "text-slate-400" : ""}>Time</TableHead>
                                        <TableHead className={theme === "dark" ? "text-slate-400" : ""}>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {auditTrail.map((log) => (
                                        <TableRow key={log.id} className={theme === "dark" ? "border-slate-800" : ""}>
                                            <TableCell className={`font-medium ${theme === "dark" ? "text-slate-100" : ""}`}>{log.action}</TableCell>
                                            <TableCell className={theme === "dark" ? "text-slate-400" : "text-muted-foreground"}>{log.user}</TableCell>
                                            <TableCell className={`font-mono text-xs ${theme === "dark" ? "text-slate-400" : ""}`}>{log.ip}</TableCell>
                                            <TableCell className={theme === "dark" ? "text-slate-400" : "text-muted-foreground"}>{log.time}</TableCell>
                                            <TableCell>
                                                <StatusBadge status={log.status} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
