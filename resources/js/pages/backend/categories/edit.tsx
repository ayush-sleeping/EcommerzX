import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { CircleAlert, FolderKanban, Image as ImageIcon, Save, Tag } from 'lucide-react';
import { useState } from 'react';
import Select from 'react-select';
import { toast } from 'sonner';

interface Collection {
    id: number;
    name: string;
}

interface Category {
    id: number;
    name: string;
    slug: string;
    collection_id: number;
    index: number;
    photo?: string;
}

interface PageProps {
    category: Category;
    collections: Collection[];
    [key: string]: unknown;
}

export default function Edit() {
    const { category, collections } = usePage<PageProps>().props;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [photoPreview, setPhotoPreview] = useState<string | null>(category.photo ? `${window.location.origin}/storage/${category.photo}` : null);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Categories',
            href: '/admin/categories',
        },
        {
            title: 'Edit Category',
            href: `/admin/categories/${category.id}/edit`,
        },
    ];

    const { data, setData, errors } = useForm({
        name: category.name,
        slug: category.slug,
        collection_id: category.collection_id,
        index: category.index,
        photo: null as File | null,
    });

    const collectionOptions = collections.map((collection) => ({
        value: collection.id,
        label: collection.name,
    }));

    const handleNameChange = (value: string) => {
        setData('name', value);
        setData(
            'slug',
            value
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, ''),
        );
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('photo', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        router.post(
            route('admin.categories.update', category.id),
            {
                ...data,
                _method: 'PUT',
            },
            {
                onSuccess: () => {
                    setIsSubmitting(false);
                    toast.success('Category updated successfully!');
                },
                onError: () => {
                    setIsSubmitting(false);
                    toast.error('Failed to update category. Please check the form.');
                },
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Category" />

            <div className="m-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Edit Category</h1>
                            <p className="text-muted-foreground">Update category details and information.</p>
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
                                    <FolderKanban className="h-5 w-5" />
                                    Category Information
                                </CardTitle>
                                <CardDescription>Update the category's basic details.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-6 md:grid-cols-2">
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
                                        onChange={(e) => handleNameChange(e.target.value)}
                                        placeholder="e.g. Formal Shirts, Casual Shoes"
                                        className="transition-all"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 dark:text-gray-400">The name for this category</p>
                                    {errors.name && <p className="text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="slug" className="flex items-center gap-2 font-medium">
                                        <Tag className="h-4 w-4" />
                                        Slug
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="slug"
                                        type="text"
                                        value={data.slug}
                                        onChange={(e) => setData('slug', e.target.value)}
                                        placeholder="e.g. formal-shirts"
                                        className="transition-all"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 dark:text-gray-400">URL-friendly version of the name</p>
                                    {errors.slug && <p className="text-sm text-red-600 dark:text-red-400">{errors.slug}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="collection_id" className="flex items-center gap-2 font-medium">
                                        <FolderKanban className="h-4 w-4" />
                                        Collection
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        options={collectionOptions}
                                        value={collectionOptions.find((opt) => opt.value === data.collection_id)}
                                        onChange={(selected) => setData('collection_id', selected?.value || 0)}
                                        placeholder="Select Collection..."
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                        isClearable
                                    />
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Select the parent collection</p>
                                    {errors.collection_id && <p className="text-sm text-red-600 dark:text-red-400">{errors.collection_id}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="photo" className="flex items-center gap-2 font-medium">
                                        <ImageIcon className="h-4 w-4" />
                                        Image (336W × 224H)
                                    </Label>
                                    <Input id="photo" type="file" accept="image/*" onChange={handlePhotoChange} className="transition-all" />
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Upload new category image (optional)</p>
                                    {errors.photo && <p className="text-sm text-red-600 dark:text-red-400">{errors.photo}</p>}

                                    {photoPreview && (
                                        <div className="mt-4">
                                            <img src={photoPreview} alt="Preview" className="h-32 w-48 rounded-md border object-cover" />
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="mt-8 flex justify-end gap-4">
                        <Link href={route('admin.categories.index')}>
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
                                    Update Category
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
