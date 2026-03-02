'use client';

import { useState } from 'react';
import Link from 'next/link';
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
import { Search, Bell, MessageCircle, User, LogOut, Heart, Calendar, Settings } from 'lucide-react';

export default function Navbar() {
    const { user, userData, signOut } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');

    const handleSignOut = async () => {
        await signOut();
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
        <nav className="sticky top-0 z-50 flex h-16 items-center justify-between bg-background px-6 shadow-sm md:px-12 border-b border-border">
            {/* Logo */}
            <div className="flex items-center gap-2">
                <Link href="/" className="cursor-pointer">
                    <h1 className="text-2xl font-bold text-foreground">
                        Event<span className="text-[#AC1212]">Mate</span>
                    </h1>
                </Link>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
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
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2">
                {/* Mobile Search Icon */}
                <Button variant="ghost" size="icon" className="md:hidden text-muted-foreground">
                    <Search className="h-5 w-5" />
                </Button>

                {/* Notification */}
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-[#AC1212]">
                    <Bell className="h-5 w-5" />
                </Button>

                {/* Messages */}
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-[#AC1212]">
                    <MessageCircle className="h-5 w-5" />
                </Button>

                {/* My Account Dropdown */}
                {user ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="flex items-center gap-2 px-2 hover:bg-transparent">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src="" alt={userData?.displayName || 'User'} />
                                    <AvatarFallback className="bg-[#AC1212] text-white text-sm">
                                        {userData?.displayName ? getInitials(userData.displayName) : 'U'}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="hidden md:inline-block text-sm font-medium">
                                    {userData?.displayName || user.email?.split('@')[0]}
                                </span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{userData?.displayName || 'User'}</p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        {user.email}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/profile" className="cursor-pointer">
                                    <User className="mr-2 h-4 w-4" />
                                    Manage Profile
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/my-events" className="cursor-pointer">
                                    <Calendar className="mr-2 h-4 w-4" />
                                    My Registered Events
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/favorites" className="cursor-pointer">
                                    <Heart className="mr-2 h-4 w-4" />
                                    Saved Events
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/settings" className="cursor-pointer">
                                    <Settings className="mr-2 h-4 w-4" />
                                    Settings
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleSignOut} className="text-red-600 cursor-pointer">
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
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
