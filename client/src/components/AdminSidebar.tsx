'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';
import {
    LayoutDashboard,
    Users,
    FileText,
    Calendar,
    Activity,
    Settings,
    LogOut,
    Menu,
    Shield,
    Bell,
    History,
    Moon,
    Sun
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
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/users', label: 'User Management', icon: Users },
    { href: '/admin/content', label: 'Content', icon: FileText },
    { href: '/admin/events', label: 'Events', icon: Calendar },
    { href: '/admin/audit', label: 'Audit Trail', icon: History },
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
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
        >
            <Icon className={cn("w-5 h-5", isActive ? "text-sidebar-primary-foreground" : "text-sidebar-foreground/50")} />
            {label}
        </Link>
    );
}

// Mobile Sheet Sidebar
function MobileSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const pathname = usePathname();
    const { theme, toggleTheme } = useTheme();

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent side="left" className="w-72 p-0 border-r">
                <div className="flex flex-col h-full">
                    {/* Logo Section */}
                    <div className="h-16 flex items-center gap-3 px-6 border-b bg-background">
                        <div className="w-9 h-9 bg-sidebar-primary rounded-lg flex items-center justify-center shadow-lg">
                            <Shield className="w-5 h-5 text-sidebar-primary-foreground" />
                        </div>
                        <span className="font-bold text-sidebar-foreground text-lg">Admin Panel</span>
                    </div>

                    {/* Navigation */}
                    <ScrollArea className="flex-1 py-4 px-3">
                        <nav className="space-y-1">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
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

                    <Separator />

                    {/* Theme Toggle */}
                    <div className="p-4 border-b">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={toggleTheme}
                            className="w-full flex items-center justify-center gap-2"
                        >
                            {theme === 'light' ? (
                                <>
                                    <Moon className="w-4 h-4" />
                                    <span>Dark Mode</span>
                                </>
                            ) : (
                                <>
                                    <Sun className="w-4 h-4" />
                                    <span>Light Mode</span>
                                </>
                            )}
                        </Button>
                    </div>

                    {/* User Section */}
                    <div className="p-4 bg-secondary">
                        <div className="flex items-center gap-3 mb-3">
                            <Avatar className="h-10 w-10 border-2 border-border">
                                <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground font-medium">
                                    A
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-secondary-foreground truncate">
                                    Admin
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                    admin@eventmate.com
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Link href="/profile" className="flex-1" onClick={onClose}>
                                <Button variant="outline" size="sm" className="w-full">
                                    <Settings className="w-4 h-4 mr-2" />
                                    Profile
                                </Button>
                            </Link>
                            <Link href="/login" onClick={onClose}>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                >
                                    <LogOut className="w-4 h-4" />
                                </Button>
                            </Link>
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
    const { theme, toggleTheme } = useTheme();

    return (
        <aside className="fixed top-0 left-0 z-40 h-screen w-64 bg-sidebar border-r shadow-sm">
            <div className="flex flex-col h-full">
                {/* Logo Section */}
                <div className="h-16 flex items-center gap-3 px-6 border-b border-sidebar-border">
                    <div className="w-9 h-9 bg-sidebar-primary rounded-lg flex items-center justify-center shadow-lg">
                        <Shield className="w-5 h-5 text-sidebar-primary-foreground" />
                    </div>
                    <span className="font-bold text-sidebar-foreground text-lg">Admin Panel</span>
                </div>

                {/* Navigation */}
                <ScrollArea className="flex-1 py-4 px-3">
                    <nav className="space-y-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
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

                <Separator />

                {/* Theme Toggle & User Section */}
                <div className="p-4 bg-secondary">
                    <div className="flex items-center justify-center mb-3">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={toggleTheme}
                            className="w-full flex items-center justify-center gap-2"
                        >
                            {theme === 'light' ? (
                                <>
                                    <Moon className="w-4 h-4" />
                                    <span>Dark Mode</span>
                                </>
                            ) : (
                                <>
                                    <Sun className="w-4 h-4" />
                                    <span>Light Mode</span>
                                </>
                            )}
                        </Button>
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                        <Avatar className="h-10 w-10 border-2 border-border">
                            <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground font-medium">
                                A
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-secondary-foreground truncate">
                                Admin
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                                admin@eventmate.com
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/profile" className="flex-1">
                            <Button variant="outline" size="sm" className="w-full">
                                <Settings className="w-4 h-4 mr-2" />
                                Profile
                            </Button>
                        </Link>
                        <Link href="/login">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            >
                                <LogOut className="w-4 h-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </aside>
    );
}

export default function AdminSidebar({ children }: SidebarProps) {
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
        <div className="min-h-screen bg-muted/50">
            {/* Mobile Header */}
            <header className="lg:hidden fixed top-0 left-0 right-0 z-30 h-16 bg-background border-b shadow-sm flex items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-foreground">
                                <Menu className="w-5 h-5" />
                            </Button>
                        </SheetTrigger>
                        <MobileSidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
                    </Sheet>
                    <Link href="/admin" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
                            <Shield className="w-4 h-4 text-sidebar-primary-foreground" />
                        </div>
                        <span className="font-bold text-foreground">Admin</span>
                    </Link>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="text-foreground">
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
