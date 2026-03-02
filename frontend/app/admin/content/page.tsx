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
    MoreHorizontal
} from "lucide-react"

// Mock content data
const mockContent = [
    { id: '1', title: 'Tech Conference 2026 Description', type: 'event', author: 'John Doe', status: 'published', flagCount: 0, createdAt: '2026-02-15', category: 'Events' },
    { id: '2', title: 'Inappropriate user profile image', type: 'image', author: 'spammer123', status: 'flagged', flagCount: 5, createdAt: '2026-02-20', category: 'User Content' },
    { id: '3', title: 'Music Festival Promo Video', type: 'video', author: 'Jane Smith', status: 'pending', flagCount: 0, createdAt: '2026-02-22', category: 'Marketing' },
    { id: '4', title: 'Suspicious event description', type: 'event', author: 'scammer999', status: 'flagged', flagCount: 12, createdAt: '2026-02-18', category: 'Events' },
    { id: '5', title: 'Art Workshop Details', type: 'event', author: 'Bob Wilson', status: 'published', flagCount: 0, createdAt: '2026-02-25', category: 'Events' },
    { id: '6', title: 'Offensive comment on event', type: 'text', author: 'angry_user', status: 'flagged', flagCount: 3, createdAt: '2026-02-28', category: 'Comments' },
]

export default function AdminContentPage() {
    const { theme } = useTheme()
    const [searchQuery, setSearchQuery] = useState('')
    const [typeFilter, setTypeFilter] = useState('all')
    const [statusFilter, setStatusFilter] = useState('all')

    const filteredContent = mockContent.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.author.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = typeFilter === 'all' || item.type === typeFilter;
        const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
        return matchesSearch && matchesType && matchesStatus;
    })

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            published: theme === "dark" ? "bg-green-900/30 text-green-400 border-green-800" : "bg-green-100 text-green-700 border-green-200",
            pending: theme === "dark" ? "bg-yellow-900/30 text-yellow-400 border-yellow-800" : "bg-yellow-100 text-yellow-700 border-yellow-200",
            flagged: theme === "dark" ? "bg-red-900/30 text-red-400 border-red-800" : "bg-red-100 text-red-700 border-red-200",
            draft: theme === "dark" ? "bg-slate-800 text-slate-400 border-slate-700" : "bg-slate-100 text-slate-700 border-slate-200",
        };
        return styles[status] || styles.draft;
    }

    const getTypeIcon = (type: string) => {
        const icons: Record<string, any> = {
            event: FileText,
            image: Image,
            video: Video,
            text: FileText,
        };
        return icons[type] || FileText;
    }

    const publishedCount = mockContent.filter(c => c.status === 'published').length
    const flaggedCount = mockContent.filter(c => c.status === 'flagged').length
    const pendingCount = mockContent.filter(c => c.status === 'pending').length

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className={`text-3xl font-bold tracking-tight ${theme === "dark" ? "text-slate-100" : ""}`}>Content Management</h1>
                    <p className={theme === "dark" ? "text-slate-400" : "text-muted-foreground"}>Moderate and manage platform content</p>
                </div>
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
                                <p className={`text-2xl font-bold ${theme === "dark" ? "text-slate-100" : ""}`}>{publishedCount}</p>
                                <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-muted-foreground"}`}>Published</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className={theme === "dark" ? "border-slate-800 bg-slate-900" : ""}>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-yellow-500/10">
                                <FileText className="h-6 w-6 text-yellow-500" />
                            </div>
                            <div>
                                <p className={`text-2xl font-bold ${theme === "dark" ? "text-slate-100" : ""}`}>{pendingCount}</p>
                                <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-muted-foreground"}`}>Pending Review</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className={theme === "dark" ? "border-slate-800 bg-slate-900" : ""}>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-red-500/10">
                                <Flag className="h-6 w-6 text-red-500" />
                            </div>
                            <div>
                                <p className={`text-2xl font-bold ${theme === "dark" ? "text-slate-100" : ""}`}>{flaggedCount}</p>
                                <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-muted-foreground"}`}>Flagged Content</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className={theme === "dark" ? "border-slate-800 bg-slate-900" : ""}>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-blue-500/10">
                                <FileText className="h-6 w-6 text-blue-500" />
                            </div>
                            <div>
                                <p className={`text-2xl font-bold ${theme === "dark" ? "text-slate-100" : ""}`}>{mockContent.length}</p>
                                <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-muted-foreground"}`}>Total Content</p>
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
                                placeholder="Search content..."
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
                                <SelectItem value="image">Image</SelectItem>
                                <SelectItem value="video">Video</SelectItem>
                                <SelectItem value="text">Text</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className={`w-[180px] ${theme === "dark" ? "bg-slate-800 border-slate-700" : ""}`}>
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="published">Published</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="flagged">Flagged</SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Content Table */}
            <Card className={theme === "dark" ? "border-slate-800 bg-slate-900" : ""}>
                <CardHeader>
                    <CardTitle className={theme === "dark" ? "text-slate-100" : ""}>All Content</CardTitle>
                    <CardDescription className={theme === "dark" ? "text-slate-400" : ""}>Review and moderate platform content</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className={theme === "dark" ? "border-slate-800" : ""}>
                                <TableHead className={theme === "dark" ? "text-slate-400" : ""}>Content</TableHead>
                                <TableHead className={theme === "dark" ? "text-slate-400" : ""}>Type</TableHead>
                                <TableHead className={theme === "dark" ? "text-slate-400" : ""}>Author</TableHead>
                                <TableHead className={theme === "dark" ? "text-slate-400" : ""}>Category</TableHead>
                                <TableHead className={theme === "dark" ? "text-slate-400" : ""}>Created</TableHead>
                                <TableHead className={theme === "dark" ? "text-slate-400" : ""}>Flags</TableHead>
                                <TableHead className={theme === "dark" ? "text-slate-400" : ""}>Status</TableHead>
                                <TableHead className={`text-right ${theme === "dark" ? "text-slate-400" : ""}`}>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredContent.map((item) => {
                                const TypeIcon = getTypeIcon(item.type)
                                return (
                                    <TableRow key={item.id} className={theme === "dark" ? "border-slate-800" : ""}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${theme === "dark" ? "bg-slate-800" : "bg-slate-100"}`}>
                                                    <TypeIcon className="h-4 w-4" />
                                                </div>
                                                <span className={`font-medium ${theme === "dark" ? "text-slate-100" : ""}`}>{item.title}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className={theme === "dark" ? "text-slate-300" : ""}>{item.type}</TableCell>
                                        <TableCell className={theme === "dark" ? "text-slate-300" : ""}>{item.author}</TableCell>
                                        <TableCell className={theme === "dark" ? "text-slate-300" : ""}>{item.category}</TableCell>
                                        <TableCell className={theme === "dark" ? "text-slate-300" : ""}>{item.createdAt}</TableCell>
                                        <TableCell>
                                            {item.flagCount > 0 ? (
                                                <div className="flex items-center gap-1 text-red-500">
                                                    <Flag className="h-4 w-4" />
                                                    <span>{item.flagCount}</span>
                                                </div>
                                            ) : (
                                                <span className={theme === "dark" ? "text-slate-500" : "text-muted-foreground"}>0</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={`${getStatusBadge(item.status)} border capitalize`}>
                                                {item.status}
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
                                                {item.status === 'flagged' && (
                                                    <>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-green-500 hover:text-green-600">
                                                            <CheckCircle className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600">
                                                            <Trash2 className="h-4 w-4" />
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
