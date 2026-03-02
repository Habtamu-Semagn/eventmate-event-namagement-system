'use client';

import { useAuth } from '@/components/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Settings, Bell, Moon, Mail } from 'lucide-react';

export default function SettingsPage() {
    const { user } = useAuth();

    if (!user) {
        return (
            <div className="flex min-h-screen flex-col">
                <Navbar />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-4">Please sign in to view settings</h2>
                        <Button asChild className="bg-[#AC1212] hover:bg-[#8a0f0f]">
                            <a href="/login">Sign In</a>
                        </Button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 py-8">
                <div className="container mx-auto px-4">
                    <div className="mx-auto max-w-2xl">
                        <h1 className="mb-8 text-3xl font-bold flex items-center gap-2">
                            <Settings className="h-8 w-8" />
                            Settings
                        </h1>

                        <div className="space-y-6">
                            {/* Notification Settings */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Bell className="h-5 w-5" />
                                        Notifications
                                    </CardTitle>
                                    <CardDescription>Manage your notification preferences</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">Email Notifications</p>
                                            <p className="text-sm text-muted-foreground">Receive email updates about events</p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">Event Reminders</p>
                                            <p className="text-sm text-muted-foreground">Get reminded before events start</p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">Marketing Emails</p>
                                            <p className="text-sm text-muted-foreground">Receive promotional content</p>
                                        </div>
                                        <Switch />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Appearance Settings */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Moon className="h-5 w-5" />
                                        Appearance
                                    </CardTitle>
                                    <CardDescription>Customize how EventMate looks</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">Dark Mode</p>
                                            <p className="text-sm text-muted-foreground">Use dark theme</p>
                                        </div>
                                        <Switch />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Privacy Settings */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Mail className="h-5 w-5" />
                                        Privacy
                                    </CardTitle>
                                    <CardDescription>Manage your privacy settings</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">Profile Visibility</p>
                                            <p className="text-sm text-muted-foreground">Allow others to see your profile</p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
