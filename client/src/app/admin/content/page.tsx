'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    FileText,
    Search,
    Image,
    Video,
    File,
    Calendar,
    AlertTriangle,
    CheckCircle,
    Trash2,
    Eye,
    Edit,
    Flag,
    MoreHorizontal
} from 'lucide-react';

// Mock content data
const mockContent = [
    { id: '1', title: 'Tech Conference 2026', type: 'event', status: 'published', author: 'John Doe', createdDate: '2026-01-15', views: 4523, flagged: false },
    { id: '2', title: 'Music Festival Promo', type: 'image', status: 'published', author: 'Jane Smith', createdDate: '2026-01-20', views: 2341, flagged: false },
    { id: '3', title: 'Inappropriate Content Report', type: 'event', status: 'flagged', author: 'Unknown', createdDate: '2026-01-22', views: 0, flagged: true },
    { id: '4', title: 'Art Workshop Details', type: 'event', status: 'draft', author: 'Bob Wilson', createdDate: '2026-01-25', views: 0, flagged: false },
    { id: '5', title: 'Business Summit Info', type: 'event', status: 'published', author: 'Alice Brown', createdDate: '2026-01-28', views: 1834, flagged: false },
    { id: '6', title: 'Spam Content', type: 'event', status: 'flagged', author: 'Spam Bot', createdDate: '2026-02-01', views: 0, flagged: true },
    { id: '7', title: 'Event Guidelines', type: 'document', status: 'published', author: 'Admin', createdDate: '2024-12-01', views: 12453, flagged: false },
];

const contentTypes = [
    { value: 'all', label: 'All Types', icon: FileText },
    { value: 'event', label: 'Events', icon: Calendar },
    { value: 'image', label: 'Images', icon: Image },
    { value: 'video', label: 'Videos', icon: Video },
    { value: 'document', label: 'Documents', icon: File },
];

export default function ContentManagementPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredContent = mockContent.filter(content => {
        const matchesSearch = content.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = typeFilter === 'all' || content.type === typeFilter;
        const matchesStatus = statusFilter === 'all' || content.status === statusFilter;
        return matchesSearch && matchesType && matchesStatus;
    });

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            published: 'bg-green-100 text-green-700 border-green-200',
            draft: 'bg-gray-100 text-gray-700 border-gray-200',
            flagged: 'bg-red-100 text-red-700 border-red-200',
            archived: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        };
        return styles[status] || styles.draft;
    };

    const getTypeIcon = (type: string) => {
        const icons: Record<string, any> = {
            event: FileText,
            image: Image,
            video: Video,
            document: File,
        };
        return icons[type] || FileText;
    };

    const publishedCount = mockContent.filter(c => c.status === 'published').length;
    const flaggedCount = mockContent.filter(c => c.status === 'flagged').length;
    const draftCount = mockContent.filter(c => c.status === 'draft').length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Content Management</h1>
                    <p className="text-gray-500 mt-1">Manage and moderate platform content</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Published</p>
                                <p className="text-3xl font-bold text-green-600 mt-1">{publishedCount}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Flagged</p>
                                <p className="text-3xl font-bold text-red-600 mt-1">{flaggedCount}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
                                <Flag className="w-6 h-6 text-red-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Drafts</p>
                                <p className="text-3xl font-bold text-gray-600 mt-1">{draftCount}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                                <FileText className="w-6 h-6 text-gray-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card className="border-gray-200 shadow-sm">
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Search content..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger className="w-full md:w-[150px]">
                                <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                                {contentTypes.map(type => (
                                    <SelectItem key={type.value} value={type.value}>
                                        {type.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full md:w-[150px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="published">Published</SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="flagged">Flagged</SelectItem>
                                <SelectItem value="archived">Archived</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Content Table */}
            <Card className="border-gray-200 shadow-sm">
                <CardHeader className="border-b">
                    <CardTitle className="text-xl">All Content</CardTitle>
                    <CardDescription>{filteredContent.length} items found</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-gray-50">
                            <TableRow>
                                <TableHead className="font-semibold">Content</TableHead>
                                <TableHead className="font-semibold">Type</TableHead>
                                <TableHead className="font-semibold">Status</TableHead>
                                <TableHead className="font-semibold">Author</TableHead>
                                <TableHead className="font-semibold">Created</TableHead>
                                <TableHead className="font-semibold">Views</TableHead>
                                <TableHead className="font-semibold text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredContent.map((content) => {
                                const TypeIcon = getTypeIcon(content.type);
                                return (
                                    <TableRow key={content.id} className="hover:bg-gray-50/50">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${content.flagged ? 'bg-red-100' : 'bg-gray-100'}`}>
                                                    <TypeIcon className={`w-5 h-5 ${content.flagged ? 'text-red-600' : 'text-gray-600'}`} />
                                                </div>
                                                <span className="font-medium text-gray-900">{content.title}</span>
                                                {content.flagged && (
                                                    <Flag className="w-4 h-4 text-red-500" />
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="capitalize text-gray-600">{content.type}</span>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={getStatusBadge(content.status)}>
                                                {content.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-gray-600">{content.author}</TableCell>
                                        <TableCell className="text-gray-500">{content.createdDate}</TableCell>
                                        <TableCell className="text-gray-600">{content.views.toLocaleString()}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-end gap-1">
                                                <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                                                    <Eye className="w-4 h-4 text-gray-600" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                                                    <Edit className="w-4 h-4 text-gray-600" />
                                                </Button>
                                                {content.status !== 'flagged' ? (
                                                    <Button variant="ghost" size="icon" className="hover:bg-red-50">
                                                        <Flag className="w-4 h-4 text-red-500" />
                                                    </Button>
                                                ) : (
                                                    <>
                                                        <Button variant="ghost" size="icon" className="hover:bg-green-50">
                                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="hover:bg-red-50">
                                                            <Trash2 className="w-4 h-4 text-red-500" />
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
