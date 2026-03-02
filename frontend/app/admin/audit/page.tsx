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
    Search,
    Download,
    Filter,
    User,
    Calendar,
    LogIn,
    LogOut,
    Edit,
    Trash2,
    Shield,
    Settings,
    Bell,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Clock
} from "lucide-react"

// Mock audit data
const mockAuditLogs = [
    { id: '1', action: 'User Login', user: 'admin@eventmate.com', ip: '192.168.1.100', timestamp: '2026-03-02 09:45:32', status: 'success', category: 'Authentication' },
    { id: '2', action: 'Event Created', user: 'john.doe@email.com', ip: '192.168.1.45', timestamp: '2026-03-02 09:30:15', status: 'success', category: 'Events' },
    { id: '3', action: 'User Deleted', user: 'admin@eventmate.com', ip: '192.168.1.100', timestamp: '2026-03-02 08:15:00', status: 'warning', category: 'Users' },
    { id: '4', action: 'Content Updated', user: 'sarah.wilson@email.com', ip: '192.168.1.78', timestamp: '2026-03-02 07:45:22', status: 'success', category: 'Content' },
    { id: '5', action: 'Failed Login Attempt', user: 'unknown', ip: '192.168.1.200', timestamp: '2026-03-02 06:20:10', status: 'error', category: 'Authentication' },
    { id: '6', action: 'User Role Changed', user: 'admin@eventmate.com', ip: '192.168.1.100', timestamp: '2026-03-01 22:30:45', status: 'success', category: 'Users' },
    { id: '7', action: 'Event Approved', user: 'admin@eventmate.com', ip: '192.168.1.100', timestamp: '2026-03-01 20:15:33', status: 'success', category: 'Events' },
    { id: '8', action: 'Settings Modified', user: 'admin@eventmate.com', ip: '192.168.1.100', timestamp: '2026-03-01 18:00:00', status: 'success', category: 'Settings' },
    { id: '9', action: 'Password Reset', user: 'mike.johnson@email.com', ip: '192.168.1.55', timestamp: '2026-03-01 15:45:18', status: 'success', category: 'Authentication' },
    { id: '10', action: 'Unauthorized Access Attempt', user: 'unknown', ip: '192.168.1.250', timestamp: '2026-03-01 12:30:00', status: 'error', category: 'Security' },
]

export default function AdminAuditPage() {
    const { theme } = useTheme()
    const [searchQuery, setSearchQuery] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('all')
    const [statusFilter, setStatusFilter] = useState('all')

    const filteredLogs = mockAuditLogs.filter(log => {
        const matchesSearch = log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.ip.includes(searchQuery);
        const matchesCategory = categoryFilter === 'all' || log.category === categoryFilter;
        const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
        return matchesSearch && matchesCategory && matchesStatus;
    })

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            success: theme === "dark" ? "bg-green-900/30 text-green-400 border-green-800" : "bg-green-100 text-green-700 border-green-200",
            warning: theme === "dark" ? "bg-yellow-900/30 text-yellow-400 border-yellow-800" : "bg-yellow-100 text-yellow-700 border-yellow-200",
            error: theme === "dark" ? "bg-red-900/30 text-red-400 border-red-800" : "bg-red-100 text-red-700 border-red-200",
        };
        return styles[status] || styles.success;
    }

    const getCategoryIcon = (category: string) => {
        const icons: Record<string, any> = {
            Authentication: LogIn,
            Events: Calendar,
            Users: User,
            Content: Edit,
            Settings: Settings,
            Security: Shield,
        };
        return icons[category] || LogIn;
    }

    const successCount = mockAuditLogs.filter(l => l.status === 'success').length
    const warningCount = mockAuditLogs.filter(l => l.status === 'warning').length
    const errorCount = mockAuditLogs.filter(l => l.status === 'error').length

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className={`text-3xl font-bold tracking-tight ${theme === "dark" ? "text-slate-100" : ""}`}>Audit Trail</h1>
                    <p className={theme === "dark" ? "text-slate-400" : "text-muted-foreground"}>Track and monitor system activities</p>
                </div>
                <Button variant="outline" className={theme === "dark" ? "border-slate-700 hover:bg-slate-800" : ""}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Logs
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
                                <p className={`text-2xl font-bold ${theme === "dark" ? "text-slate-100" : ""}`}>{successCount}</p>
                                <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-muted-foreground"}`}>Successful</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className={theme === "dark" ? "border-slate-800 bg-slate-900" : ""}>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-yellow-500/10">
                                <AlertTriangle className="h-6 w-6 text-yellow-500" />
                            </div>
                            <div>
                                <p className={`text-2xl font-bold ${theme === "dark" ? "text-slate-100" : ""}`}>{warningCount}</p>
                                <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-muted-foreground"}`}>Warnings</p>
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
                                <p className={`text-2xl font-bold ${theme === "dark" ? "text-slate-100" : ""}`}>{errorCount}</p>
                                <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-muted-foreground"}`}>Errors</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className={theme === "dark" ? "border-slate-800 bg-slate-900" : ""}>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-blue-500/10">
                                <Clock className="h-6 w-6 text-blue-500" />
                            </div>
                            <div>
                                <p className={`text-2xl font-bold ${theme === "dark" ? "text-slate-100" : ""}`}>{mockAuditLogs.length}</p>
                                <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-muted-foreground"}`}>Total Logs</p>
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
                                placeholder="Search by action, user, or IP..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`pl-10 ${theme === "dark" ? "bg-slate-800 border-slate-700" : ""}`}
                            />
                        </div>
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className={`w-[180px] ${theme === "dark" ? "bg-slate-800 border-slate-700" : ""}`}>
                                <SelectValue placeholder="Filter by category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                <SelectItem value="Authentication">Authentication</SelectItem>
                                <SelectItem value="Events">Events</SelectItem>
                                <SelectItem value="Users">Users</SelectItem>
                                <SelectItem value="Content">Content</SelectItem>
                                <SelectItem value="Settings">Settings</SelectItem>
                                <SelectItem value="Security">Security</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className={`w-[180px] ${theme === "dark" ? "bg-slate-800 border-slate-700" : ""}`}>
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="success">Success</SelectItem>
                                <SelectItem value="warning">Warning</SelectItem>
                                <SelectItem value="error">Error</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Audit Logs Table */}
            <Card className={theme === "dark" ? "border-slate-800 bg-slate-900" : ""}>
                <CardHeader>
                    <CardTitle className={theme === "dark" ? "text-slate-100" : ""}>System Activity Log</CardTitle>
                    <CardDescription className={theme === "dark" ? "text-slate-400" : ""}>Complete audit trail of all system activities</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className={theme === "dark" ? "border-slate-800" : ""}>
                                <TableHead className={theme === "dark" ? "text-slate-400" : ""}>Action</TableHead>
                                <TableHead className={theme === "dark" ? "text-slate-400" : ""}>Category</TableHead>
                                <TableHead className={theme === "dark" ? "text-slate-400" : ""}>User</TableHead>
                                <TableHead className={theme === "dark" ? "text-slate-400" : ""}>IP Address</TableHead>
                                <TableHead className={theme === "dark" ? "text-slate-400" : ""}>Timestamp</TableHead>
                                <TableHead className={theme === "dark" ? "text-slate-400" : ""}>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredLogs.map((log) => {
                                const CategoryIcon = getCategoryIcon(log.category)
                                return (
                                    <TableRow key={log.id} className={theme === "dark" ? "border-slate-800" : ""}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${theme === "dark" ? "bg-slate-800" : "bg-slate-100"}`}>
                                                    <CategoryIcon className="h-4 w-4" />
                                                </div>
                                                <span className={`font-medium ${theme === "dark" ? "text-slate-100" : ""}`}>{log.action}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className={theme === "dark" ? "text-slate-300" : ""}>{log.category}</TableCell>
                                        <TableCell className={theme === "dark" ? "text-slate-300" : ""}>{log.user}</TableCell>
                                        <TableCell className={`font-mono text-sm ${theme === "dark" ? "text-slate-400" : ""}`}>{log.ip}</TableCell>
                                        <TableCell className={theme === "dark" ? "text-slate-300" : ""}>{log.timestamp}</TableCell>
                                        <TableCell>
                                            <Badge className={`${getStatusBadge(log.status)} border capitalize`}>
                                                {log.status}
                                            </Badge>
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
