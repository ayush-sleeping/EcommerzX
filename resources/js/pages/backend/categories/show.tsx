import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Edit, FolderKanban, Image as ImageIcon } from 'lucide-react';

interface Collection {
    id: number;
    name: string;
}

interface Category {
    id: number;
    name: string;
    slug: string;
    collection_id: number;
    collection?: Collection;
    index: number;
    status: string;
    photo?: string;
    created_at: string;
    updated_at: string;
}

interface PageProps {
    category: Category;
    [key: string]: unknown;
}

export default function Show({ category }: PageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Categories',
            href: '/admin/categories',
        },
        {
            title: category.name,
            href: `/admin/categories/${category.id}`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Category: ${category.name}`} />

            <div className="m-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">{category.name}</h1>
                            <p className="text-muted-foreground">Category details and information</p>
                        </div>
                    </div>
                    <Link href={route('admin.categories.edit', category.id)}>
                        <Button>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Category
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="mx-4 mb-8">
                <div className="mx-auto max-w-6xl space-y-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FolderKanban className="h-5 w-5" />
                                Basic Information
                            </CardTitle>
                            <CardDescription>General details about this category</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6 md:grid-cols-2">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Name</p>
                                <p className="mt-1 text-base font-semibold">{category.name}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Slug</p>
                                <p className="mt-1 font-mono text-sm">{category.slug}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Status</p>
                                <div className="mt-1">
                                    <Badge variant={category.status === 'ACTIVE' ? 'default' : 'secondary'}>{category.status}</Badge>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Index</p>
                                <p className="mt-1 text-base font-semibold">{category.index}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Collection</p>
                                <p className="mt-1 text-base font-semibold">{category.collection?.name || 'N/A'}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Category Image */}
                    {category.photo && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ImageIcon className="h-5 w-5" />
                                    Category Image
                                </CardTitle>
                                <CardDescription>Category display image</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-center">
                                    <img
                                        src={`${window.location.origin}/storage/${category.photo}`}
                                        alt={category.name}
                                        className="h-56 w-84 rounded-lg border-2 object-cover shadow-md"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Metadata */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Metadata</CardTitle>
                            <CardDescription>Timestamp information</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Created At</p>
                                <p className="mt-1 text-sm">{new Date(category.created_at).toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Updated At</p>
                                <p className="mt-1 text-sm">{new Date(category.updated_at).toLocaleString()}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
