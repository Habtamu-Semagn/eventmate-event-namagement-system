'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthContext';
import { getUser } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const { signIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const getRedirectUrl = (role: string): string => {
        switch (role) {
            case 'Administrator':
                return '/admin';
            case 'Organizer':
                return '/organiser';
            default:
                return '/events';
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await signIn(email, password);
            // Get user from localStorage to determine redirect
            const user = getUser();
            if (user) {
                const redirectUrl = getRedirectUrl(user.role);
                router.push(redirectUrl);
            } else {
                router.push('/');
            }
        } catch (err: any) {
            setError(err.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-black">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        <Link href="/" className="flex items-center gap-2">
                            <Calendar className="h-8 w-8 text-[#AC1212]" />
                            <h1 className="text-2xl font-bold">
                                Event<span className="text-[#AC1212]">Mate</span>
                            </h1>
                        </Link>
                    </div>
                    <CardTitle className="text-2xl">Welcome back</CardTitle>
                    <CardDescription>
                        Enter your email and password to sign in to your account
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        {error && (
                            <div className="rounded-md bg-red-50 p-3 text-sm text-red-500 dark:bg-red-900/20">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium">
                                Email
                            </label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium">
                                Password
                            </label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button type="submit" className="w-full bg-[#AC1212] hover:bg-[#8a0f0f]" disabled={loading}>
                            {loading ? 'Signing in...' : 'Sign In'}
                        </Button>
                        <p className="text-center text-sm text-muted-foreground">
                            Don't have an account?{' '}
                            <Link href="/register" className="font-medium text-[#AC1212] hover:underline">
                                Sign up
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
