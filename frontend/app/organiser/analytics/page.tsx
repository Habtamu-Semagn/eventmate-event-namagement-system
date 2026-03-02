"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    TrendingUp,
    TrendingDown,
    Users,
    Ticket,
    DollarSign,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    Eye,
    MousePointer,
    Clock,
    CheckCircle
} from "lucide-react"

// Mock analytics data
const mockAnalytics = {
    totalViews: 12543,
    uniqueVisitors: 8234,
    conversionRate: 3.2,
    avgTicketPrice: 124.50,
    totalRevenue: 172341.50,
    ticketsSold: 1143,
    checkInRate: 78.5,
}

const mockDailyStats = [
    { date: '2026-02-24', views: 450, tickets: 23, revenue: 2863.50 },
    { date: '2026-02-25', views: 520, tickets: 31, revenue: 3849.50 },
    { date: '2026-02-26', views: 380, tickets: 18, revenue: 2241.00 },
    { date: '2026-02-27', views: 610, tickets: 42, revenue: 5229.00 },
    { date: '2026-02-28', views: 720, tickets: 55, revenue: 6847.50 },
    { date: '2026-03-01', views: 890, tickets: 67, revenue: 8341.50 },
    { date: '2026-03-02', views: 650, tickets: 48, revenue: 5976.00 },
]

const mockTopEvents = [
    { name: 'Tech Conference 2026', views: 4500, tickets: 342, revenue: 38685 },
    { name: 'Music Festival', views: 3800, tickets: 756, revenue: 113392 },
    { name: 'Art Workshop', views: 2100, tickets: 45, revenue: 2249 },
]

export default function OrganiserAnalyticsPage() {
    const { theme } = useTheme()
    const [timeRange, setTimeRange] = useState('7days')

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    }

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('en-US').format(num);
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className={`text-3xl font-bold tracking-tight ${theme === "dark" ? "text-slate-100" : ""}`}>Analytics</h1>
                    <p className={theme === "dark" ? "text-slate-400" : "text-muted-foreground"}>Track your event performance</p>
                </div>
                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className={`w-[180px] ${theme === "dark" ? "bg-slate-800 border-slate-700" : ""}`}>
                        <SelectValue placeholder="Select time range" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="7days">Last 7 Days</SelectItem>
                        <SelectItem value="30days">Last 30 Days</SelectItem>
                        <SelectItem value="90days">Last 90 Days</SelectItem>
                        <SelectItem value="year">This Year</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className={theme === "dark" ? "border-slate-800 bg-slate-900" : ""}>
                    <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className={`text-sm font-medium ${theme === "dark" ? "text-slate-400" : "text-muted-foreground"}`}>Total Views</p>
                                <p className={`text-2xl font-bold ${theme === "dark" ? "text-slate-100" : ""} mt-1`}>{formatNumber(mockAnalytics.totalViews)}</p>
                                <div className="flex items-center gap-1 mt-2">
                                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                                    <span className="text-sm text-green-500 font-medium">+12.5%</span>
                                    <span className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-muted-foreground"}`}>vs last period</span>
                                </div>
                            </div>
                            <div className="p-3 rounded-xl bg-blue-500/10">
                                <Eye className="h-6 w-6 text-blue-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className={theme === "dark" ? "border-slate-800 bg-slate-900" : ""}>
                    <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className={`text-sm font-medium ${theme === "dark" ? "text-slate-400" : "text-muted-foreground"}`}>Unique Visitors</p>
                                <p className={`text-2xl font-bold ${theme === "dark" ? "text-slate-100" : ""} mt-1`}>{formatNumber(mockAnalytics.uniqueVisitors)}</p>
                                <div className="flex items-center gap-1 mt-2">
                                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                                    <span className="text-sm text-green-500 font-medium">+8.2%</span>
                                    <span className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-muted-foreground"}`}>vs last period</span>
                                </div>
                            </div>
                            <div className="p-3 rounded-xl bg-purple-500/10">
                                <Users className="h-6 w-6 text-purple-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className={theme === "dark" ? "border-slate-800 bg-slate-900" : ""}>
                    <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className={`text-sm font-medium ${theme === "dark" ? "text-slate-400" : "text-muted-foreground"}`}>Conversion Rate</p>
                                <p className={`text-2xl font-bold ${theme === "dark" ? "text-slate-100" : ""} mt-1`}>{mockAnalytics.conversionRate}%</p>
                                <div className="flex items-center gap-1 mt-2">
                                    <ArrowDownRight className="h-4 w-4 text-red-500" />
                                    <span className="text-sm text-red-500 font-medium">-1.3%</span>
                                    <span className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-muted-foreground"}`}>vs last period</span>
                                </div>
                            </div>
                            <div className="p-3 rounded-xl bg-green-500/10">
                                <MousePointer className="h-6 w-6 text-green-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className={theme === "dark" ? "border-slate-800 bg-slate-900" : ""}>
                    <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className={`text-sm font-medium ${theme === "dark" ? "text-slate-400" : "text-muted-foreground"}`}>Total Revenue</p>
                                <p className={`text-2xl font-bold ${theme === "dark" ? "text-slate-100" : ""} mt-1`}>{formatCurrency(mockAnalytics.totalRevenue)}</p>
                                <div className="flex items-center gap-1 mt-2">
                                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                                    <span className="text-sm text-green-500 font-medium">+23.1%</span>
                                    <span className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-muted-foreground"}`}>vs last period</span>
                                </div>
                            </div>
                            <div className="p-3 rounded-xl bg-green-500/10">
                                <DollarSign className="h-6 w-6 text-green-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid gap-4 lg:grid-cols-2">
                {/* Revenue Chart Placeholder */}
                <Card className={theme === "dark" ? "border-slate-800 bg-slate-900" : ""}>
                    <CardHeader>
                        <CardTitle className={theme === "dark" ? "text-slate-100" : ""}>Revenue Trend</CardTitle>
                        <CardDescription className={theme === "dark" ? "text-slate-400" : ""}>Daily revenue over the past 7 days</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className={`h-[300px] flex items-center justify-center rounded-lg ${theme === "dark" ? "bg-slate-800/50" : "bg-muted/30"}`}>
                            <div className="text-center space-y-2">
                                <TrendingUp className={`h-12 w-12 mx-auto ${theme === "dark" ? "text-slate-600" : "text-muted-foreground/50"}`} />
                                <p className={theme === "dark" ? "text-slate-500" : "text-muted-foreground"}>Revenue chart visualization</p>
                                <p className={`text-sm ${theme === "dark" ? "text-slate-600" : "text-muted-foreground/70"}`}>Connect to your analytics provider</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Traffic Chart Placeholder */}
                <Card className={theme === "dark" ? "border-slate-800 bg-slate-900" : ""}>
                    <CardHeader>
                        <CardTitle className={theme === "dark" ? "text-slate-100" : ""}>Traffic Overview</CardTitle>
                        <CardDescription className={theme === "dark" ? "text-slate-400" : ""}>Daily page views and ticket purchases</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className={`h-[300px] flex items-center justify-center rounded-lg ${theme === "dark" ? "bg-slate-800/50" : "bg-muted/30"}`}>
                            <div className="text-center space-y-2">
                                <Users className={`h-12 w-12 mx-auto ${theme === "dark" ? "text-slate-600" : "text-muted-foreground/50"}`} />
                                <p className={theme === "dark" ? "text-slate-500" : "text-muted-foreground"}>Traffic chart visualization</p>
                                <p className={`text-sm ${theme === "dark" ? "text-slate-600" : "text-muted-foreground/70"}`}>Connect to your analytics provider</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Top Events & Additional Stats */}
            <div className="grid gap-4 lg:grid-cols-2">
                {/* Top Events */}
                <Card className={theme === "dark" ? "border-slate-800 bg-slate-900" : ""}>
                    <CardHeader>
                        <CardTitle className={theme === "dark" ? "text-slate-100" : ""}>Top Performing Events</CardTitle>
                        <CardDescription className={theme === "dark" ? "text-slate-400" : ""}>Your best performing events by revenue</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {mockTopEvents.map((event, index) => (
                                <div key={index} className={`flex items-center justify-between p-4 rounded-lg ${theme === "dark" ? "bg-slate-800/50" : "bg-slate-50"}`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${theme === "dark" ? "bg-slate-700" : "bg-slate-200"}`}>
                                            <span className={`font-bold ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}>{index + 1}</span>
                                        </div>
                                        <div>
                                            <p className={`font-medium ${theme === "dark" ? "text-slate-100" : ""}`}>{event.name}</p>
                                            <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-muted-foreground"}`}>{formatNumber(event.views)} views</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-bold ${theme === "dark" ? "text-slate-100" : ""}`}>{formatCurrency(event.revenue)}</p>
                                        <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-muted-foreground"}`}>{event.tickets} tickets</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card className={theme === "dark" ? "border-slate-800 bg-slate-900" : ""}>
                    <CardHeader>
                        <CardTitle className={theme === "dark" ? "text-slate-100" : ""}>Quick Stats</CardTitle>
                        <CardDescription className={theme === "dark" ? "text-slate-400" : ""}>Additional performance metrics</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-lg border border-dashed">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-xl bg-blue-500/10">
                                        <Ticket className="h-5 w-5 text-blue-500" />
                                    </div>
                                    <div>
                                        <p className={`font-medium ${theme === "dark" ? "text-slate-100" : ""}`}>Tickets Sold</p>
                                        <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-muted-foreground"}`}>Total ticket sales</p>
                                    </div>
                                </div>
                                <p className={`text-xl font-bold ${theme === "dark" ? "text-slate-100" : ""}`}>{formatNumber(mockAnalytics.ticketsSold)}</p>
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-lg border border-dashed">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-xl bg-purple-500/10">
                                        <DollarSign className="h-5 w-5 text-purple-500" />
                                    </div>
                                    <div>
                                        <p className={`font-medium ${theme === "dark" ? "text-slate-100" : ""}`}>Avg. Ticket Price</p>
                                        <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-muted-foreground"}`}>Average per ticket</p>
                                    </div>
                                </div>
                                <p className={`text-xl font-bold ${theme === "dark" ? "text-slate-100" : ""}`}>{formatCurrency(mockAnalytics.avgTicketPrice)}</p>
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-lg border border-dashed">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-xl bg-green-500/10">
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                    </div>
                                    <div>
                                        <p className={`font-medium ${theme === "dark" ? "text-slate-100" : ""}`}>Check-in Rate</p>
                                        <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-muted-foreground"}`}>Attendee check-ins</p>
                                    </div>
                                </div>
                                <p className={`text-xl font-bold ${theme === "dark" ? "text-slate-100" : ""}`}>{mockAnalytics.checkInRate}%</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div >
    )
}
