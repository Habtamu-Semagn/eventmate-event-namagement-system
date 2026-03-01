'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import {
    LayoutDashboard,
    Calendar,
    PlusCircle,
    Users,
    Ticket,
    Settings,
    LogOut,
    Menu,
    Bell,
    BellRing
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface SidebarProps {
    children: React.ReactNode;
}

const navItems = [
    { href: '/organiser', label: 'Overview', icon: LayoutDashboard },
    { href: '/organiser/events', label: 'My Events', icon: Calendar },
    { href: '/organiser/create', label: 'Create Event', icon: PlusCircle },
    { href: '/organiser/attendees', label: 'Attendees', icon: Users },
    { href: '/organiser/tickets', label: 'Tickets', icon: Ticket },
    { href: '/organiser/notifications', label: 'Notifications', icon: BellRing },
];

// Navigation Item Component
function NavItem({ href, label, icon: Icon, isActive, onClick }: { href: string; label: string; icon: any; isActive: boolean; onClick?: () => void }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                    ? "bg-[#AC1212] text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100 hover:text-[#AC1212]"
            )}
        >
            <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-gray-500")} />
            {label}
        </Link>
    );
}

// Mobile Sheet Sidebar
function MobileSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const pathname = usePathname();
    const router = useRouter();
    const { signOut, user } = useAuth();

    const handleLogout = async () => {
        try {
            await signOut();
            router.push('/login');
            onClose();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent side="left" className="w-72 p-0 border-r bg-white shadow-xl">
                <div className="flex flex-col h-full">
                    {/* Logo Section */}
                    <div className="h-16 flex items-center gap-3 px-6 border-b border-gray-200">
                        <div className="w-9 h-9 bg-gradient-to-br from-[#AC1212] to-[#8a0f0f] rounded-lg flex items-center justify-center shadow-md">
                            <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-gray-900 text-lg">Eventmate</span>
                    </div>

                    {/* Navigation */}
                    <ScrollArea className="flex-1 py-4 px-3">
                        <nav className="space-y-1">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href || (item.href !== '/organiser' && pathname.startsWith(item.href + '/'));
                                return (
                                    <NavItem
                                        key={item.href}
                                        href={item.href}
                                        label={item.label}
                                        icon={item.icon}
                                        isActive={isActive}
                                        onClick={onClose}
                                    />
                                );
                            })}
                        </nav>
                    </ScrollArea>

                    <Separator className="bg-gray-200" />

                    {/* User Section */}
                    <div className="p-4 bg-gray-50">
                        <div className="flex items-center gap-3 mb-3">
                            <Avatar className="h-10 w-10 border-2 border-gray-200">
                                <AvatarFallback className="bg-[#AC1212] text-white font-medium">
                                    A
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">
                                    alemayehu wasie
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                    alemayehu@eventmate.com
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Link href="/profile" className="flex-1" onClick={onClose}>
                                <Button variant="outline" size="sm" className="w-full bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-[#AC1212]">
                                    <Settings className="w-4 h-4 mr-2" />
                                    Profile
                                </Button>
                            </Link>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleLogout}
                                className="text-gray-500 hover:text-[#AC1212] hover:bg-red-50"
                            >
                                <LogOut className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}

// Desktop Sidebar
function DesktopSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { signOut, user } = useAuth();

    const handleLogout = async () => {
        try {
            await signOut();
            router.push('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <aside className="fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r border-gray-200 shadow-lg">
            <div className="flex flex-col h-full">
                {/* Logo Section */}
                <div className="h-16 flex items-center gap-3 px-6 border-b border-gray-200">
                    <div className="w-9 h-9 bg-gradient-to-br from-[#AC1212] to-[#8a0f0f] rounded-lg flex items-center justify-center shadow-md">
                        <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-gray-900 text-lg">Eventmate</span>
                </div>

                {/* Navigation */}
                <ScrollArea className="flex-1 py-4 px-3">
                    <nav className="space-y-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href || (item.href !== '/organiser' && pathname.startsWith(item.href + '/'));
                            return (
                                <NavItem
                                    key={item.href}
                                    href={item.href}
                                    label={item.label}
                                    icon={item.icon}
                                    isActive={isActive}
                                />
                            );
                        })}
                    </nav>
                </ScrollArea>

                <Separator className="bg-gray-200" />

                {/* User Section */}
                <div className="p-4 bg-gray-50">
                    <div className="flex items-center gap-3 mb-3">
                        <Avatar className="h-10 w-10 border-2 border-gray-200">
                            <AvatarFallback className="bg-[#AC1212] text-white font-medium">
                                A
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                                alemayehu wasie
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                alemayehu@eventmate.com
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/profile" className="flex-1">
                            <Button variant="outline" size="sm" className="w-full bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-[#AC1212]">
                                <Settings className="w-4 h-4 mr-2" />
                                Profile
                            </Button>
                        </Link>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleLogout}
                            className="text-gray-500 hover:text-[#AC1212] hover:bg-red-50"
                        >
                            <LogOut className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </aside>
    );
}

export default function DashboardSidebar({ children }: SidebarProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile Header */}
            <header className="lg:hidden fixed top-0 left-0 right-0 z-30 h-16 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-gray-700">
                                <Menu className="w-5 h-5" />
                            </Button>
                        </SheetTrigger>
                        <MobileSidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
                    </Sheet>
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#AC1212] to-[#8a0f0f] rounded-lg flex items-center justify-center">
                            <Calendar className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-gray-900">Eventmate</span>
                    </Link>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="text-gray-600 hover:text-[#AC1212] hover:bg-gray-100">
                        <Bell className="w-5 h-5" />
                    </Button>
                </div>
            </header>

            {/* Desktop Sidebar */}
            <div className="hidden lg:block">
                <DesktopSidebar />
            </div>

            {/* Main Content */}
            <main className="lg:pl-64 pt-16 lg:pt-0">
                <div className="p-6 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
