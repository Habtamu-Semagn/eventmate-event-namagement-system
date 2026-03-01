'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Event } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Bell,
    Send,
    Calendar,
    Users,
    Mail,
    MessageSquare,
    Clock,
    CheckCircle,
    AlertCircle,
    ArrowLeft,
    Settings,
    Tag
} from 'lucide-react';
import Link from 'next/link';

// Mock events for the dropdown
const mockEvents: Partial<Event>[] = [
    {
        id: '1',
        title: 'Tech Conference 2026',
        description: 'Annual technology conference',
        category: 'Technology',
        date: '2026-03-15T09:00:00Z',
        capacity: 500,
        registeredCount: 342,
        location: { address: '123 Tech Blvd', city: 'San Francisco', country: 'USA' },
        status: 'approved',
    },
    {
        id: '2',
        title: 'Music Festival',
        description: 'Annual music celebration',
        category: 'Music',
        date: '2026-04-20T14:00:00Z',
        capacity: 1000,
        registeredCount: 756,
        location: { address: '456 Park Ave', city: 'New York', country: 'USA' },
        status: 'approved',
    },
    {
        id: '3',
        title: 'Art Workshop',
        description: 'Hands-on art workshop',
        category: 'Art',
        date: '2026-03-25T10:00:00Z',
        capacity: 50,
        registeredCount: 45,
        location: { address: '789 Art St', city: 'Los Angeles', country: 'USA' },
        status: 'approved',
    },
];

interface NotificationTemplate {
    id: string;
    name: string;
    subject: string;
    body: string;
}

const templates: NotificationTemplate[] = [
    {
        id: 'event_reminder',
        name: 'Event Reminder',
        subject: 'Reminder: {{event_name}} is coming up!',
        body: 'Hi {{name}},\n\nThis is a friendly reminder that {{event_name}} is happening on {{event_date}} at {{event_location}}.\n\nDon\'t forget to mark your calendar!'
    },
    {
        id: 'event_update',
        name: 'Event Update',
        subject: 'Update: {{event_name}} - Important Changes',
        body: 'Hi {{name}},\n\nWe have some important updates about {{event_name}}.\n\n{{update_details}}\n\nThank you for your understanding.'
    },
    {
        id: 'registration_confirm',
        name: 'Registration Confirmation',
        subject: 'You\'re registered for {{event_name}}!',
        body: 'Hi {{name}},\n\nYour registration for {{event_name}} has been confirmed!\n\nEvent Details:\n- Date: {{event_date}}\n- Location: {{event_location}}\n\nWe look forward to seeing you there!'
    },
    {
        id: 'cancellation',
        name: 'Event Cancellation',
        subject: '{{event_name}} - Event Cancelled',
        body: 'Hi {{name}},\n\nWe regret to inform you that {{event_name}} has been cancelled.\n\nA full refund will be processed within 5-7 business days.\n\nWe apologize for any inconvenience.'
    },
    {
        id: 'custom',
        name: 'Custom Message',
        subject: '',
        body: ''
    }
];

export default function NotificationsPage() {
    const router = useRouter();
    const [selectedEventId, setSelectedEventId] = useState<string>('');
    const [selectedTemplate, setSelectedTemplate] = useState<string>('custom');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [recipientFilter, setRecipientFilter] = useState('all');
    const [sendEmail, setSendEmail] = useState(true);
    const [sendPush, setSendPush] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [sendSuccess, setSendSuccess] = useState(false);
    const [error, setError] = useState('');

    const selectedEvent = mockEvents.find(e => e.id === selectedEventId);

    const handleTemplateChange = (templateId: string) => {
        setSelectedTemplate(templateId);
        const template = templates.find(t => t.id === templateId);
        if (template && template.id !== 'custom') {
            let subject = template.subject
                .replace('{{event_name}}', selectedEvent?.title || '[Event Name]')
                .replace('{{event_date}}', selectedEvent ? new Date(selectedEvent.date!).toLocaleDateString() : '[Date]')
                .replace('{{event_location}}', selectedEvent ? `${selectedEvent.location?.city}, ${selectedEvent.location?.country}` : '[Location]');
            setSubject(subject);

            let body = template.body
                .replace('{{name}}', '[Name]')
                .replace('{{event_name}}', selectedEvent?.title || '[Event Name]')
                .replace('{{event_date}}', selectedEvent ? new Date(selectedEvent.date!).toLocaleDateString() : '[Date]')
                .replace('{{event_location}}', selectedEvent ? `${selectedEvent.location?.city}, ${selectedEvent.location?.country}` : '[Location]')
                .replace('{{update_details}}', '[Please specify the updates]');
            setMessage(body);
        }
    };

    const handleEventChange = (eventId: string) => {
        setSelectedEventId(eventId);
        // Reset template when event changes to apply new event details
        if (selectedTemplate !== 'custom') {
            handleTemplateChange(selectedTemplate);
        }
    };

    const handleSend = async () => {
        if (!selectedEventId) {
            setError('Please select an event');
            return;
        }
        if (!subject.trim()) {
            setError('Please enter a subject');
            return;
        }
        if (!message.trim()) {
            setError('Please enter a message');
            return;
        }

        setIsSending(true);
        setError('');

        // Simulate API call
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            setSendSuccess(true);
            setTimeout(() => {
                setSendSuccess(false);
                setSubject('');
                setMessage('');
                setSelectedEventId('');
                setSelectedTemplate('custom');
            }, 2000);
        } catch (err) {
            setError('Failed to send notification. Please try again.');
        } finally {
            setIsSending(false);
        }
    };

    const getRecipientCount = () => {
        if (!selectedEvent) return 0;
        switch (recipientFilter) {
            case 'all':
                return selectedEvent.registeredCount || 0;
            case 'confirmed':
                return Math.floor((selectedEvent.registeredCount || 0) * 0.8);
            case 'waitlisted':
                return Math.floor((selectedEvent.registeredCount || 0) * 0.1);
            default:
                return 0;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/organiser">
                    <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Notifications</h1>
                    <p className="text-gray-500 mt-1">Send updates and announcements to your attendees</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Form */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Event Selection */}
                    <Card className="border-gray-200 shadow-sm">
                        <CardHeader className="border-b pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-[#AC1212]/10 flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-[#AC1212]" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">Select Event</CardTitle>
                                    <CardDescription>Choose which event to send notification about</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <Select value={selectedEventId} onValueChange={handleEventChange}>
                                <SelectTrigger className="border-gray-200 focus:border-[#AC1212] focus:ring-[#AC1212]">
                                    <SelectValue placeholder="Select an event" />
                                </SelectTrigger>
                                <SelectContent>
                                    {mockEvents.map(event => (
                                        <SelectItem key={event.id} value={event.id!}>
                                            <div className="flex items-center gap-2">
                                                <span>{event.title}</span>
                                                <Badge variant="outline" className="text-xs ml-2">
                                                    {event.registeredCount} attendees
                                                </Badge>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {selectedEvent && (
                                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-gray-900">{selectedEvent.title}</p>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {new Date(selectedEvent.date!).toLocaleDateString('en-US', {
                                                    month: 'long',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })} • {selectedEvent.location?.city}, {selectedEvent.location?.country}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <Users className="w-4 h-4" />
                                            {selectedEvent.registeredCount} / {selectedEvent.capacity}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Template Selection */}
                    <Card className="border-gray-200 shadow-sm">
                        <CardHeader className="border-b pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                                    <MessageSquare className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">Message Template</CardTitle>
                                    <CardDescription>Use a template or write a custom message</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
                                <SelectTrigger className="border-gray-200 focus:border-[#AC1212] focus:ring-[#AC1212]">
                                    <SelectValue placeholder="Select a template" />
                                </SelectTrigger>
                                <SelectContent>
                                    {templates.map(template => (
                                        <SelectItem key={template.id} value={template.id}>
                                            {template.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <div className="grid gap-3">
                                <Label htmlFor="subject">Subject <span className="text-red-500">*</span></Label>
                                <Input
                                    id="subject"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    placeholder="Enter email subject"
                                    className="border-gray-200 focus:border-[#AC1212] focus:ring-[#AC1212]"
                                />
                            </div>

                            <div className="grid gap-3">
                                <Label htmlFor="message">Message <span className="text-red-500">*</span></Label>
                                <Textarea
                                    id="message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Enter your message..."
                                    rows={8}
                                    className="border-gray-200 focus:border-[#AC1212] focus:ring-[#AC1212] resize-none"
                                />
                                <p className="text-xs text-gray-400">
                                    Use {'{{name}}'} for attendee name, {'{{event_name}}'} for event name, etc.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Error & Success Messages */}
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-600">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    {sendSuccess && (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-600">
                            <CheckCircle className="w-5 h-5 flex-shrink-0" />
                            Notification sent successfully to {getRecipientCount()} recipients!
                        </div>
                    )}

                    {/* Send Button */}
                    <div className="flex gap-4">
                        <Link href="/dashboard" className="flex-1">
                            <Button type="button" variant="outline" className="w-full border-gray-200 hover:bg-gray-50">
                                Cancel
                            </Button>
                        </Link>
                        <Button
                            onClick={handleSend}
                            disabled={isSending || !selectedEventId}
                            className="flex-1 bg-[#AC1212] hover:bg-[#8a0f0f] shadow-lg shadow-[#AC1212]/25 font-medium"
                        >
                            {isSending ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5 mr-2" />
                                    Send to {getRecipientCount()} Recipients
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Sidebar - Quick Stats */}
                <div className="space-y-6">
                    {/* Recipients Summary */}
                    <Card className="border-gray-200 shadow-sm">
                        <CardHeader className="border-b pb-4">
                            <CardTitle className="text-lg">Recipients Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                    <span className="text-gray-700">Confirmed</span>
                                </div>
                                <span className="font-semibold text-gray-900">
                                    {selectedEvent ? Math.floor((selectedEvent.registeredCount || 0) * 0.8) : 0}
                                </span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Clock className="w-5 h-5 text-yellow-600" />
                                    <span className="text-gray-700">Waitlisted</span>
                                </div>
                                <span className="font-semibold text-gray-900">
                                    {selectedEvent ? Math.floor((selectedEvent.registeredCount || 0) * 0.1) : 0}
                                </span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Users className="w-5 h-5 text-gray-600" />
                                    <span className="text-gray-700">Total</span>
                                </div>
                                <span className="font-semibold text-gray-900">
                                    {selectedEvent?.registeredCount || 0}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    );
}
