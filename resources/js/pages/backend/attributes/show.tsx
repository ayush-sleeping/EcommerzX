import ProtectedSection from '@/components/protected-section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Calendar, Edit, Hash, Palette, Settings2, Tag, Type } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Attributes',
        href: '/admin/attributes',
    },
    {
        title: 'Attribute Details',
        href: '#',
    },
];

interface AttributeValue {
    id: number;
    name: string;
    color: string | null;
    status: string;
    slug: string;
    index: number;
}

interface Attribute {
    id: number;
    hashid: string;
    name: string;
    label: string;
    is_color: boolean;
    status: string;
    slug: string;
    index: number;
    created_at: string;
    updated_at: string;
    values?: AttributeValue[];
    createdBy?: {
        id: number;
        first_name: string;
        last_name: string;
    } | null;
    updatedBy?: {
        id: number;
        first_name: string;
        last_name: string;
    } | null;
}

interface Props {
    attribute: Attribute;
    [key: string]: unknown;
}

export default function Show() {
    const { attribute } = usePage<Props>().props;

    const statusColor =
        attribute.status === 'ACTIVE'
            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';

    const isColorBadge = attribute.is_color
        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Attribute: ${attribute.label}`} />

            {/* Header with Back Button */}
            <div className="m-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Attribute Details</h1>
                        <p className="text-muted-foreground">View detailed information about {attribute.label}.</p>
                    </div>
                    <div className="flex gap-2">
                        <Link href={route('admin.attributes.index')}>
                            <Button variant="outline">Back to Attributes</Button>
                        </Link>
                        <ProtectedSection permission="attribute-update" showDeniedMessage={false}>
                            <Link href={route('admin.attributes.edit', attribute.id)}>
                                <Button>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Attribute
                                </Button>
                            </Link>
                        </ProtectedSection>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="mx-4 mb-8">
                <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
                    {/* Basic Information Card */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Settings2 className="h-5 w-5" />
                                Basic Information
                            </CardTitle>
                            <CardDescription>Core details and configuration of the attribute.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <span className="flex items-center gap-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                                    <Tag className="h-4 w-4" />
                                    Name
                                </span>
                                <span className="font-mono text-lg font-semibold text-gray-900 dark:text-gray-100">{attribute.name}</span>
                            </div>

                            <div className="space-y-2">
                                <span className="flex items-center gap-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                                    <Type className="h-4 w-4" />
                                    Label
                                </span>
                                <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">{attribute.label}</span>
                            </div>

                            <div className="space-y-2">
                                <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">Status</span>
                                <Badge className={statusColor}>{attribute.status}</Badge>
                            </div>

                            <div className="space-y-2">
                                <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">Is Color Attribute</span>
                                <Badge className={isColorBadge}>{attribute.is_color ? 'Yes' : 'No'}</Badge>
                            </div>

                            <div className="space-y-2">
                                <span className="flex items-center gap-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                                    <Hash className="h-4 w-4" />
                                    Slug
                                </span>
                                <span className="font-mono text-sm text-gray-900 dark:text-gray-100">{attribute.slug}</span>
                            </div>

                            <div className="space-y-2">
                                <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">Display Order</span>
                                <span className="text-lg font-medium text-gray-900 dark:text-gray-100">#{attribute.index}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Attribute Values Card */}
                    {attribute.values && attribute.values.length > 0 && (
                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Palette className="h-5 w-5" />
                                    Attribute Values
                                    <Badge variant="secondary" className="ml-2">
                                        {attribute.values.length} {attribute.values.length === 1 ? 'Value' : 'Values'}
                                    </Badge>
                                </CardTitle>
                                <CardDescription>
                                    {attribute.is_color
                                        ? 'Color values associated with this attribute, including their hex codes.'
                                        : 'Text values associated with this attribute.'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                    {attribute.values.map((value) => (
                                        <div
                                            key={value.id}
                                            className="flex items-center justify-between rounded-lg border-2 border-blue-500 p-4 transition-all hover:border-blue-600 dark:border-blue-600 dark:hover:border-blue-500"
                                        >
                                            <div className="flex items-center gap-3">
                                                {attribute.is_color && value.color && (
                                                    <div
                                                        className="h-10 w-10 rounded-md border-2 border-gray-300 shadow-sm dark:border-gray-600"
                                                        style={{ backgroundColor: value.color }}
                                                        title={value.color}
                                                    />
                                                )}
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-gray-900 dark:text-gray-100">{value.name}</span>
                                                    {attribute.is_color && value.color && (
                                                        <span className="font-mono text-xs text-gray-500 dark:text-gray-400">{value.color}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <Badge
                                                variant="secondary"
                                                className={
                                                    value.status === 'ACTIVE'
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                                }
                                            >
                                                {value.status}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Technical Details Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Settings2 className="h-5 w-5" />
                                Technical Details
                            </CardTitle>
                            <CardDescription>System identifiers and technical information.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">Database ID</span>
                                <span className="font-mono text-sm text-gray-900 dark:text-gray-100">#{attribute.id}</span>
                            </div>

                            <div className="space-y-2">
                                <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">Unique Hash ID</span>
                                <span className="font-mono text-sm text-gray-900 dark:text-gray-100">{attribute.hashid}</span>
                            </div>

                            <div className="space-y-2">
                                <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">URL Slug</span>
                                <span className="font-mono text-sm text-gray-600 dark:text-gray-400">{attribute.slug}</span>
                            </div>

                            <div className="space-y-2">
                                <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">Index Position</span>
                                <span className="text-sm text-gray-900 dark:text-gray-100">{attribute.index}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* System Information Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                System Information
                            </CardTitle>
                            <CardDescription>Creation and modification tracking details.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">Created At</span>
                                <span className="text-sm text-gray-900 dark:text-gray-100">
                                    {new Date(attribute.created_at).toLocaleDateString()} at {new Date(attribute.created_at).toLocaleTimeString()}
                                </span>
                            </div>

                            <div className="space-y-2">
                                <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</span>
                                <span className="text-sm text-gray-900 dark:text-gray-100">
                                    {new Date(attribute.updated_at).toLocaleDateString()} at {new Date(attribute.updated_at).toLocaleTimeString()}
                                </span>
                            </div>

                            {attribute.createdBy && (
                                <div className="space-y-2">
                                    <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">Created By</span>
                                    <span className="text-sm text-gray-900 dark:text-gray-100">
                                        {attribute.createdBy.first_name} {attribute.createdBy.last_name}
                                    </span>
                                </div>
                            )}

                            {attribute.updatedBy && (
                                <div className="space-y-2">
                                    <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated By</span>
                                    <span className="text-sm text-gray-900 dark:text-gray-100">
                                        {attribute.updatedBy.first_name} {attribute.updatedBy.last_name}
                                    </span>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
