'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, Save } from 'lucide-react';

export default function ProfilePage() {
    const router = useRouter();
    const { user, userData, signOut } = useAuth();
    const [displayName, setDisplayName] = useState(userData?.displayName || '');
    const [email, setEmail] = useState(user?.email || '');
    const [saving, setSaving] = useState(false);

    if (!user) {
        return (
            <div className="flex min-h-screen flex-col">
                <Navbar />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-4">Please sign in to view your profile</h2>
                        <Button asChild className="bg-[#AC1212] hover:bg-[#8a0f0f]">
                            <a href="/login">Sign In</a>
                        </Button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSaving(true);
        // In a real app, this would update the user profile via API
        setTimeout(() => {
            setSaving(false);
        }, 1000);
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
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 py-8">
                <div className="container mx-auto px-4">
                    <div className="mx-auto max-w-2xl">
                        <h1 className="mb-8 text-3xl font-bold">My Profile</h1>

                        <div className="mb-8 flex items-center gap-4">
                            <Avatar className="h-20 w-20">
                                <AvatarImage src="" alt={userData?.displayName || 'User'} />
                                <AvatarFallback className="bg-[#AC1212] text-white text-2xl">
                                    {userData?.displayName ? getInitials(userData.displayName) : 'U'}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h2 className="text-2xl font-semibold">{userData?.displayName || 'User'}</h2>
                                <p className="text-muted-foreground capitalize">{userData?.role?.replace('_', ' ')}</p>
                            </div>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Profile Information</CardTitle>
                                <CardDescription>Update your personal information</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <label htmlFor="displayName" className="text-sm font-medium flex items-center gap-2">
                                            <User className="h-4 w-4" />
                                            Full Name
                                        </label>
                                        <Input
                                            id="displayName"
                                            type="text"
                                            value={displayName}
                                            onChange={(e) => setDisplayName(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                                            <Mail className="h-4 w-4" />
                                            Email
                                        </label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            disabled
                                        />
                                        <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                                    </div>
                                    <Button type="submit" className="bg-[#AC1212] hover:bg-[#8a0f0f]" disabled={saving}>
                                        <Save className="mr-2 h-4 w-4" />
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle>Account Actions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Button
                                    variant="destructive"
                                    onClick={async () => {
                                        await signOut();
                                        router.push('/');
                                    }}
                                >
                                    Sign Out
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
