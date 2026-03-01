'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    Users,
    Ticket,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    Download,
    Eye,
    MousePointer,
    Clock,
    DollarSign,
    Activity,
    PieChart
} from 'lucide-react';

// Mock analytics data
const overviewStats = {
    totalViews: 12543,
    uniqueVisitors: 8234,
    registrations: 1143,
    conversionRate: 13.9,
    revenue: 45678.90,
    avgTicketPrice: 89.99,
};

// Mock daily data for charts
const dailyData = [
    { date: 'Mon', views: 1200, registrations: 45, revenue: 2340 },
    { date: 'Tue', views: 1450, registrations: 52, revenue: 2890 },
    { date: 'Wed', views: 1680, registrations: 61, revenue: 3450 },
    { date: 'Thu', views: 1520, registrations: 58, revenue: 3120 },
    { date: 'Fri', views: 1890, registrations: 72, revenue: 4100 },
    { date: 'Sat', views: 2340, registrations: 89, revenue: 5230 },
    { date: 'Sun', views: 2100, registrations: 78, revenue: 4560 },
];

// Event performance data
const eventPerformance = [
    { id: '1', title: 'Tech Conference 2026', views: 4523, registrations: 342, revenue: 34165.58, status: 'approved' },
    { id: '2', title: 'Music Festival', views: 3845, registrations: 756, revenue: 113473.44, status: 'approved' },
    { id: '3', title: 'Art Workshop', views: 2341, registrations: 45, revenue: 0, status: 'pending' },
    { id: '4', title: 'Business Summit', views: 1834, registrations: 0, revenue: 0, status: 'draft' },
];

// Traffic sources
const trafficSources = [
    { source: 'Direct', visitors: 3245, percentage: 39.4 },
    { source: 'Social Media', visitors: 2156, percentage: 26.2 },
    { source: 'Search', visitors: 1823, percentage: 22.1 },
    { source: 'Email', visitors: 654, percentage: 7.9 },
    { source: 'Referral', visitors: 356, percentage: 4.3 },
];

// Top countries
const topCountries = [
    { country: 'United States', visitors: 4523, percentage: 54.9 },
    { country: 'United Kingdom', visitors: 1234, percentage: 15.0 },
    { country: 'Canada', visitors: 892, percentage: 10.8 },
    { country: 'Germany', visitors: 567, percentage: 6.9 },
    { country: 'Australia', visitors: 423, percentage: 5.1 },
];

export default function AnalyticsPage() {
    const [dateRange, setDateRange] = useState('7d');

    const maxViews = Math.max(...dailyData.map(d => d.views));
    const maxRegistrations = Math.max(...dailyData.map(d => d.registrations));
    const maxRevenue = Math.max(...dailyData.map(d => d.revenue));

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Analytics</h1>
                    <p className="text-gray-500 mt-1">Track your event performance and insights</p>
                </div>
                <div className="flex gap-2">
                    <Select value={dateRange} onValueChange={setDateRange}>
                        <SelectTrigger className="w-[140px] border-gray-200">
                            <SelectValue placeholder="Select range" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="7d">Last 7 days</SelectItem>
                            <SelectItem value="30d">Last 30 days</SelectItem>
                            <SelectItem value="90d">Last 90 days</SelectItem>
                            <SelectItem value="1y">Last year</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" className="border-gray-200 hover:bg-gray-50">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Views</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{overviewStats.totalViews.toLocaleString()}</p>
                                <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                                    <ArrowUpRight className="w-3 h-3" />
                                    +8.2% from last period
                                </p>
                            </div>
                            <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center">
                                <Eye className="w-7 h-7 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Unique Visitors</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{overviewStats.uniqueVisitors.toLocaleString()}</p>
                                <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                                    <ArrowUpRight className="w-3 h-3" />
                                    +5.4% from last period
                                </p>
                            </div>
                            <div className="w-14 h-14 rounded-xl bg-purple-50 flex items-center justify-center">
                                <Users className="w-7 h-7 text-purple-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Registrations</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{overviewStats.registrations.toLocaleString()}</p>
                                <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                                    <ArrowUpRight className="w-3 h-3" />
                                    +15.3% from last period
                                </p>
                            </div>
                            <div className="w-14 h-14 rounded-xl bg-[#AC1212]/10 flex items-center justify-center">
                                <Ticket className="w-7 h-7 text-[#AC1212]" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Revenue</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">${overviewStats.revenue.toLocaleString()}</p>
                                <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                                    <ArrowUpRight className="w-3 h-3" />
                                    +22.1% from last period
                                </p>
                            </div>
                            <div className="w-14 h-14 rounded-xl bg-green-50 flex items-center justify-center">
                                <DollarSign className="w-7 h-7 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs for different analytics sections */}
            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList className="bg-gray-100">
                    <TabsTrigger value="overview" className="data-[state=active]:bg-[#AC1212] data-[state=active]:text-white">
                        <Activity className="w-4 h-4 mr-2" />
                        Overview
                    </TabsTrigger>
                    <TabsTrigger value="events" className="data-[state=active]:bg-[#AC1212] data-[state=active]:text-white">
                        <Calendar className="w-4 h-4 mr-2" />
                        Events
                    </TabsTrigger>
                    <TabsTrigger value="audience" className="data-[state=active]:bg-[#AC1212] data-[state=active]:text-white">
                        <Users className="w-4 h-4 mr-2" />
                        Audience
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    {/* Daily Performance Chart */}
                    <Card className="border-gray-200 shadow-sm">
                        <CardHeader className="border-b">
                            <CardTitle className="text-xl">Daily Performance</CardTitle>
                            <CardDescription>Views, registrations, and revenue over time</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="space-y-6">
                                {/* Views Chart */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                            <Eye className="w-4 h-4 text-blue-600" />
                                            Views
                                        </span>
                                        <span className="text-sm font-semibold text-gray-900">{dailyData.reduce((sum, d) => sum + d.views, 0).toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-end gap-1 h-24">
                                        {dailyData.map((day, i) => (
                                            <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                                <div
                                                    className="w-full bg-blue-100 rounded-t hover:bg-blue-200 transition-colors"
                                                    style={{ height: `${(day.views / maxViews) * 100}%`, minHeight: '4px' }}
                                                />
                                                <span className="text-[10px] text-gray-400">{day.date}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Registrations Chart */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                            <Ticket className="w-4 h-4 text-[#AC1212]" />
                                            Registrations
                                        </span>
                                        <span className="text-sm font-semibold text-gray-900">{dailyData.reduce((sum, d) => sum + d.registrations, 0)}</span>
                                    </div>
                                    <div className="flex items-end gap-1 h-24">
                                        {dailyData.map((day, i) => (
                                            <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                                <div
                                                    className="w-full bg-[#AC1212]/20 rounded-t hover:bg-[#AC1212]/30 transition-colors"
                                                    style={{ height: `${(day.registrations / maxRegistrations) * 100}%`, minHeight: '4px' }}
                                                />
                                                <span className="text-[10px] text-gray-400">{day.date}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Revenue Chart */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                            <DollarSign className="w-4 h-4 text-green-600" />
                                            Revenue
                                        </span>
                                        <span className="text-sm font-semibold text-gray-900">${dailyData.reduce((sum, d) => sum + d.revenue, 0).toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-end gap-1 h-24">
                                        {dailyData.map((day, i) => (
                                            <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                                <div
                                                    className="w-full bg-green-100 rounded-t hover:bg-green-200 transition-colors"
                                                    style={{ height: `${(day.revenue / maxRevenue) * 100}%`, minHeight: '4px' }}
                                                />
                                                <span className="text-[10px] text-gray-400">{day.date}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="border-gray-200 shadow-sm">
                            <CardHeader className="border-b pb-4">
                                <CardTitle className="text-lg">Conversion Rate</CardTitle>
                                <CardDescription>Percentage of visitors who register</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-center py-6">
                                    <div className="text-center">
                                        <div className="w-32 h-32 rounded-full border-8 border-[#AC1212] flex items-center justify-center">
                                            <span className="text-4xl font-bold text-gray-900">{overviewStats.conversionRate}%</span>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-2">Industry avg: 3-5%</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-gray-200 shadow-sm">
                            <CardHeader className="border-b pb-4">
                                <CardTitle className="text-lg">Traffic Sources</CardTitle>
                                <CardDescription>Where your visitors come from</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {trafficSources.map((source, i) => (
                                        <div key={i} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-3 h-3 rounded-full ${i === 0 ? 'bg-blue-500' : i === 1 ? 'bg-pink-500' : i === 2 ? 'bg-green-500' : i === 3 ? 'bg-yellow-500' : 'bg-purple-500'}`} />
                                                <span className="text-sm font-medium text-gray-900">{source.source}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-[#AC1212] rounded-full"
                                                        style={{ width: `${source.percentage}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm text-gray-500 w-12 text-right">{source.percentage}%</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="events" className="space-y-4">
                    <Card className="border-gray-200 shadow-sm">
                        <CardHeader className="border-b">
                            <CardTitle className="text-xl">Event Performance</CardTitle>
                            <CardDescription>Compare performance across your events</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {eventPerformance.map((event) => (
                                    <div key={event.id} className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-[#AC1212]/10 flex items-center justify-center">
                                                <Calendar className="w-6 h-6 text-[#AC1212]" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{event.title}</h3>
                                                <Badge
                                                    variant="outline"
                                                    className={`mt-1 ${event.status === 'approved' ? 'bg-green-50 text-green-700 border-green-200' :
                                                            event.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                                                'bg-gray-50 text-gray-700 border-gray-200'
                                                        }`}
                                                >
                                                    {event.status}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-8">
                                            <div className="text-center">
                                                <p className="text-lg font-semibold text-gray-900">{event.views.toLocaleString()}</p>
                                                <p className="text-xs text-gray-500">views</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-lg font-semibold text-gray-900">{event.registrations}</p>
                                                <p className="text-xs text-gray-500">registrations</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-lg font-semibold text-green-600">${event.revenue.toLocaleString()}</p>
                                                <p className="text-xs text-gray-500">revenue</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="audience" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="border-gray-200 shadow-sm">
                            <CardHeader className="border-b pb-4">
                                <CardTitle className="text-lg">Top Countries</CardTitle>
                                <CardDescription>Where your audience is located</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {topCountries.map((country, i) => (
                                        <div key={i} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-medium text-gray-500 w-6">{i + 1}</span>
                                                <span className="text-sm font-medium text-gray-900">{country.country}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-[#AC1212] rounded-full"
                                                        style={{ width: `${country.percentage}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm text-gray-500 w-16 text-right">{country.visitors.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-gray-200 shadow-sm">
                            <CardHeader className="border-b pb-4">
                                <CardTitle className="text-lg">Audience Insights</CardTitle>
                                <CardDescription>Demographic information</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 mb-2">Age Distribution</p>
                                        <div className="flex items-end gap-2 h-24">
                                            {['18-24', '25-34', '35-44', '45-54', '55+'].map((age, i) => {
                                                const heights = [15, 45, 30, 20, 10];
                                                return (
                                                    <div key={age} className="flex-1 flex flex-col items-center gap-1">
                                                        <div
                                                            className="w-full bg-[#AC1212] rounded-t"
                                                            style={{ height: `${heights[i]}%` }}
                                                        />
                                                        <span className="text-[10px] text-gray-400">{age}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 mb-2">Device Types</p>
                                        <div className="flex gap-4">
                                            <div className="flex-1 p-4 bg-gray-50 rounded-lg text-center">
                                                <p className="text-2xl font-bold text-gray-900">65%</p>
                                                <p className="text-xs text-gray-500">Mobile</p>
                                            </div>
                                            <div className="flex-1 p-4 bg-gray-50 rounded-lg text-center">
                                                <p className="text-2xl font-bold text-gray-900">30%</p>
                                                <p className="text-xs text-gray-500">Desktop</p>
                                            </div>
                                            <div className="flex-1 p-4 bg-gray-50 rounded-lg text-center">
                                                <p className="text-2xl font-bold text-gray-900">5%</p>
                                                <p className="text-xs text-gray-500">Tablet</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
