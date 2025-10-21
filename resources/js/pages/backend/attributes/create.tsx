import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { CircleAlert, Plus, Settings2, Tag } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Attributes',
        href: '/admin/attributes',
    },
    {
        title: 'Create New Attribute',
        href: '/admin/attributes/create',
    },
];

interface PageProps {
    [key: string]: unknown;
}

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        label: '',
        is_color: '0',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.attributes.store'), {
            onSuccess: () => {
                setData({
                    name: '',
                    label: '',
                    is_color: '0',
                });
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Attribute" />

            {/* Header Section */}
            <div className="m-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Create New Attribute</h1>
                            <p className="text-muted-foreground">Add a new product attribute to the system.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Error Messages */}
            {Object.keys(errors).length > 0 && (
                <div className="mx-4 mb-6">
                    <Alert variant="destructive" className="border-red-200 bg-red-50 dark:border-red-800/50 dark:bg-red-900/10">
                        <CircleAlert className="h-5 w-5" />
                        <div>
                            <AlertTitle>Validation Errors</AlertTitle>
                            <AlertDescription>
                                <ul className="mt-2 list-inside list-disc space-y-1">
                                    {Object.entries(errors).map(([field, message]) => (
                                        <li key={field}>
                                            <span className="font-medium capitalize">{field.replace('_', ' ')}</span>: {message}
                                        </li>
                                    ))}
                                </ul>
                            </AlertDescription>
                        </div>
                    </Alert>
                </div>
            )}

            {/* Main Form */}
            <div className="mx-4 mb-8">
                <form onSubmit={handleSubmit} className="mx-auto max-w-6xl">
                    <div className="grid gap-6">
                        {/* Attribute Information Card */}
                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Settings2 className="h-5 w-5" />
                                    Attribute Information
                                </CardTitle>
                                <CardDescription>Enter the attribute's basic details and configuration.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-6 md:grid-cols-2">
                                {/* Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="flex items-center gap-2 font-medium">
                                        <Tag className="h-4 w-4" />
                                        Name
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="e.g. color, size, material"
                                        className="transition-all"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        The internal name for this attribute (lowercase, no spaces)
                                    </p>
                                    {errors.name && <p className="text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
                                </div>

                                {/* Label */}
                                <div className="space-y-2">
                                    <Label htmlFor="label" className="flex items-center gap-2 font-medium">
                                        <Tag className="h-4 w-4" />
                                        Label
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="label"
                                        type="text"
                                        value={data.label}
                                        onChange={(e) => setData('label', e.target.value)}
                                        placeholder="e.g. Color, Size, Material"
                                        className="transition-all"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 dark:text-gray-400">The display name shown to users</p>
                                    {errors.label && <p className="text-sm text-red-600 dark:text-red-400">{errors.label}</p>}
                                </div>

                                {/* Is Color */}
                                <div className="space-y-2">
                                    <Label htmlFor="is_color" className="font-medium">
                                        Is Color Attribute?
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Select value={data.is_color} onValueChange={(value) => setData('is_color', value)}>
                                        <SelectTrigger className="transition-all">
                                            <SelectValue placeholder="Select option" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="0">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-2 w-2 rounded-full bg-gray-500"></div>
                                                    No
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="1">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                                    Yes
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Select "Yes" if this attribute represents colors (will enable color picker)
                                    </p>
                                    {errors.is_color && <p className="text-sm text-red-600 dark:text-red-400">{errors.is_color}</p>}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Form Actions */}
                    <div className="mt-8 flex justify-end gap-4">
                        <Link href={route('admin.attributes.index')}>
                            <Button variant="outline" type="button">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing} className="min-w-[140px]">
                            {processing ? (
                                <>
                                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Attribute
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
