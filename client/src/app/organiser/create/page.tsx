'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Location } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Calendar, MapPin, Users, Ticket, Save, Upload, X, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

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
    imageUrl?: string;
}

const categories = [
    'Cultural', 'Educational', 'Social', 'Sports', 'Music',
    'Art', 'Technology', 'Business', 'Health', 'Other'
];

const categoryIcons: Record<string, string> = {
    Cultural: '🎭',
    Educational: '📚',
    Social: '🎉',
    Sports: '⚽',
    Music: '🎵',
    Art: '🎨',
    Technology: '💻',
    Business: '💼',
    Health: '🏥',
    Other: '📌'
};

export default function CreateEventPage() {
    const router = useRouter();
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
        location: { address: '', city: '', country: 'USA' },
        isFree: true,
        ticketPrice: 0,
    });

    const [validation, setValidation] = useState<Record<string, boolean>>({});

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
        // Clear validation on change
        if (name) {
            setValidation(prev => ({ ...prev, [name]: true }));
        }
    };

    const handleCategoryChange = (value: string) => {
        setFormData(prev => ({ ...prev, category: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        // Basic validation
        if (!formData.title || !formData.description || !formData.date || !formData.location.address || !formData.location.city) {
            setError('Please fill in all required fields');
            setLoading(false);
            return;
        }

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            setSuccess('Event created successfully! Redirecting...');
            setTimeout(() => router.push('/dashboard/events'), 1500);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create event');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">

                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Create Event</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Fill in the details to create a new event</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <Card className="border-gray-200 shadow-sm">
                    <CardHeader className="border-b pb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#AC1212]/10 flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-[#AC1212]" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Basic Information</CardTitle>
                                <CardDescription>Event title, description and category</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        <div className="grid gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="title">Event Title <span className="text-red-500">*</span></Label>
                                <Input
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter event title"
                                    className="border-gray-200 focus:border-[#AC1212] focus:ring-[#AC1212]"
                                />
                            </div>

                            <div className="grid gap-3">
                                <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    rows={4}
                                    placeholder="Describe your event in detail..."
                                    className="border-gray-200 focus:border-[#AC1212] focus:ring-[#AC1212] resize-none"
                                />
                            </div>

                            <div className="grid gap-3">
                                <Label>Category <span className="text-red-500">*</span></Label>
                                <Select value={formData.category} onValueChange={handleCategoryChange}>
                                    <SelectTrigger className="border-gray-200 focus:border-[#AC1212] focus:ring-[#AC1212]">
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map(cat => (
                                            <SelectItem key={cat} value={cat}>
                                                <span className="flex items-center gap-2">
                                                    {categoryIcons[cat]} {cat}
                                                </span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Image Upload Placeholder */}
                            <div className="grid gap-3">
                                <Label>Event Image</Label>
                                <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg p-8 text-center hover:border-[#AC1212] transition-colors cursor-pointer">
                                    <Upload className="w-8 h-8 text-slate-400 dark:text-slate-500 mx-auto mb-2" />
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Click to upload or drag and drop</p>
                                    <p className="text-xs text-slate-400 dark:text-slate-500">PNG, JPG up to 5MB</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Date & Time */}
                <Card className="border-gray-200 shadow-sm">
                    <CardHeader className="border-b pb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Date & Time</CardTitle>
                                <CardDescription>When will the event take place?</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="date">Start Date & Time <span className="text-red-500">*</span></Label>
                                <div className="relative">
                                    <Input
                                        id="date"
                                        name="date"
                                        type="datetime-local"
                                        value={formData.date}
                                        onChange={handleChange}
                                        required
                                        className="border-gray-200 focus:border-[#AC1212] focus:ring-[#AC1212] pl-10"
                                    />
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                </div>
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="endDate">End Date & Time</Label>
                                <div className="relative">
                                    <Input
                                        id="endDate"
                                        name="endDate"
                                        type="datetime-local"
                                        value={formData.endDate}
                                        onChange={handleChange}
                                        className="border-gray-200 focus:border-[#AC1212] focus:ring-[#AC1212] pl-10"
                                    />
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Location */}
                <Card className="border-gray-200 shadow-sm">
                    <CardHeader className="border-b pb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                                <MapPin className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Location</CardTitle>
                                <CardDescription>Where will the event be held?</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        <div className="grid gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="location.address">Venue Address <span className="text-red-500">*</span></Label>
                                <div className="relative">
                                    <Input
                                        id="location.address"
                                        name="location.address"
                                        value={formData.location.address}
                                        onChange={handleChange}
                                        required
                                        placeholder="Street address"
                                        className="border-gray-200 focus:border-[#AC1212] focus:ring-[#AC1212] pl-10"
                                    />
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="grid gap-3">
                                    <Label htmlFor="location.city">City <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="location.city"
                                        name="location.city"
                                        value={formData.location.city}
                                        onChange={handleChange}
                                        required
                                        placeholder="City"
                                        className="border-gray-200 focus:border-[#AC1212] focus:ring-[#AC1212]"
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="location.country">Country <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="location.country"
                                        name="location.country"
                                        value={formData.location.country}
                                        onChange={handleChange}
                                        required
                                        placeholder="Country"
                                        className="border-gray-200 focus:border-[#AC1212] focus:ring-[#AC1212]"
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Capacity & Ticketing */}
                <Card className="border-gray-200 shadow-sm">
                    <CardHeader className="border-b pb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#EEB42C]/20 flex items-center justify-center">
                                <Users className="w-5 h-5 text-[#EEB42C]" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Capacity & Ticketing</CardTitle>
                                <CardDescription>Set capacity and ticket pricing</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        <div className="grid gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="capacity">Maximum Capacity <span className="text-red-500">*</span></Label>
                                <div className="relative">
                                    <Input
                                        id="capacity"
                                        name="capacity"
                                        type="number"
                                        value={formData.capacity}
                                        onChange={handleChange}
                                        required
                                        min="1"
                                        className="border-gray-200 focus:border-[#AC1212] focus:ring-[#AC1212] pl-10"
                                    />
                                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                                </div>
                            </div>

                            {/* Ticketing Toggle */}
                            <Separator />

                            <div className="border rounded-xl p-4 space-y-4 bg-gray-50/50 dark:bg-gray-800">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label className="text-base">Event Type</Label>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {formData.isFree ? 'Free event (RSVP only)' : 'Paid event (requires ticket)'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-sm ${formData.isFree ? 'text-[#AC1212] font-medium dark:text-red-400' : 'text-gray-400 dark:text-gray-500'}`}>Free</span>
                                        <Switch
                                            checked={!formData.isFree}
                                            onCheckedChange={(checked) =>
                                                setFormData(prev => ({ ...prev, isFree: !checked }))
                                            }
                                        />
                                        <span className={`text-sm ${!formData.isFree ? 'text-[#AC1212] font-medium dark:text-red-400' : 'text-gray-400 dark:text-gray-500'}`}>Paid</span>
                                    </div>
                                </div>

                                {!formData.isFree && (
                                    <div className="grid gap-3 animate-in slide-in-from-top-2">
                                        <Label htmlFor="ticketPrice">Ticket Price ($)</Label>
                                        <div className="relative">
                                            <Input
                                                id="ticketPrice"
                                                name="ticketPrice"
                                                type="number"
                                                value={formData.ticketPrice}
                                                onChange={handleChange}
                                                min="0"
                                                step="0.01"
                                                placeholder="0.00"
                                                className="border-gray-200 focus:border-[#AC1212] focus:ring-[#AC1212] pl-10"
                                            />
                                            <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Messages & Submit */}
                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-600">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        {error}
                    </div>
                )}

                {success && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-600">
                        <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                        {success}
                    </div>
                )}

                <div className="flex gap-4 pt-4">
                    <Link href="/dashboard" className="flex-1">
                        <Button type="button" variant="outline" className="w-full border-gray-200 hover:bg-gray-50">
                            Cancel
                        </Button>
                    </Link>
                    <Button
                        type="submit"
                        className="flex-1 bg-[#AC1212] hover:bg-[#8a0f0f] shadow-lg shadow-[#AC1212]/25 font-medium text-white"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                Creating...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5 mr-2" />
                                Create Event
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
