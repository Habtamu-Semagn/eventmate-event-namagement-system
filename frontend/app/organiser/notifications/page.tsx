"use client"

import { useState, useEffect } from 'react'
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
    Eye,
    Loader2
} from "lucide-react"
import { notificationsApi, Notification } from '@/lib/api'

export default function OrganiserNotificationsPage() {
    const { theme } = useTheme()
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [filter, setFilter] = useState<'all' | 'unread'>('all')

    useEffect(() => {
        fetchNotifications()
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true)
            const response = await notificationsApi.getMyNotifications()
            if (response.success) {
                setNotifications(response.data.notifications)
            }
        } catch (err: any) {
            console.error('Failed to fetch notifications:', err)
            setError('Failed to load notifications')
        } finally {
            setLoading(false)
        }
    }

    const filteredNotifications = notifications.filter(n => {
        if (filter === 'unread') return !n.is_read;
        return true;
    })

    const getTypeIcon = (message: string) => {
        const msg = message.toLowerCase();
        if (msg.includes('approved') || msg.includes('success') || msg.includes('received')) return CheckCircle;
        if (msg.includes('warning') || msg.includes('refund')) return AlertTriangle;
        if (msg.includes('error') || msg.includes('failed')) return XCircle;
        return Info;
    }

    const getTypeStyles = (message: string) => {
        const msg = message.toLowerCase();
        if (msg.includes('approved') || msg.includes('success') || msg.includes('received'))
            return theme === "dark" ? "bg-green-900/20 text-green-400" : "bg-green-100 text-green-600";
        if (msg.includes('warning') || msg.includes('refund'))
            return theme === "dark" ? "bg-yellow-900/20 text-yellow-400" : "bg-yellow-100 text-yellow-600";
        if (msg.includes('error') || msg.includes('failed'))
            return theme === "dark" ? "bg-red-900/20 text-red-400" : "bg-red-100 text-red-600";
        return theme === "dark" ? "bg-blue-900/20 text-blue-400" : "bg-blue-100 text-blue-600";
    }

    const markAsRead = async (id: number) => {
        try {
            await notificationsApi.markAsRead(id)
            setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n))
        } catch (err) {
            console.error('Failed to mark as read:', err)
        }
    }

    const markAllAsRead = async () => {
        try {
            await notificationsApi.markAllAsRead()
            setNotifications(notifications.map(n => ({ ...n, is_read: true })))
        } catch (err) {
            console.error('Failed to mark all as read:', err)
        }
    }

    const unreadCount = notifications.filter(n => !n.is_read).length

    if (loading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#AC1212]" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className={`text-3xl font-bold tracking-tight ${theme === "dark" ? "text-slate-100" : ""}`}>Notifications</h1>
                    <p className={theme === "dark" ? "text-slate-400" : "text-muted-foreground"}>Stay updated with your activities</p>
                </div>
                {unreadCount > 0 && (
                    <Button variant="outline" onClick={markAllAsRead} className={theme === "dark" ? "border-slate-700 hover:bg-slate-800" : ""}>
                        <CheckSquare className="h-4 w-4 mr-2" />
                        Mark All Read
                    </Button>
                )}
            </div>

            {/* Error State */}
            {error && (
                <Card className="border-red-500">
                    <CardContent className="pt-6">
                        <p className="text-red-500">{error}</p>
                    </CardContent>
                </Card>
            )}

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
                            const TypeIcon = getTypeIcon(notification.message)
                            return (
                                <div
                                    key={notification.id}
                                    className={`flex items-start gap-4 p-4 rounded-lg border transition-colors cursor-pointer ${theme === "dark"
                                        ? notification.is_read
                                            ? "border-slate-800 hover:bg-slate-800/50"
                                            : "border-slate-700 bg-slate-800/30 hover:bg-slate-800/70"
                                        : notification.is_read
                                            ? "border-gray-200 hover:bg-gray-50"
                                            : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                                        }`}
                                    onClick={() => !notification.is_read && markAsRead(notification.id)}
                                >
                                    <div className={`p-2 rounded-full ${getTypeStyles(notification.message)}`}>
                                        <TypeIcon className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className={`font-medium ${theme === "dark" ? "text-slate-100" : ""}`}>
                                                {notification.message.split('.')[0]}
                                            </p>
                                            {!notification.is_read && (
                                                <div className="w-2 h-2 rounded-full bg-red-500" />
                                            )}
                                        </div>
                                        <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-muted-foreground"} mt-1`}>{notification.message}</p>
                                        <p className={`text-xs ${theme === "dark" ? "text-slate-500" : "text-muted-foreground"} mt-2`}>
                                            {new Date(notification.sent_at).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button variant="ghost" size="icon" className={`h-8 w-8 ${theme === "dark" ? "text-slate-400 hover:bg-slate-800" : ""}`}>
                                            <Eye className="h-4 w-4" />
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
