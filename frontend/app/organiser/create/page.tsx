"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
    DollarSign,
    Clock,
    Upload,
    ArrowLeft,
    ArrowRight,
    CheckCircle
} from "lucide-react"
import Link from 'next/link'

export default function OrganiserCreateEventPage() {
    const { theme } = useTheme()
    const [step, setStep] = useState(1)
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
        isFree: false,
        price: '',
        ticketTypes: [{ name: 'General', price: '', quantity: '' }],
    })

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

    return (
        <div className="space-y-6">
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
                            <Label htmlFor="title" className={theme === "dark" ? "text-slate-300" : ""}>Event Title</Label>
                            <Input
                                id="title"
                                placeholder="Enter event title"
                                value={formData.title}
                                onChange={(e) => updateFormData('title', e.target.value)}
                                className={theme === "dark" ? "bg-slate-800 border-slate-700" : ""}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description" className={theme === "dark" ? "text-slate-300" : ""}>Description</Label>
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
                            <Label htmlFor="category" className={theme === "dark" ? "text-slate-300" : ""}>Category</Label>
                            <Select value={formData.category} onValueChange={(value) => updateFormData('category', value)}>
                                <SelectTrigger className={theme === "dark" ? "bg-slate-800 border-slate-700" : ""}>
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="technology">Technology</SelectItem>
                                    <SelectItem value="music">Music</SelectItem>
                                    <SelectItem value="art">Art</SelectItem>
                                    <SelectItem value="business">Business</SelectItem>
                                    <SelectItem value="sports">Sports</SelectItem>
                                    <SelectItem value="health">Health</SelectItem>
                                    <SelectItem value="education">Education</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
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
                                <Label htmlFor="date" className={theme === "dark" ? "text-slate-300" : ""}>Event Date</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => updateFormData('date', e.target.value)}
                                    className={theme === "dark" ? "bg-slate-800 border-slate-700" : ""}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="time" className={theme === "dark" ? "text-slate-300" : ""}>Event Time</Label>
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
                            <Label htmlFor="location" className={theme === "dark" ? "text-slate-300" : ""}>Venue Name</Label>
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
                                placeholder="Maximum number of attendees"
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

                        {!formData.isFree && (
                            <>
                                <div className="space-y-4">
                                    {formData.ticketTypes.map((ticket, index) => (
                                        <div key={index} className={`p-4 rounded-lg border ${theme === "dark" ? "border-slate-700" : "border-gray-200"}`}>
                                            <div className="flex items-center justify-between mb-4">
                                                <h4 className={theme === "dark" ? "text-slate-100 font-medium" : "font-medium"}>Ticket Type {index + 1}</h4>
                                                {formData.ticketTypes.length > 1 && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeTicketType(index)}
                                                        className="text-red-500 hover:text-red-600"
                                                    >
                                                        Remove
                                                    </Button>
                                                )}
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                <div className="space-y-2">
                                                    <Label className={theme === "dark" ? "text-slate-400" : ""}>Name</Label>
                                                    <Input
                                                        placeholder="e.g., General, VIP"
                                                        value={ticket.name}
                                                        onChange={(e) => updateTicketType(index, 'name', e.target.value)}
                                                        className={theme === "dark" ? "bg-slate-800 border-slate-700" : ""}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className={theme === "dark" ? "text-slate-400" : ""}>Price ($)</Label>
                                                    <Input
                                                        type="number"
                                                        placeholder="0.00"
                                                        value={ticket.price}
                                                        onChange={(e) => updateTicketType(index, 'price', e.target.value)}
                                                        className={theme === "dark" ? "bg-slate-800 border-slate-700" : ""}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className={theme === "dark" ? "text-slate-400" : ""}>Quantity</Label>
                                                    <Input
                                                        type="number"
                                                        placeholder="100"
                                                        value={ticket.quantity}
                                                        onChange={(e) => updateTicketType(index, 'quantity', e.target.value)}
                                                        className={theme === "dark" ? "bg-slate-800 border-slate-700" : ""}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <Button
                                    variant="outline"
                                    onClick={addTicketType}
                                    className={theme === "dark" ? "border-slate-700 hover:bg-slate-800" : ""}
                                >
                                    Add Another Ticket Type
                                </Button>
                            </>
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
                                    <p className={theme === "dark" ? "text-slate-100" : ""}>{formData.capacity || 'Not set'} attendees</p>
                                </div>
                                <div>
                                    <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-muted-foreground"}`}>Pricing</p>
                                    <p className={theme === "dark" ? "text-slate-100" : ""}>{formData.isFree ? 'Free Event' : `${formData.ticketTypes.length} ticket type(s)`}</p>
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
                        >
                            Next
                            <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                    ) : (
                        <Button className={theme === "dark" ? "bg-green-600 hover:bg-green-700" : "bg-green-600 hover:bg-green-700"}>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Create Event
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
