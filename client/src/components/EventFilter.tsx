'use client';

import { useState } from 'react';
import { EventFilters } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface EventFilterProps {
    onFilterChange: (filters: EventFilters) => void;
}

const CATEGORIES = ['All', 'Cultural', 'Educational', 'Social'];
const LOCATIONS = ['All', 'New York', 'San Francisco', 'Chicago', 'Los Angeles', 'Boston'];

export default function EventFilter({ onFilterChange }: EventFilterProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [category, setCategory] = useState('All');
    const [location, setLocation] = useState('All');

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
        onFilterChange({ search: value, category, location: location === 'All' ? '' : location });
    };

    const handleCategoryChange = (value: string) => {
        setCategory(value);
        onFilterChange({ search: searchQuery, category: value === 'All' ? '' : value, location: location === 'All' ? '' : location });
    };

    const handleLocationChange = (value: string) => {
        setLocation(value);
        onFilterChange({ search: searchQuery, category: category === 'All' ? '' : category, location: value === 'All' ? '' : value });
    };

    const handleReset = () => {
        setSearchQuery('');
        setCategory('All');
        setLocation('All');
        onFilterChange({ search: '', category: '', location: '' });
    };

    return (
        <div className="mx-auto mb-8 mt-8 flex flex-wrap items-center gap-4 rounded-lg bg-white p-6 shadow-md max-w-[1200px]">
            <div className="relative min-w-[200px] flex-1">
                <Input
                    type="text"
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="pl-10"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2">🔍</span>
            </div>

            <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">Category:</span>
                <Select value={category} onValueChange={handleCategoryChange}>
                    <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                        {CATEGORIES.map(cat => (
                            <SelectItem key={cat} value={cat}>
                                {cat}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">Location:</span>
                <Select value={location} onValueChange={handleLocationChange}>
                    <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                        {LOCATIONS.map(loc => (
                            <SelectItem key={loc} value={loc}>
                                {loc}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <Button
                variant="outline"
                onClick={handleReset}
            >
                Reset Filters
            </Button>
        </div>
    );
}
