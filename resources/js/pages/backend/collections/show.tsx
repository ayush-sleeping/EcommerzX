import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Edit, FolderOpen, Tag } from 'lucide-react';

interface Attribute {
    id: number;
    name: string;
    label: string;
    slug: string;
}

interface Collection {
    id: number;
    hashid: string;
    name: string;
    slug: string;
    attribute_ids: number[];
    index: number;
    status: string;
    created_at: string;
    updated_at: string;
}

interface PageProps {
    collection: Collection;
    attributes: Attribute[];
    [key: string]: unknown;
}

export default function Show({ collection, attributes }: PageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Collections',
            href: '/admin/collections',
        },
        {
            title: collection.name,
            href: `/admin/collections/${collection.hashid}`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Collection: ${collection.name}`} />

            <div className="m-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">{collection.name}</h1>
                            <p className="text-muted-foreground">Collection details and associated attributes</p>
                        </div>
                    </div>
                    <Link href={route('admin.collections.edit', collection.id)}>
                        <Button>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Collection
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
                                <FolderOpen className="h-5 w-5" />
                                Basic Information
                            </CardTitle>
                            <CardDescription>General details about this collection</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6 md:grid-cols-2">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Name</p>
                                <p className="mt-1 text-base font-semibold">{collection.name}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Slug</p>
                                <p className="mt-1 font-mono text-sm">{collection.slug}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Status</p>
                                <div className="mt-1">
                                    <Badge variant={collection.status === 'ACTIVE' ? 'default' : 'secondary'}>{collection.status}</Badge>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Index</p>
                                <p className="mt-1 text-base font-semibold">{collection.index}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Attributes */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Tag className="h-5 w-5" />
                                Attributes ({attributes.length})
                            </CardTitle>
                            <CardDescription>Attributes associated with this collection</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {attributes.length > 0 ? (
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {attributes.map((attribute) => (
                                        <Card key={attribute.id} className="border-2">
                                            <CardHeader className="pb-3">
                                                <CardTitle className="text-base">{attribute.label}</CardTitle>
                                                <CardDescription className="font-mono text-xs">{attribute.slug}</CardDescription>
                                            </CardHeader>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 text-center">
                                    <Tag className="mx-auto h-12 w-12 text-muted-foreground/50" />
                                    <p className="mt-4 text-sm text-muted-foreground">No attributes found</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Metadata */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Metadata</CardTitle>
                            <CardDescription>Timestamp information</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Created At</p>
                                <p className="mt-1 text-sm">{new Date(collection.created_at).toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Updated At</p>
                                <p className="mt-1 text-sm">{new Date(collection.updated_at).toLocaleString()}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
