"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"
import {
    Bell,
    CheckCircle,
    XCircle,
    Clock,
    Calendar,
    Users,
    Ticket,
    DollarSign,
    AlertTriangle,
    Info,
    CheckSquare,
    Trash2,
    Eye
} from "lucide-react"

// Mock notifications data
const mockNotifications = [
    { id: '1', title: 'New ticket purchase', message: 'Alice Johnson purchased a VIP ticket for Tech Conference 2026', time: '5 mins ago', type: 'success', read: false },
    { id: '2', title: 'Event reminder', message: 'Tech Conference 2026 starts in 3 days', time: '1 hour ago', type: 'info', read: false },
    { id: '3', title: 'Payment received', message: 'Payment of $500 received from Bob Smith', time: '2 hours ago', type: 'success', read: true },
    { id: '4', title: 'Refund request', message: 'Bob Smith requested a refund for Music Festival', time: '3 hours ago', type: 'warning', read: false },
    { id: '5', title: 'Attendee check-in', message: '50 attendees checked in to Tech Conference 2026', time: '5 hours ago', type: 'info', read: true },
    { id: '6', title: 'Event approved', message: 'Your event "Art Workshop" has been approved', time: '1 day ago', type: 'success', read: true },
    { id: '7', title: 'New registration', message: 'New attendee registered for Music Festival', time: '1 day ago', type: 'info', read: true },
    { id: '8', title: 'Low capacity warning', message: 'Art Workshop is 90% full', time: '2 days ago', type: 'warning', read: true },
]

export default function OrganiserNotificationsPage() {
    const { theme } = useTheme()
    const [notifications, setNotifications] = useState(mockNotifications)
    const [filter, setFilter] = useState<'all' | 'unread'>('all')

    const filteredNotifications = notifications.filter(n => {
        if (filter === 'unread') return !n.read;
        return true;
    })

    const getTypeIcon = (type: string) => {
        const icons: Record<string, any> = {
            success: CheckCircle,
            warning: AlertTriangle,
            info: Info,
            error: XCircle,
        };
        return icons[type] || Info;
    }

    const getTypeStyles = (type: string) => {
        const styles: Record<string, string> = {
            success: theme === "dark" ? "bg-green-900/20 text-green-400" : "bg-green-100 text-green-600",
            warning: theme === "dark" ? "bg-yellow-900/20 text-yellow-400" : "bg-yellow-100 text-yellow-600",
            info: theme === "dark" ? "bg-blue-900/20 text-blue-400" : "bg-blue-100 text-blue-600",
            error: theme === "dark" ? "bg-red-900/20 text-red-400" : "bg-red-100 text-red-600",
        };
        return styles[type] || styles.info;
    }

    const markAsRead = (id: string) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n))
    }

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })))
    }

    const deleteNotification = (id: string) => {
        setNotifications(notifications.filter(n => n.id !== id))
    }

    const unreadCount = notifications.filter(n => !n.read).length
    const successCount = notifications.filter(n => n.type === 'success').length
    const warningCount = notifications.filter(n => n.type === 'warning').length

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className={`text-3xl font-bold tracking-tight ${theme === "dark" ? "text-slate-100" : ""}`}>Notifications</h1>
                    <p className={theme === "dark" ? "text-slate-400" : "text-muted-foreground"}>Stay updated with your events</p>
                </div>
                {unreadCount > 0 && (
                    <Button variant="outline" onClick={markAllAsRead} className={theme === "dark" ? "border-slate-700 hover:bg-slate-800" : ""}>
                        <CheckSquare className="h-4 w-4 mr-2" />
                        Mark All Read
                    </Button>
                )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <Card className={theme === "dark" ? "border-slate-800 bg-slate-900" : ""}>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-red-500/10">
                                <Bell className="h-6 w-6 text-red-500" />
                            </div>
                            <div>
                                <p className={`text-2xl font-bold ${theme === "dark" ? "text-slate-100" : ""}`}>{unreadCount}</p>
                                <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-muted-foreground"}`}>Unread</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className={theme === "dark" ? "border-slate-800 bg-slate-900" : ""}>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-green-500/10">
                                <CheckCircle className="h-6 w-6 text-green-500" />
                            </div>
                            <div>
                                <p className={`text-2xl font-bold ${theme === "dark" ? "text-slate-100" : ""}`}>{successCount}</p>
                                <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-muted-foreground"}`}>Success</p>
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
                            <div className="p-3 rounded-xl bg-blue-500/10">
                                <Bell className="h-6 w-6 text-blue-500" />
                            </div>
                            <div>
                                <p className={`text-2xl font-bold ${theme === "dark" ? "text-slate-100" : ""}`}>{notifications.length}</p>
                                <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-muted-foreground"}`}>Total</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Notifications List */}
            <Card className={theme === "dark" ? "border-slate-800 bg-slate-900" : ""}>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className={theme === "dark" ? "text-slate-100" : ""}>All Notifications</CardTitle>
                        <CardDescription className={theme === "dark" ? "text-slate-400" : ""}>Your recent notifications</CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant={filter === 'all' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setFilter('all')}
                            className={theme === "dark" ? (filter === 'all' ? "bg-primary" : "border-slate-700") : ""}
                        >
                            All
                        </Button>
                        <Button
                            variant={filter === 'unread' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setFilter('unread')}
                            className={theme === "dark" ? (filter === 'unread' ? "bg-primary" : "border-slate-700") : ""}
                        >
                            Unread ({unreadCount})
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {filteredNotifications.map((notification) => {
                            const TypeIcon = getTypeIcon(notification.type)
                            return (
                                <div
                                    key={notification.id}
                                    className={`flex items-start gap-4 p-4 rounded-lg border transition-colors cursor-pointer ${theme === "dark"
                                            ? notification.read
                                                ? "border-slate-800 hover:bg-slate-800/50"
                                                : "border-slate-700 bg-slate-800/30 hover:bg-slate-800/70"
                                            : notification.read
                                                ? "border-gray-200 hover:bg-gray-50"
                                                : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                                        }`}
                                    onClick={() => markAsRead(notification.id)}
                                >
                                    <div className={`p-2 rounded-full ${getTypeStyles(notification.type)}`}>
                                        <TypeIcon className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className={`font-medium ${theme === "dark" ? "text-slate-100" : ""}`}>{notification.title}</p>
                                            {!notification.read && (
                                                <div className="w-2 h-2 rounded-full bg-red-500" />
                                            )}
                                        </div>
                                        <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-muted-foreground"} mt-1`}>{notification.message}</p>
                                        <p className={`text-xs ${theme === "dark" ? "text-slate-500" : "text-muted-foreground"} mt-2`}>{notification.time}</p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button variant="ghost" size="icon" className={`h-8 w-8 ${theme === "dark" ? "text-slate-400 hover:bg-slate-800" : ""}`}>
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className={`h-8 w-8 ${theme === "dark" ? "text-slate-400 hover:bg-slate-800" : ""}`} onClick={(e) => { e.stopPropagation(); deleteNotification(notification.id); }}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )
                        })}
                        {filteredNotifications.length === 0 && (
                            <div className="text-center py-12">
                                <Bell className={`h-12 w-12 mx-auto mb-4 ${theme === "dark" ? "text-slate-600" : "text-muted-foreground"}`} />
                                <p className={theme === "dark" ? "text-slate-400" : "text-muted-foreground"}>No notifications</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
