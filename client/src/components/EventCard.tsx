'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { registerForEvent } from '@/lib/api';
import { Event } from '@/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface EventCardProps {
    event: Event;
    onRSVP?: (eventId: string) => void;
    isRegistered: boolean;
}

export default function EventCard({ event, onRSVP, isRegistered }: EventCardProps) {
    const router = useRouter();
    const { user } = useAuth();
    const [registering, setRegistering] = useState(false);
    const [error, setError] = useState('');

    const formatDate = (dateString?: string): string => {
        if (!dateString) return 'TBD';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatTime = (dateString?: string): string => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleRSVP = async () => {
        // Check if user is logged in
        if (!user) {
            router.push('/login');
            return;
        }

        const registeredCount = event.registeredCount || 0;
        const capacity = event.capacity || 0;

        if (registeredCount >= capacity) {
            setError('This event is full');
            return;
        }

        setRegistering(true);
        setError('');

        try {
            const token = await user.getIdToken();
            await registerForEvent(event.id, token);
            onRSVP?.(event.id);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to register');
        } finally {
            setRegistering(false);
        }
    };

    const spotsLeft = (event.capacity || 0) - (event.registeredCount || 0);
    const isFull = spotsLeft <= 0;

    const categoryColors: Record<string, string> = {
        'Cultural': '#AC1212',
        'Educational': '#4A0202',
        'Social': '#DC901E',
    };

    const getButtonText = () => {
        if (registering) return 'Registering...';
        if (isRegistered) return 'Registered';
        if (isFull) return 'Sold Out';
        return user ? 'Book Now' : 'Sign in to Book';
    };

    const getButtonClass = () => {
        if (isRegistered) return 'bg-green-600 hover:bg-green-700';
        if (isFull) return 'bg-gray-400 cursor-not-allowed';
        return 'bg-[#AC1212] hover:bg-[#8a0f0f]';
    };

    return (
        <div className="group overflow-hidden rounded-2xl bg-white dark:bg-slate-800 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl">
            <div
                className="relative h-48 w-full"
                style={{ background: categoryColors[event.category] || '#AC1212' }}
            >
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl">🎉</span>
                </div>
                <span className="absolute left-4 top-4 rounded-full bg-white/90 dark:bg-slate-900/80 px-4 py-1.5 text-sm font-semibold uppercase text-slate-900 dark:text-white">
                    {event.category || 'Event'}
                </span>
                {isFull && (
                    <span className="absolute right-4 top-4 rounded bg-red-600 px-3 py-1.5 text-sm font-semibold text-white">
                        Sold Out
                    </span>
                )}
            </div>

            <div className="p-5">
                <Link href={`/events/${event.id}`}>
                    <h3 className="mb-2 text-xl font-semibold text-slate-900 dark:text-white line-clamp-1 hover:text-[#AC1212] transition-colors">{event.title || 'Untitled Event'}</h3>
                </Link>

                <div className="mb-4 flex flex-col gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                        <span className="text-[#AC1212]">📅</span>
                        <span>{formatDate(event.date)} • {formatTime(event.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[#AC1212]">📍</span>
                        <span>{event.location?.city || 'Location TBD'}, {event.location?.country}</span>
                    </div>
                </div>

                <p className="mb-4 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{event.description || 'No description available'}</p>

                {error && <p className="mb-3 text-sm text-red-600 dark:text-red-400">{error}</p>}

                <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700 pt-4">
                    <div>
                        <span className="text-lg font-bold text-[#AC1212]">Free</span>
                    </div>
                    <Button
                        className={getButtonClass()}
                        onClick={handleRSVP}
                        disabled={registering || isFull || isRegistered}
                    >
                        {getButtonText()}
                    </Button>
                </div>
            </div>
        </div>
    );
}
