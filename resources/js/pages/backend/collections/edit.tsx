import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { CircleAlert, FolderOpen, Save, Tag } from 'lucide-react';
import { useState } from 'react';
import Select, { type MultiValue } from 'react-select';
import { toast } from 'sonner';

interface Attribute {
    id: number;
    name: string;
    label: string;
}

interface Collection {
    id: number;
    hashid: string;
    name: string;
    attribute_ids: number[];
    index: number;
    status: string;
}

interface PageProps {
    collection: Collection;
    attributes: Attribute[];
    [key: string]: unknown;
}

export default function Edit() {
    const { collection, attributes } = usePage<PageProps>().props;
    const [isSubmitting, setIsSubmitting] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Collections',
            href: '/admin/collections',
        },
        {
            title: 'Edit Collection',
            href: `/admin/collections/${collection.hashid}/edit`,
        },
    ];

    const { data, setData, errors } = useForm({
        name: collection.name,
        attribute_ids: collection.attribute_ids || [],
        index: collection.index,
    });

    const attributeOptions = attributes.map((attr) => ({
        value: attr.id,
        label: attr.label,
    }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        router.put(route('admin.collections.update', collection.id), data, {
            onSuccess: () => {
                setIsSubmitting(false);
                toast.success('Collection updated successfully!');
            },
            onError: () => {
                setIsSubmitting(false);
                toast.error('Failed to update collection. Please check the form.');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Collection" />

            <div className="m-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Edit Collection</h1>
                            <p className="text-muted-foreground">Update collection details and attributes.</p>
                        </div>
                    </div>
                </div>
            </div>

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

            <div className="mx-4 mb-8">
                <form onSubmit={handleSubmit} className="mx-auto max-w-6xl">
                    <div className="grid gap-6">
                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FolderOpen className="h-5 w-5" />
                                    Collection Information
                                </CardTitle>
                                <CardDescription>Update the collection's basic details and attributes.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-6">
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
                                        placeholder="e.g. T-Shirts, Shoes, Electronics"
                                        className="transition-all"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 dark:text-gray-400">The name for this collection</p>
                                    {errors.name && <p className="text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="attribute_ids" className="flex items-center gap-2 font-medium">
                                        <Tag className="h-4 w-4" />
                                        Attributes
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        isMulti
                                        options={attributeOptions}
                                        value={attributeOptions.filter((opt) => data.attribute_ids.includes(opt.value))}
                                        onChange={(selected: MultiValue<{ value: number; label: string }>) => {
                                            const ids = selected ? Array.from(selected).map((item) => item.value) : [];
                                            setData('attribute_ids', ids);
                                        }}
                                        placeholder="Select attributes..."
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                    />
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Select multiple attributes for this collection</p>
                                    {errors.attribute_ids && <p className="text-sm text-red-600 dark:text-red-400">{errors.attribute_ids}</p>}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="mt-8 flex justify-end gap-4">
                        <Link href={route('admin.collections.index')}>
                            <Button variant="outline" type="button">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={isSubmitting} className="min-w-[140px]">
                            {isSubmitting ? (
                                <>
                                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Update Collection
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
