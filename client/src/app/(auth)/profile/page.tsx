'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Event } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    User,
    Mail,
    Calendar,
    MapPin,
    Ticket,
    Heart,
    LogOut,
    CheckCircle,
    Clock
} from 'lucide-react';
import Link from 'next/link';

// Mock data for demonstration (not connected to backend)
const mockUserData = {
    displayName: 'John Doe',
    email: 'john.doe@example.com',
    role: 'event_organizer',
    createdAt: '2025-01-15',
};

const mockMyEvents: Partial<Event>[] = [
    {
        id: '1',
        title: 'Tech Conference 2026',
        category: 'Technology',
        date: '2026-03-15T09:00:00Z',
        location: { address: '123 Tech Blvd', city: 'San Francisco', country: 'USA' },
        status: 'approved',
    },
    {
        id: '2',
        title: 'Music Festival',
        category: 'Music',
        date: '2026-04-20T14:00:00Z',
        location: { address: '456 Park Ave', city: 'New York', country: 'USA' },
        status: 'approved',
    },
];

const mockRegisteredEvents: Partial<Event>[] = [
    {
        id: '3',
        title: 'Art Workshop',
        category: 'Art',
        date: '2026-03-25T10:00:00Z',
        location: { address: '789 Art St', city: 'Los Angeles', country: 'USA' },
        status: 'approved',
    },
    {
        id: '4',
        title: 'Business Summit',
        category: 'Business',
        date: '2026-05-10T09:00:00Z',
        location: { address: '321 Business Ave', city: 'Chicago', country: 'USA' },
        status: 'pending',
    },
];

export default function ProfilePage() {
    const router = useRouter();
    const { user, signOut } = useAuth();

    const getRoleLabel = (role: string) => {
        const labels: Record<string, string> = {
            system_admin: 'System Admin',
            event_organizer: 'Event Organizer',
            registered_user: 'Registered User',
        };
        return labels[role] || 'User';
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="mx-auto max-w-6xl px-6">
                {/* Profile Header - Clean Design */}
                <div className="flex items-center gap-6 mb-8">
                    <Avatar className="h-20 w-20 border-2 border-gray-200">
                        <AvatarImage src={user?.photoURL || ''} />
                        <AvatarFallback className="bg-gray-200 text-gray-700 text-2xl font-semibold">
                            {user?.displayName?.charAt(0) || 'U'}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {user?.displayName || mockUserData.displayName}
                        </h1>
                        <p className="text-gray-500">{user?.email || mockUserData.email}</p>
                        <Badge variant="outline" className="mt-1 border-gray-300 text-gray-600">
                            {getRoleLabel(mockUserData.role)}
                        </Badge>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Left Sidebar - Simple Info */}
                    <div className="space-y-6">
                        <Card className="border-gray-200 shadow-sm">
                            <CardHeader className="border-b pb-4">
                                <CardTitle className="text-lg">Account Info</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-4">
                                <div className="flex items-center gap-3">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm text-gray-600">{mockUserData.email}</span>
                                </div>
                                <Separator />
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm text-gray-600">Joined {new Date(mockUserData.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                                </div>
                                <Separator />
                                <Button
                                    variant="outline"
                                    className="w-full border-gray-200 text-gray-600 hover:text-red-600 hover:border-red-200"
                                    onClick={() => signOut()}
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Sign Out
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Content - Events */}
                    <div className="lg:col-span-3 space-y-6">
                        <Tabs defaultValue="registered" className="space-y-4">
                            <TabsList className="bg-gray-100">
                                <TabsTrigger value="registered" className="data-[state=active]:bg-gray-800 data-[state=active]:text-white">
                                    <Ticket className="w-4 h-4 mr-2" />
                                    Registered
                                </TabsTrigger>
                                <TabsTrigger value="organized" className="data-[state=active]:bg-gray-800 data-[state=active]:text-white">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    My Events
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="registered" className="space-y-4">
                                <Card className="border-gray-200 shadow-sm">
                                    <CardHeader className="border-b">
                                        <CardTitle>Registered Events</CardTitle>
                                        <CardDescription>Events you have registered for</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {mockRegisteredEvents.length > 0 ? (
                                            <div className="space-y-4">
                                                {mockRegisteredEvents.map(event => (
                                                    <div
                                                        key={event.id}
                                                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                                                <Calendar className="w-5 h-5 text-gray-500" />
                                                            </div>
                                                            <div>
                                                                <h4 className="font-medium text-gray-900">{event.title}</h4>
                                                                <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                                                                    <span>{new Date(event.date!).toLocaleDateString()}</span>
                                                                    <span>•</span>
                                                                    <span>{event.location?.city}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <Badge
                                                            variant="outline"
                                                            className={event.status === 'approved' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}
                                                        >
                                                            {event.status === 'approved' ? (
                                                                <><CheckCircle className="w-3 h-3 mr-1" /> Confirmed</>
                                                            ) : (
                                                                <><Clock className="w-3 h-3 mr-1" /> Pending</>
                                                            )}
                                                        </Badge>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="py-8 text-center text-gray-500">
                                                <p>No registered events</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="organized" className="space-y-4">
                                <Card className="border-gray-200 shadow-sm">
                                    <CardHeader className="border-b">
                                        <CardTitle>My Organized Events</CardTitle>
                                        <CardDescription>Events you have created</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {mockMyEvents.length > 0 ? (
                                            <div className="space-y-4">
                                                {mockMyEvents.map(event => (
                                                    <div
                                                        key={event.id}
                                                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                                                <Calendar className="w-5 h-5 text-gray-500" />
                                                            </div>
                                                            <div>
                                                                <h4 className="font-medium text-gray-900">{event.title}</h4>
                                                                <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                                                                    <span>{new Date(event.date!).toLocaleDateString()}</span>
                                                                    <span>•</span>
                                                                    <span>{event.location?.city}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <Badge className="bg-green-50 text-green-700 border-green-200">
                                                            <CheckCircle className="w-3 h-3 mr-1" />
                                                            Active
                                                        </Badge>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="py-8 text-center text-gray-500">
                                                <p>No organized events</p>
                                                <Link href="/dashboard/create">
                                                    <Button className="mt-4 bg-gray-800 hover:bg-gray-900">
                                                        Create Event
                                                    </Button>
                                                </Link>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    );
}
