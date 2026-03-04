"use client"

import { useEffect, useState, useCallback } from 'react'
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
    FileText,
    Image,
    Video,
    Search,
    Flag,
    CheckCircle,
    XCircle,
    Eye,
    Edit,
    Trash2,
    AlertTriangle,
    Loader2,
    RefreshCcw
} from "lucide-react"
import { adminApi } from '@/lib/api'

export default function AdminContentPage() {
    const { theme } = useTheme()
    const [reports, setReports] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [typeFilter, setTypeFilter] = useState('all')
    const [statusFilter, setStatusFilter] = useState('all')

    const fetchReports = useCallback(async () => {
        try {
            setLoading(true)
            const res = await adminApi.getReports({
                type: typeFilter === 'all' ? undefined : typeFilter,
                status: statusFilter === 'all' ? undefined : statusFilter
            })
            if (res.success) {
                setReports(res.data.reports)
            }
        } catch (err: any) {
            console.error('Error fetching reports:', err)
            setError(err.message || 'Failed to fetch reports')
        } finally {
            setLoading(false)
        }
    }, [typeFilter, statusFilter])

    useEffect(() => {
        fetchReports()
    }, [fetchReports])

    const handleUpdateStatus = async (reportId: number, status: string) => {
        try {
            const res = await adminApi.updateReportStatus(reportId, status)
            if (res.success) {
                setSuccessMessage(`Report ${status.toLowerCase()} successfully.`)
                setTimeout(() => setSuccessMessage(null), 3000)
                fetchReports()
            }
        } catch (err: any) {
            setError(err.message || 'Failed to update report status')
            setTimeout(() => setError(null), 3000)
        }
    }

    const filteredReports = reports.filter(item => {
        const matchesSearch = item.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.reporter_email && item.reporter_email.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesSearch;
    })

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            Pending: theme === "dark" ? "bg-yellow-900/30 text-yellow-400 border-yellow-800 font-normal" : "bg-yellow-100 text-yellow-700 border-yellow-200 font-normal",
            Resolved: theme === "dark" ? "bg-green-900/30 text-green-400 border-green-800 font-normal" : "bg-green-100 text-green-700 border-green-200 font-normal",
            Dismissed: theme === "dark" ? "bg-slate-800 text-slate-400 border-slate-700 font-normal" : "bg-slate-100 text-slate-700 border-slate-200 font-normal",
        };
        return styles[status] || styles.Pending;
    }

    const getTypeIcon = (type: string) => {
        const icons: Record<string, any> = {
            event: FileText,
            image: Image,
            video: Video,
            user: FileText,
            comment: FileText,
        };
        return icons[type] || FileText;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className={`text-3xl font-bold tracking-tight ${theme === "dark" ? "text-slate-100" : ""}`}>Content Moderation</h1>
                    <p className={theme === "dark" ? "text-slate-400" : "text-muted-foreground"}>Moderate and manage platform content reports</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={fetchReports} variant="outline" size="sm" className="flex items-center gap-2">
                        <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Notifications */}
            {successMessage && (
                <div className="bg-green-500/10 border border-green-500/20 text-green-500 px-4 py-2 rounded-lg text-sm">
                    {successMessage}
                </div>
            )}
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-2 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {/* Filters */}
            <Card className={theme === "dark" ? "border-slate-800 bg-slate-900" : ""}>
                <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${theme === "dark" ? "text-slate-400" : "text-muted-foreground"}`} />
                            <Input
                                placeholder="Search reports..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`pl-10 ${theme === "dark" ? "bg-slate-800 border-slate-700" : ""}`}
                            />
                        </div>
                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger className={`w-[180px] ${theme === "dark" ? "bg-slate-800 border-slate-700" : ""}`}>
                                <SelectValue placeholder="Filter by type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="event">Event</SelectItem>
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="comment">Comment</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className={`w-[180px] ${theme === "dark" ? "bg-slate-800 border-slate-700" : ""}`}>
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Resolved">Resolved</SelectItem>
                                <SelectItem value="Dismissed">Dismissed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Content Table */}
            <Card className={theme === "dark" ? "border-slate-800 bg-slate-900" : ""}>
                <CardHeader>
                    <CardTitle className={theme === "dark" ? "text-slate-100" : ""}>Reported Content</CardTitle>
                    <CardDescription className={theme === "dark" ? "text-slate-400" : ""}>Review and moderate reported items</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="relative overflow-x-auto rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow className={theme === "dark" ? "border-slate-800 hover:bg-transparent" : "hover:bg-transparent"}>
                                    <TableHead className={theme === "dark" ? "text-slate-400" : ""}>Reason / Content</TableHead>
                                    <TableHead className={theme === "dark" ? "text-slate-400" : ""}>Type</TableHead>
                                    <TableHead className={theme === "dark" ? "text-slate-400" : ""}>Reporter</TableHead>
                                    <TableHead className={theme === "dark" ? "text-slate-400" : ""}>Created</TableHead>
                                    <TableHead className={theme === "dark" ? "text-slate-400" : ""}>Status</TableHead>
                                    <TableHead className={`text-right ${theme === "dark" ? "text-slate-400" : ""}`}>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading && reports.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-20">
                                            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                                            <p className="mt-2 text-muted-foreground text-sm">Loading reports...</p>
                                        </TableCell>
                                    </TableRow>
                                ) : filteredReports.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-20 text-muted-foreground">
                                            No reports found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredReports.map((item) => {
                                        const TypeIcon = getTypeIcon(item.target_type)
                                        return (
                                            <TableRow key={item.id} className={theme === "dark" ? "border-slate-800" : ""}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2 rounded-lg ${theme === "dark" ? "bg-slate-800" : "bg-slate-100"}`}>
                                                            <TypeIcon className="h-4 w-4" />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className={`font-medium ${theme === "dark" ? "text-slate-100" : ""}`}>{item.reason}</span>
                                                            <span className="text-xs text-muted-foreground">ID: {item.target_id}</span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className={`capitalize ${theme === "dark" ? "text-slate-300" : ""}`}>{item.target_type}</TableCell>
                                                <TableCell className={theme === "dark" ? "text-slate-300" : ""}>{item.reporter_email || 'System'}</TableCell>
                                                <TableCell className={theme === "dark" ? "text-slate-300" : ""}>{new Date(item.created_at).toLocaleDateString()}</TableCell>
                                                <TableCell>
                                                    <Badge className={`${getStatusBadge(item.status)} border capitalize`}>
                                                        {item.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        {item.status === 'Pending' && (
                                                            <>
                                                                <Button
                                                                    onClick={() => handleUpdateStatus(item.id, 'Resolved')}
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 text-green-500 hover:text-green-600"
                                                                    title="Resolve"
                                                                >
                                                                    <CheckCircle className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    onClick={() => handleUpdateStatus(item.id, 'Dismissed')}
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 text-slate-500 hover:text-slate-600"
                                                                    title="Dismiss"
                                                                >
                                                                    <XCircle className="h-4 w-4" />
                                                                </Button>
                                                            </>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
