'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Moon, Sun } from 'lucide-react';

interface NavbarProps {
    onNavigate: (view: 'home' | 'discover' | 'organizer' | 'admin') => void;
}

export default function Navbar({ onNavigate }: NavbarProps) {
    const router = useRouter();
    const { user, userData, signIn, signUp, signOut } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [showDropdown, setShowDropdown] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            if (authMode === 'login') {
                await signIn(email, password);
            } else {
                await signUp(email, password, displayName, 'registered_user');
            }
            setShowAuthModal(false);
            setEmail('');
            setPassword('');
            setDisplayName('');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut();
            onNavigate('home');
            router.push('/');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        }
    };

    const handleLoginClick = () => {
        router.push('/login');
    };

    const handleRegisterClick = () => {
        router.push('/register');
    };

    return (
        <>
            <nav className="sticky top-0 z-50 flex h-16 items-center justify-between bg-background px-6 shadow-sm md:px-12 border-b border-border">
                <div className="flex items-center gap-8">
                    <Link href="/" className="cursor-pointer">
                        <h1 className="text-2xl font-bold text-foreground">Event<span className="text-[#AC1212]">Mate</span></h1>
                    </Link>

                    <div className="hidden items-center gap-6 md:flex">
                        <Link
                            href="/"
                            className="text-muted-foreground hover:text-[#AC1212] transition-colors"
                        >
                            Home
                        </Link>
                        <Link
                            href="/#discover"
                            className="text-muted-foreground hover:text-[#AC1212] transition-colors"
                        >
                            Discover
                        </Link>

                        <Select onValueChange={(value) => {
                            if (value === 'cultural' || value === 'educational' || value === 'social') {
                                onNavigate('discover');
                            }
                        }}>
                            <SelectTrigger className="w-[150px] border-none bg-transparent text-muted-foreground hover:text-[#AC1212] hover:bg-transparent focus:ring-0">
                                <SelectValue placeholder="Categories" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="cultural">Cultural</SelectItem>
                                <SelectItem value="educational">Educational</SelectItem>
                                <SelectItem value="social">Social</SelectItem>
                            </SelectContent>
                        </Select>

                        <Link
                            href="/#about"
                            className="text-muted-foreground hover:text-[#AC1212] transition-colors"
                        >
                            About
                        </Link>
                        <Link
                            href="/#contact"
                            className="text-muted-foreground hover:text-[#AC1212] transition-colors"
                        >
                            Contact
                        </Link>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Theme Toggle Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheme}
                        className="text-muted-foreground hover:text-[#AC1212]"
                    >
                        {theme === 'light' ? (
                            <Moon className="h-5 w-5" />
                        ) : (
                            <Sun className="h-5 w-5" />
                        )}
                    </Button>

                    {user ? (
                        <div className="relative">
                            <Button
                                variant="secondary"
                                className="bg-secondary text-secondary-foreground hover:bg-secondary/80 border-none"
                                onClick={() => setShowDropdown(!showDropdown)}
                            >
                                {userData?.displayName || user.email?.split('@')[0]}
                            </Button>

                            {showDropdown && (
                                <div className="absolute right-0 top-full mt-2 min-w-[200px] overflow-hidden rounded-lg bg-card shadow-xl border">
                                    <div className="flex flex-col border-b p-4">
                                        <strong className="text-card-foreground">{userData?.displayName || 'User'}</strong>
                                        <span className="text-sm text-muted-foreground capitalize">{userData?.role?.replace('_', ' ')}</span>
                                    </div>

                                    <Link
                                        href="/profile"
                                        className="block w-full px-4 py-3 text-left text-card-foreground hover:bg-accent"
                                        onClick={() => setShowDropdown(false)}
                                    >
                                        My Profile
                                    </Link>

                                    {user && (userData?.role === 'event_organizer' || userData?.role === 'system_admin') && (
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start rounded-none text-card-foreground hover:bg-accent"
                                            onClick={() => {
                                                onNavigate('organizer');
                                                setShowDropdown(false);
                                            }}
                                        >
                                            My Events
                                        </Button>
                                    )}
                                    {user && userData?.role === 'system_admin' && (
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start rounded-none text-card-foreground hover:bg-accent"
                                            onClick={() => {
                                                onNavigate('admin');
                                                setShowDropdown(false);
                                            }}
                                        >
                                            Admin
                                        </Button>
                                    )}
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start rounded-none text-card-foreground hover:bg-accent"
                                        onClick={handleSignOut}
                                    >
                                        Sign Out
                                    </Button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Button
                                variant="ghost"
                                className="text-muted-foreground hover:text-[#AC1212]"
                                onClick={handleLoginClick}
                            >
                                Sign In
                            </Button>
                            <Button
                                className="bg-[#AC1212] hover:bg-[#8a0f0f]"
                                onClick={handleRegisterClick}
                            >
                                Sign Up
                            </Button>
                        </>
                    )}
                </div>
            </nav>
        </>
    );
}
