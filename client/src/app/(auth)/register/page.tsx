'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { auth } from '@/lib/firebaseApp';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';

const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string()
        .min(6, 'Password must be at least 6 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
    role: z.enum(['registered_user', 'organizer'], {
        message: 'Please select a role',
    }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: 'registered_user',
        },
    });

    const onSubmit = async (data: RegisterFormValues) => {
        setIsLoading(true);
        setError('');

        try {
            // Create Firebase user
            await createUserWithEmailAndPassword(auth, data.email, data.password);

            // Register with backend to create Firestore profile
            const response = await fetch('/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: data.email,
                    password: data.password,
                    displayName: data.name,
                    role: data.role,
                }),
            });

            if (!response.ok) {
                let errorMessage = 'Registration failed. Please try again.';
                try {
                    const contentType = response.headers.get('content-type');
                    if (contentType && contentType.includes('application/json')) {
                        const errorData = await response.json();
                        errorMessage = errorData.error || errorData.message || errorMessage;
                    } else {
                        // Server returned non-JSON response (likely an error page)
                        console.error('Server error:', response.statusText);
                    }
                } catch (parseError) {
                    console.error('Error parsing response:', parseError);
                }
                throw new Error(errorMessage);
            }

            router.push('/');
        } catch (err: any) {
            console.error('Registration error:', err);

            // Handle Firebase-specific errors
            if (err.code === 'auth/email-already-in-use') {
                setError('This email is already registered');
            } else if (err.code === 'auth/weak-password') {
                setError('Password is too weak');
            } else if (err.code === 'auth/configuration-not-found') {
                setError('Email/Password auth not enabled. Go to Firebase Console > Authentication > Enable Email/Password');
            } else if (err.message && err.message.includes('Email/Password auth not enabled')) {
                setError(err.message);
            } else {
                setError(err.message || 'Failed to create account. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
                    <CardDescription>
                        Enter your details to create a new account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="mb-4 rounded-md bg-red-100 p-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="alemayehu wasie"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder="your@email.com"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="••••••••"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="••••••••"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Account Type</FormLabel>
                                        <div className="grid grid-cols-2 gap-4 mt-2">
                                            <label
                                                className={cn(
                                                    "cursor-pointer rounded-lg border-2 p-4 transition-all",
                                                    field.value === 'registered_user'
                                                        ? "border-[#AC1212] bg-red-50"
                                                        : "border-gray-200 hover:border-gray-300"
                                                )}
                                            >
                                                <input
                                                    type="radio"
                                                    value="registered_user"
                                                    checked={field.value === 'registered_user'}
                                                    onChange={() => field.onChange('registered_user')}
                                                    className="sr-only"
                                                />
                                                <div className="text-center">
                                                    <span className="text-2xl mb-2 block">👤</span>
                                                    <span className={cn(
                                                        "font-medium block",
                                                        field.value === 'registered_user' ? "text-[#AC1212]" : "text-gray-700"
                                                    )}>Registered User</span>
                                                    <span className="text-xs text-gray-500 mt-1 block">Browse and attend events</span>
                                                </div>
                                            </label>
                                            <label
                                                className={cn(
                                                    "cursor-pointer rounded-lg border-2 p-4 transition-all",
                                                    field.value === 'organizer'
                                                        ? "border-[#AC1212] bg-red-50"
                                                        : "border-gray-200 hover:border-gray-300"
                                                )}
                                            >
                                                <input
                                                    type="radio"
                                                    value="organizer"
                                                    checked={field.value === 'organizer'}
                                                    onChange={() => field.onChange('organizer')}
                                                    className="sr-only"
                                                />
                                                <div className="text-center">
                                                    <span className="text-2xl mb-2 block">🎯</span>
                                                    <span className={cn(
                                                        "font-medium block",
                                                        field.value === 'organizer' ? "text-[#AC1212]" : "text-gray-700"
                                                    )}>Organizer</span>
                                                    <span className="text-xs text-gray-500 mt-1 block">Create and manage events</span>
                                                </div>
                                            </label>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                className="w-full bg-[#AC1212] hover:bg-[#8a0f0f]"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Creating account...' : 'Create Account'}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <div className="text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link href="/login" className="font-medium text-[#AC1212] hover:underline">
                            Sign in
                        </Link>
                    </div>
                    <Link href="/" className="text-center text-sm text-gray-500 hover:text-gray-700">
                        ← Back to Home
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
