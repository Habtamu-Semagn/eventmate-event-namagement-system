'use client';

import { useState, FormEvent } from 'react';
import { useAuth } from '@/context/AuthContext';
import { createEvent } from '@/lib/api';
import { Location } from '@/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface CreateEventFormProps {
    onEventCreated?: () => void;
}

interface FormData {
    title: string;
    description: string;
    category: string;
    date: string;
    endDate: string;
    capacity: number;
    location: Location;
    isFree: boolean;
    ticketPrice: number;
}

export default function CreateEventForm({ onEventCreated }: CreateEventFormProps) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState<FormData>({
        title: '',
        description: '',
        category: 'Cultural',
        date: '',
        endDate: '',
        capacity: 50,
        location: {
            address: '',
            city: '',
            country: 'USA'
        },
        isFree: true,
        ticketPrice: 0
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name.startsWith('location.')) {
            const field = name.split('.')[1] as keyof Location;
            setFormData(prev => ({
                ...prev,
                location: { ...prev.location, [field]: value }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: name === 'capacity' ? parseInt(value) || 0 : value
            }));
        }
    };

    const handleCategoryChange = (value: string) => {
        setFormData(prev => ({ ...prev, category: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            if (!user) {
                throw new Error('You must be logged in to create an event');
            }

            const token = await user.getIdToken();

            await createEvent(formData, token);

            setSuccess('Event created successfully! It will be visible after admin approval.');
            setFormData({
                title: '',
                description: '',
                category: 'Cultural',
                date: '',
                endDate: '',
                capacity: 50,
                location: { address: '', city: '', country: 'USA' },
                isFree: true,
                ticketPrice: 0
            });

            onEventCreated?.();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create event');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="mx-auto max-w-[600px]">
            <CardHeader>
                <CardTitle>Create New Event</CardTitle>
                <CardDescription>Fill in the details to create a new event</CardDescription>
            </CardHeader>
            <CardContent>
                {error && (
                    <div className="mb-4 rounded-md bg-red-100 p-3 text-sm text-red-600">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-4 rounded-md bg-green-100 p-3 text-sm text-green-600">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="title">Event Title *</Label>
                        <Input
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="Enter event title"
                        />
                    </div>

                    <div>
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows={4}
                            placeholder="Describe your event"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="category">Category *</Label>
                            <Select value={formData.category} onValueChange={handleCategoryChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Cultural">Cultural</SelectItem>
                                    <SelectItem value="Educational">Educational</SelectItem>
                                    <SelectItem value="Social">Social</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="capacity">Max Capacity *</Label>
                            <Input
                                id="capacity"
                                name="capacity"
                                type="number"
                                value={formData.capacity}
                                onChange={handleChange}
                                required
                                min="1"
                            />
                        </div>
                    </div>

                    {/* Ticketing Section */}
                    <div className="rounded-lg border p-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <Label htmlFor="isFree">Free Event</Label>
                                <p className="text-sm text-gray-500">
                                    {formData.isFree
                                        ? 'Attendees can register for free (RSVP only)'
                                        : 'Attendees need to purchase tickets'}
                                </p>
                            </div>
                            <Switch
                                id="isFree"
                                checked={formData.isFree}
                                onCheckedChange={(checked) =>
                                    setFormData(prev => ({ ...prev, isFree: checked }))
                                }
                            />
                        </div>

                        {!formData.isFree && (
                            <div>
                                <Label htmlFor="ticketPrice">Ticket Price ($) *</Label>
                                <Input
                                    id="ticketPrice"
                                    name="ticketPrice"
                                    type="number"
                                    value={formData.ticketPrice}
                                    onChange={handleChange}
                                    required={!formData.isFree}
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                />
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="date">Date & Time *</Label>
                            <Input
                                id="date"
                                name="date"
                                type="datetime-local"
                                value={formData.date}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="endDate">End Date & Time</Label>
                            <Input
                                id="endDate"
                                name="endDate"
                                type="datetime-local"
                                value={formData.endDate}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="location.address">Venue Address *</Label>
                        <Input
                            id="location.address"
                            name="location.address"
                            value={formData.location.address}
                            onChange={handleChange}
                            required
                            placeholder="Street address"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="location.city">City *</Label>
                            <Input
                                id="location.city"
                                name="location.city"
                                value={formData.location.city}
                                onChange={handleChange}
                                required
                                placeholder="City"
                            />
                        </div>

                        <div>
                            <Label htmlFor="location.country">Country *</Label>
                            <Input
                                id="location.country"
                                name="location.country"
                                value={formData.location.country}
                                onChange={handleChange}
                                required
                                placeholder="Country"
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-[#AC1212] hover:bg-[#4A0202]"
                        disabled={loading}
                    >
                        {loading ? 'Creating...' : 'Create Event'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
