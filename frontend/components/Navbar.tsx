'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Search,
    Bell,
    MessageCircle,
    User,
    LogOut,
    Heart,
    Calendar,
    Check,
    LayoutDashboard,
    BarChart3
} from 'lucide-react';
import { notificationsApi, Notification } from '@/lib/api';
import { Badge } from '@/components/ui/badge';

export default function Navbar() {
    const { user, userData, signOut } = useAuth();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (user) {
            fetchNotifications();
            // Poll for notifications every 30 seconds
            const interval = setInterval(fetchNotifications, 30000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const fetchNotifications = async () => {
        try {
            const response = await notificationsApi.getMyNotifications();
            if (response.success) {
                setNotifications(response.data.notifications);
                setUnreadCount(response.data.notifications.filter(n => !n.is_read).length);
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    };

    const handleMarkAsRead = async (id: number) => {
        try {
            await notificationsApi.markAsRead(id);
            fetchNotifications();
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationsApi.markAllAsRead();
            fetchNotifications();
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/events?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleSignOut = async () => {
        await signOut();
        router.push('/login');
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <nav className="sticky top-0 z-50 flex h-16 items-center justify-between bg-background px-4 md:px-6 lg:px-8 shadow-sm border-b border-border">
            {/* Logo */}
            <div className="flex items-center gap-2">
                <Link href="/" className="cursor-pointer">
                    <h1 className="text-xl md:text-2xl font-bold text-foreground">
                        Event<span className="text-[#AC1212]">Mate</span>
                    </h1>
                </Link>
            </div>

            {/* Search Bar - Hidden on small screens */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xs lg:max-w-md mx-4">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search events..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-[#AC1212]"
                    />
                </div>
            </form>

            {/* Main Navigation Links - Visible on Desktop */}
            {user && (
                <div className="hidden xl:flex items-center gap-0.5">
                    <Button variant="ghost" asChild className="text-muted-foreground hover:text-[#AC1212] hover:bg-muted px-2">
                        <Link href="/my-events" className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4" />
                            <span className="text-sm">My Events</span>
                        </Link>
                    </Button>
                    <Button variant="ghost" asChild className="text-muted-foreground hover:text-[#AC1212] hover:bg-muted px-2">
                        <Link href="/favorites" className="flex items-center gap-1.5">
                            <Heart className="h-4 w-4" />
                            <span className="text-sm">Favorites</span>
                        </Link>
                    </Button>
                    <Button variant="ghost" asChild className="text-muted-foreground hover:text-[#AC1212] hover:bg-muted px-2">
                        <Link href="/profile" className="flex items-center gap-1.5">
                            <User className="h-4 w-4" />
                            <span className="text-sm">Profile</span>
                        </Link>
                    </Button>
                    {(userData?.role === 'Organizer' || userData?.role === 'Administrator') && (
                        <Button variant="ghost" asChild className="text-muted-foreground hover:text-[#AC1212] hover:bg-muted px-2">
                            <Link href="/organiser" className="flex items-center gap-1.5">
                                <LayoutDashboard className="h-4 w-4" />
                                <span className="text-sm">Organizer</span>
                            </Link>
                        </Button>
                    )}
                    {userData?.role === 'Administrator' && (
                        <Button variant="ghost" asChild className="text-muted-foreground hover:text-[#AC1212] hover:bg-muted px-2">
                            <Link href="/admin" className="flex items-center gap-1.5">
                                <BarChart3 className="h-4 w-4" />
                                <span className="text-sm">Admin</span>
                            </Link>
                        </Button>
                    )}
                </div>
            )}

            {/* Right Side Actions */}
            <div className="flex items-center gap-1">
                {/* Mobile Search Icon */}
                <Button variant="ghost" size="icon" className="md:hidden text-muted-foreground">
                    <Search className="h-5 w-5" />
                </Button>

                {/* Notification Dropdown */}
                {user && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-[#AC1212]">
                                <Bell className="h-5 w-5" />
                                {unreadCount > 0 && (
                                    <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-[#AC1212] text-white border-0 text-[10px]">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </Badge>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-80">
                            <div className="flex items-center justify-between p-4">
                                <h3 className="font-semibold">Notifications</h3>
                                {unreadCount > 0 && (
                                    <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead} className="text-xs h-auto p-0 hover:bg-transparent text-[#AC1212] font-medium">
                                        Mark all as read
                                    </Button>
                                )}
                            </div>
                            <DropdownMenuSeparator />
                            <div className="max-h-[300px] overflow-y-auto">
                                {notifications.length > 0 ? (
                                    notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={`p-4 border-b border-muted last:border-0 flex gap-3 ${!notification.is_read ? 'bg-muted/30' : ''}`}
                                        >
                                            <div className="flex-1">
                                                <p className={`text-sm ${!notification.is_read ? 'font-medium' : 'text-muted-foreground'}`}>
                                                    {notification.message}
                                                </p>
                                                <p className="text-[10px] text-muted-foreground mt-1">
                                                    {new Date(notification.sent_at).toLocaleString()}
                                                </p>
                                            </div>
                                            {!notification.is_read && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 text-muted-foreground hover:text-[#AC1212]"
                                                    onClick={() => handleMarkAsRead(notification.id)}
                                                >
                                                    <Check className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-muted-foreground text-sm">
                                        No notifications yet
                                    </div>
                                )}
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}

                {/* Messages */}
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-[#AC1212]">
                    <MessageCircle className="h-5 w-5" />
                </Button>

                {/* User Menu - Simplified */}
                {user ? (
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" onClick={handleSignOut} className="text-muted-foreground hover:text-red-600 hidden sm:flex">
                            <LogOut className="h-4 w-4 mr-1" />
                            <span className="text-sm">Logout</span>
                        </Button>
                        <Button variant="ghost" onClick={handleSignOut} className="text-muted-foreground hover:text-red-600 sm:hidden p-2">
                            <LogOut className="h-5 w-5" />
                        </Button>
                        <Avatar className="h-8 w-8">
                            <AvatarImage src="" alt={userData?.displayName || 'User'} />
                            <AvatarFallback className="bg-[#AC1212] text-white text-sm">
                                {userData?.displayName ? getInitials(userData.displayName) : 'U'}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" asChild className="text-muted-foreground hover:text-[#AC1212]">
                            <Link href="/login">Sign In</Link>
                        </Button>
                        <Button asChild className="bg-[#AC1212] hover:bg-[#8a0f0f]">
                            <Link href="/register">Sign Up</Link>
                        </Button>
                    </div>
                )}
            </div>
        </nav>
    );
}
