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
import { Badge } from '@/components/ui/badge';
import NotificationBell from '@/components/NotificationBell';

export default function Navbar() {
    const { user, userData, signOut } = useAuth();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

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

                {/* Notification Bell */}
                <NotificationBell />

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
