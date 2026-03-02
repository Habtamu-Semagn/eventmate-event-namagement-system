"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useTheme } from "@/components/theme-provider"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import {
    LayoutDashboard,
    Calendar,
    Users,
    FileText,
    ClipboardList,
    Bell,
    Settings,
    LogOut,
    Activity,
    Search,
    Menu,
    Moon,
    Sun,
    Shield,
    History,
} from "lucide-react"

interface SidebarItem {
    icon: React.ElementType
    label: string
    href: string
    badge?: string
}

const sidebarItems: SidebarItem[] = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    { icon: Calendar, label: "Events", href: "/admin/events", badge: "24" },
    { icon: Users, label: "Users", href: "/admin/users", badge: "1.2k" },
    { icon: FileText, label: "Content", href: "/admin/content" },
    { icon: History, label: "Audit Trail", href: "/admin/audit" },
]

// Navigation Item Component
function NavItem({ href, label, icon: Icon, isActive, onClick }: { href: string; label: string; icon: any; isActive: boolean; onClick?: () => void }) {
    const { theme } = useTheme()
    return (
        <Link
            href={href}
            onClick={onClick}
            className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                    ? theme === "dark"
                        ? "bg-red-600 text-white shadow-md"
                        : "bg-[#AC1212] text-white shadow-md"
                    : theme === "dark"
                        ? "text-slate-300 hover:bg-slate-800 hover:text-white"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            )}
        >
            <Icon className={cn("w-5 h-5", isActive ? "text-white" : theme === "dark" ? "text-slate-400" : "text-gray-500")} />
            {label}
        </Link>
    )
}

// Mobile Sidebar
function MobileSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const pathname = usePathname()
    const { theme, toggleTheme } = useTheme()

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent side="left" className="w-72 p-0 border-r">
                <div className="flex flex-col h-full">
                    {/* Logo Section */}
                    <div className="h-16 flex items-center gap-3 px-6 border-b bg-background">
                        <div className="w-9 h-9 bg-red-600 rounded-lg flex items-center justify-center shadow-lg">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-lg">Admin Panel</span>
                    </div>

                    {/* Search */}
                    <div className="p-3">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="h-9 w-full rounded-md border bg-background pl-9 pr-3 text-sm outline-none focus:ring-1 focus:ring-red-600"
                            />
                        </div>
                    </div>

                    {/* Navigation */}
                    <ScrollArea className="flex-1 py-2 px-3">
                        <nav className="space-y-1">
                            {sidebarItems.map((item) => {
                                const isActive = pathname === item.href ||
                                    (item.href !== "/admin" && pathname.startsWith(item.href))
                                return (
                                    <NavItem
                                        key={item.href}
                                        href={item.href}
                                        label={item.label}
                                        icon={item.icon}
                                        isActive={isActive}
                                        onClick={onClose}
                                    />
                                )
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
                            {theme === "dark" ? (
                                <>
                                    <Sun className="w-4 h-4" />
                                    <span>Light Mode</span>
                                </>
                            ) : (
                                <>
                                    <Moon className="w-4 h-4" />
                                    <span>Dark Mode</span>
                                </>
                            )}
                        </Button>
                    </div>

                    {/* User Section */}
                    <div className="p-4 bg-muted">
                        <div className="flex items-center gap-3 mb-3">
                            <Avatar className="h-10 w-10 border-2 border-border">
                                <AvatarFallback className="bg-red-600 text-white font-medium">
                                    A
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold truncate">Admin</p>
                                <p className="text-xs text-muted-foreground truncate">admin@eventmate.com</p>
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
                                    className="text-muted-foreground hover:text-red-600 hover:bg-red-50"
                                >
                                    <LogOut className="w-4 h-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}

// Desktop Sidebar
function DesktopSidebar() {
    const pathname = usePathname()
    const { theme, toggleTheme } = useTheme()

    return (
        <aside className="fixed top-0 left-0 z-40 h-screen w-64 bg-background border-r shadow-sm">
            <div className="flex flex-col h-full">
                {/* Logo Section */}
                <div className="h-16 flex items-center gap-3 px-6 border-b border-border">
                    <div className="w-9 h-9 bg-red-600 rounded-lg flex items-center justify-center shadow-lg">
                        <Shield className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-lg">Admin Panel</span>
                </div>

                {/* Search */}
                <div className="p-3">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="h-9 w-full rounded-md border bg-background pl-9 pr-3 text-sm outline-none focus:ring-1 focus:ring-red-600"
                        />
                    </div>
                </div>

                {/* Navigation */}
                <ScrollArea className="flex-1 py-4 px-3">
                    <nav className="space-y-1">
                        {sidebarItems.map((item) => {
                            const isActive = pathname === item.href ||
                                (item.href !== "/admin" && pathname.startsWith(item.href))
                            return (
                                <NavItem
                                    key={item.href}
                                    href={item.href}
                                    label={item.label}
                                    icon={item.icon}
                                    isActive={isActive}
                                />
                            )
                        })}
                    </nav>
                </ScrollArea>

                <Separator />

                {/* Theme Toggle */}
                <div className="p-4 bg-muted">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleTheme}
                        className="w-full flex items-center justify-center gap-2"
                    >
                        {theme === "dark" ? (
                            <>
                                <Sun className="w-4 h-4" />
                                <span>Light Mode</span>
                            </>
                        ) : (
                            <>
                                <Moon className="w-4 h-4" />
                                <span>Dark Mode</span>
                            </>
                        )}
                    </Button>
                </div>

                {/* User Section */}
                <div className="p-4 bg-muted">
                    <div className="flex items-center gap-3 mb-3">
                        <Avatar className="h-10 w-10 border-2 border-border">
                            <AvatarFallback className="bg-red-600 text-white font-medium">
                                A
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">Admin</p>
                            <p className="text-xs text-muted-foreground truncate">admin@eventmate.com</p>
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
                                className="text-muted-foreground hover:text-red-600 hover:bg-red-50"
                            >
                                <LogOut className="w-4 h-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </aside>
    )
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [mounted, setMounted] = useState(false)

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
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
                        <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                            <Shield className="w-4 h-4 text-white" />
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

            {/* Main Content - with left padding for fixed sidebar */}
            <main className="lg:pl-64 pt-16 lg:pt-0">
                <div className="p-6 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
