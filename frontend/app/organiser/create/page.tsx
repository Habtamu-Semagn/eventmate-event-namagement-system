"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useTheme } from "@/components/theme-provider"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Calendar,
    MapPin,
    Users,
    Clock,
    Upload,
    ArrowLeft,
    ArrowRight,
    CheckCircle,
    Loader2,
    AlertCircle
} from "lucide-react"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthContext'
import { eventsApi } from '@/lib/api'

export default function OrganiserCreateEventPage() {
    const { theme } = useTheme()
    const router = useRouter()
    const { user, userData } = useAuth()
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        date: '',
        time: '',
        location: '',
        city: '',
        country: '',
        capacity: '',
        isFree: true,
        price: '',
        ticketTypes: [{ name: 'General', price: '', quantity: '' }],
    })

    // Redirect if not organizer or admin
    if (!user || (userData?.role !== 'Organizer' && userData?.role !== 'Administrator')) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
                    <p className="text-muted-foreground mb-4">You need to be an organizer to create events.</p>
                    <Button asChild className="bg-[#AC1212] hover:bg-[#8a0f0f]">
                        <Link href="/">Go Home</Link>
                    </Button>
                </div>
            </div>
        )
    }

    const updateFormData = (field: string, value: any) => {
        setFormData({ ...formData, [field]: value })
    }

    const addTicketType = () => {
        setFormData({
            ...formData,
            ticketTypes: [...formData.ticketTypes, { name: '', price: '', quantity: '' }]
        })
    }

    const removeTicketType = (index: number) => {
        setFormData({
            ...formData,
            ticketTypes: formData.ticketTypes.filter((_, i) => i !== index)
        })
    }

    const updateTicketType = (index: number, field: string, value: string) => {
        const updated = [...formData.ticketTypes]
        updated[index] = { ...updated[index], [field]: value }
        setFormData({ ...formData, ticketTypes: updated })
    }

    const handleSubmit = async () => {
        setLoading(true)
        setError('')

        try {
            const eventData = {
                title: formData.title,
                description: formData.description,
                category: formData.category,
                date: formData.date,
                time: formData.time,
                location_venue: formData.location,
                capacity: parseInt(formData.capacity) || 0,
                is_paid: !formData.isFree,
            }

            await eventsApi.create(eventData)
            setSuccess(true)

            // Redirect to events page after success
            setTimeout(() => {
                router.push('/organiser/events')
            }, 2000)
        } catch (err: any) {
            setError(err.message || 'Failed to create event. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const canProceed = () => {
        switch (step) {
            case 1:
                return formData.title && formData.description && formData.category
            case 2:
                return formData.date && formData.time && formData.location
            case 3:
                return formData.isFree || formData.ticketTypes.length > 0
            case 4:
                return true
            default:
                return false
        }
    }

    return (
        <div className="space-y-6">
            {/* Success Message */}
            {success && (
                <Card className="border-green-500 bg-green-50 dark:bg-green-900/20">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                            <CheckCircle className="h-5 w-5" />
                            <p>Event created successfully! Redirecting to your events...</p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Error Message */}
            {error && (
                <Card className="border-red-500">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2 text-red-500">
                            <AlertCircle className="h-5 w-5" />
                            <p>{error}</p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className={`text-3xl font-bold tracking-tight ${theme === "dark" ? "text-slate-100" : ""}`}>Create Event</h1>
                    <p className={theme === "dark" ? "text-slate-400" : "text-muted-foreground"}>Set up a new event for your attendees</p>
                </div>
            </div>

            {/* Progress Steps */}
            <Card className={theme === "dark" ? "border-slate-800 bg-slate-900" : ""}>
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                        {[
                            { step: 1, title: 'Basic Info' },
                            { step: 2, title: 'Date & Location' },
                            { step: 3, title: 'Tickets' },
                            { step: 4, title: 'Review' },
                        ].map((item, index) => (
                            <div key={item.step} className="flex items-center">
                                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${step >= item.step
                                    ? 'border-red-600 bg-red-600 text-white'
                                    : theme === "dark"
                                        ? 'border-slate-700 text-slate-500'
                                        : 'border-gray-300 text-gray-400'
                                    }`}>
                                    {step > item.step ? (
                                        <CheckCircle className="w-5 h-5" />
                                    ) : (
                                        <span className="font-medium">{item.step}</span>
                                    )}
                                </div>
                                <span className={`ml-2 hidden sm:inline ${step >= item.step
                                    ? theme === "dark" ? "text-slate-100" : ""
                                    : theme === "dark" ? "text-slate-500" : "text-gray-400"
                                    }`}>
                                    {item.title}
                                </span>
                                {index < 3 && (
                                    <div className={`w-12 sm:w-24 h-0.5 mx-2 ${step > item.step
                                        ? 'bg-red-600'
                                        : theme === "dark"
                                            ? 'bg-slate-700'
                                            : 'bg-gray-300'
                                        }`} />
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Step Content */}
            {step === 1 && (
                <Card className={theme === "dark" ? "border-slate-800 bg-slate-900" : ""}>
                    <CardHeader>
                        <CardTitle className={theme === "dark" ? "text-slate-100" : ""}>Basic Information</CardTitle>
                        <CardDescription className={theme === "dark" ? "text-slate-400" : ""}>Enter the basic details of your event</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title" className={theme === "dark" ? "text-slate-300" : ""}>Event Title *</Label>
                            <Input
                                id="title"
                                placeholder="Enter event title"
                                value={formData.title}
                                onChange={(e) => updateFormData('title', e.target.value)}
                                className={theme === "dark" ? "bg-slate-800 border-slate-700" : ""}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description" className={theme === "dark" ? "text-slate-300" : ""}>Description *</Label>
                            <Textarea
                                id="description"
                                placeholder="Describe your event..."
                                value={formData.description}
                                onChange={(e) => updateFormData('description', e.target.value)}
                                className={theme === "dark" ? "bg-slate-800 border-slate-700" : ""}
                                rows={5}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category" className={theme === "dark" ? "text-slate-300" : ""}>Category *</Label>
                            <Select value={formData.category} onValueChange={(value) => updateFormData('category', value)}>
                                <SelectTrigger className={theme === "dark" ? "bg-slate-800 border-slate-700" : ""}>
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Technology">Technology</SelectItem>
                                    <SelectItem value="Music">Music</SelectItem>
                                    <SelectItem value="Art">Art</SelectItem>
                                    <SelectItem value="Business">Business</SelectItem>
                                    <SelectItem value="Sports">Sports</SelectItem>
                                    <SelectItem value="Health">Health</SelectItem>
                                    <SelectItem value="Education">Education</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className={theme === "dark" ? "text-slate-300" : ""}>Cover Image</Label>
                            <div className={`border-2 border-dashed rounded-lg p-8 text-center ${theme === "dark" ? "border-slate-700" : "border-gray-300"}`}>
                                <Upload className={`h-10 w-10 mx-auto mb-4 ${theme === "dark" ? "text-slate-500" : "text-gray-400"}`} />
                                <p className={theme === "dark" ? "text-slate-400" : "text-muted-foreground"}>Click to upload or drag and drop</p>
                                <p className={`text-sm mt-1 ${theme === "dark" ? "text-slate-500" : "text-muted-foreground"}`}>PNG, JPG up to 10MB</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {step === 2 && (
                <Card className={theme === "dark" ? "border-slate-800 bg-slate-900" : ""}>
                    <CardHeader>
                        <CardTitle className={theme === "dark" ? "text-slate-100" : ""}>Date & Location</CardTitle>
                        <CardDescription className={theme === "dark" ? "text-slate-400" : ""}>When and where will your event take place?</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="date" className={theme === "dark" ? "text-slate-300" : ""}>Event Date *</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => updateFormData('date', e.target.value)}
                                    className={theme === "dark" ? "bg-slate-800 border-slate-700" : ""}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="time" className={theme === "dark" ? "text-slate-300" : ""}>Event Time *</Label>
                                <Input
                                    id="time"
                                    type="time"
                                    value={formData.time}
                                    onChange={(e) => updateFormData('time', e.target.value)}
                                    className={theme === "dark" ? "bg-slate-800 border-slate-700" : ""}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="location" className={theme === "dark" ? "text-slate-300" : ""}>Venue Name *</Label>
                            <Input
                                id="location"
                                placeholder="Enter venue name"
                                value={formData.location}
                                onChange={(e) => updateFormData('location', e.target.value)}
                                className={theme === "dark" ? "bg-slate-800 border-slate-700" : ""}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="city" className={theme === "dark" ? "text-slate-300" : ""}>City</Label>
                                <Input
                                    id="city"
                                    placeholder="Enter city"
                                    value={formData.city}
                                    onChange={(e) => updateFormData('city', e.target.value)}
                                    className={theme === "dark" ? "bg-slate-800 border-slate-700" : ""}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="country" className={theme === "dark" ? "text-slate-300" : ""}>Country</Label>
                                <Input
                                    id="country"
                                    placeholder="Enter country"
                                    value={formData.country}
                                    onChange={(e) => updateFormData('country', e.target.value)}
                                    className={theme === "dark" ? "bg-slate-800 border-slate-700" : ""}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="capacity" className={theme === "dark" ? "text-slate-300" : ""}>Capacity</Label>
                            <Input
                                id="capacity"
                                type="number"
                                placeholder="Maximum number of attendees (0 = unlimited)"
                                value={formData.capacity}
                                onChange={(e) => updateFormData('capacity', e.target.value)}
                                className={theme === "dark" ? "bg-slate-800 border-slate-700" : ""}
                            />
                        </div>
                    </CardContent>
                </Card>
            )}

            {step === 3 && (
                <Card className={theme === "dark" ? "border-slate-800 bg-slate-900" : ""}>
                    <CardHeader>
                        <CardTitle className={theme === "dark" ? "text-slate-100" : ""}>Tickets</CardTitle>
                        <CardDescription className={theme === "dark" ? "text-slate-400" : ""}>Set up your ticket types and pricing</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center gap-4">
                            <input
                                type="checkbox"
                                id="isFree"
                                checked={formData.isFree}
                                onChange={(e) => updateFormData('isFree', e.target.checked)}
                                className="w-4 h-4"
                            />
                            <Label htmlFor="isFree" className={theme === "dark" ? "text-slate-300" : ""}>This is a free event</Label>
                        </div>

                        {formData.isFree && (
                            <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-slate-800" : "bg-slate-50"}`}>
                                <p className={theme === "dark" ? "text-slate-300" : ""}>This will be a free event. Attendees can register without payment.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {step === 4 && (
                <Card className={theme === "dark" ? "border-slate-800 bg-slate-900" : ""}>
                    <CardHeader>
                        <CardTitle className={theme === "dark" ? "text-slate-100" : ""}>Review & Submit</CardTitle>
                        <CardDescription className={theme === "dark" ? "text-slate-400" : ""}>Review your event details before submitting</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-slate-800" : "bg-slate-50"}`}>
                            <h3 className={`text-lg font-semibold mb-4 ${theme === "dark" ? "text-slate-100" : ""}`}>Event Summary</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-muted-foreground"}`}>Title</p>
                                    <p className={theme === "dark" ? "text-slate-100" : ""}>{formData.title || 'Not set'}</p>
                                </div>
                                <div>
                                    <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-muted-foreground"}`}>Category</p>
                                    <p className={theme === "dark" ? "text-slate-100" : ""}>{formData.category || 'Not set'}</p>
                                </div>
                                <div>
                                    <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-muted-foreground"}`}>Date & Time</p>
                                    <p className={theme === "dark" ? "text-slate-100" : ""}>{formData.date} at {formData.time || 'Not set'}</p>
                                </div>
                                <div>
                                    <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-muted-foreground"}`}>Location</p>
                                    <p className={theme === "dark" ? "text-slate-100" : ""}>{formData.location}, {formData.city}, {formData.country}</p>
                                </div>
                                <div>
                                    <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-muted-foreground"}`}>Capacity</p>
                                    <p className={theme === "dark" ? "text-slate-100" : ""}>{formData.capacity || 'Unlimited'} attendees</p>
                                </div>
                                <div>
                                    <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-muted-foreground"}`}>Pricing</p>
                                    <p className={theme === "dark" ? "text-slate-100" : ""}>{formData.isFree ? 'Free Event' : 'Paid Event'}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between">
                <div>
                    {step > 1 && (
                        <Button
                            variant="outline"
                            onClick={() => setStep(step - 1)}
                            className={theme === "dark" ? "border-slate-700 hover:bg-slate-800" : ""}
                            disabled={loading}
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Previous
                        </Button>
                    )}
                </div>
                <div>
                    {step < 4 ? (
                        <Button
                            onClick={() => setStep(step + 1)}
                            className={theme === "dark" ? "bg-primary" : ""}
                            disabled={!canProceed()}
                        >
                            Next
                            <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSubmit}
                            className={theme === "dark" ? "bg-green-600 hover:bg-green-700" : "bg-green-600 hover:bg-green-700"}
                            disabled={loading}
                        >
                            {loading ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</>
                            ) : (
                                <><CheckCircle className="mr-2 h-4 w-4" /> Create Event</>
                            )}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
