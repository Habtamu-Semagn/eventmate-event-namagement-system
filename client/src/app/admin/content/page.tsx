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
            published: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
            draft: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
            flagged: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
            archived: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
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
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Content Management</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and moderate platform content</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Published</p>
                                <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">{publishedCount}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Flagged</p>
                                <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-1">{flaggedCount}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-900/30 flex items-center justify-center">
                                <Flag className="w-6 h-6 text-red-600 dark:text-red-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Drafts</p>
                                <p className="text-3xl font-bold text-slate-600 dark:text-slate-300 mt-1">{draftCount}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                <FileText className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card className="border-slate-200 dark:border-slate-700 shadow-sm">
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
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
            <Card className="border-slate-200 dark:border-slate-700 shadow-sm">
                <CardHeader className="border-b dark:border-slate-700">
                    <CardTitle className="text-xl">All Content</CardTitle>
                    <CardDescription>{filteredContent.length} items found</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-slate-50 dark:bg-slate-800">
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
                                    <TableRow key={content.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${content.flagged ? 'bg-red-100 dark:bg-red-900/30' : 'bg-slate-100 dark:bg-slate-800'}`}>
                                                    <TypeIcon className={`w-5 h-5 ${content.flagged ? 'text-red-600 dark:text-red-400' : 'text-slate-600 dark:text-slate-400'}`} />
                                                </div>
                                                <span className="font-medium text-slate-900 dark:text-white">{content.title}</span>
                                                {content.flagged && (
                                                    <Flag className="w-4 h-4 text-red-500 dark:text-red-400" />
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="capitalize text-slate-600 dark:text-slate-300">{content.type}</span>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={getStatusBadge(content.status)}>
                                                {content.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-slate-600 dark:text-slate-300">{content.author}</TableCell>
                                        <TableCell className="text-slate-500 dark:text-slate-400">{content.createdDate}</TableCell>
                                        <TableCell className="text-slate-600 dark:text-slate-300">{content.views.toLocaleString()}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-end gap-1">
                                                <Button variant="ghost" size="icon" className="hover:bg-slate-100 dark:hover:bg-slate-800">
                                                    <Eye className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="hover:bg-slate-100 dark:hover:bg-slate-800">
                                                    <Edit className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                                </Button>
                                                {content.status !== 'flagged' ? (
                                                    <Button variant="ghost" size="icon" className="hover:bg-red-50 dark:hover:bg-red-900/20">
                                                        <Flag className="w-4 h-4 text-red-500 dark:text-red-400" />
                                                    </Button>
                                                ) : (
                                                    <>
                                                        <Button variant="ghost" size="icon" className="hover:bg-green-50 dark:hover:bg-green-900/20">
                                                            <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="hover:bg-red-50 dark:hover:bg-red-900/20">
                                                            <Trash2 className="w-4 h-4 text-red-500 dark:text-red-400" />
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
