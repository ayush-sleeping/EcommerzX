import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { BarChart3, Edit, FileText, Package, Tag } from 'lucide-react';

interface Category {
    id: number;
    name: string;
}

interface Product {
    id: number;
    name: string;
    slug: string;
    category_ids: number[];
    sku: string;
    hsn: string;
    index: number;
    status: string;
    sale: string;
    short_description: string;
    description: string;
    pattern?: string;
    model?: string;
    featured?: string;
    views_count?: number;
    reviews_count?: number;
    rating?: number;
    created_at: string;
    updated_at: string;
}

interface PageProps {
    product: Product;
    categories: Category[];
    [key: string]: unknown;
}

export default function Show({ product, categories = [] }: PageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Products',
            href: '/admin/products',
        },
        {
            title: product.name,
            href: `/admin/products/${product.id}`,
        },
    ];

    const categoryNames = categories.map((cat) => cat.name).join(', ') || 'N/A';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Product: ${product.name}`} />

            <div className="m-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">{product.name}</h1>
                            <p className="text-muted-foreground">Product details and information</p>
                        </div>
                    </div>
                    <Link href={route('admin.products.edit', product.id)}>
                        <Button>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Product
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
                                <Package className="h-5 w-5" />
                                Basic Information
                            </CardTitle>
                            <CardDescription>General details about this product</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6 md:grid-cols-2">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Name</p>
                                <p className="mt-1 text-base font-semibold">{product.name}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Slug</p>
                                <p className="mt-1 font-mono text-sm">{product.slug}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Status</p>
                                <div className="mt-1">
                                    <Badge variant={product.status === 'ACTIVE' ? 'default' : 'secondary'}>{product.status}</Badge>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Sale Status</p>
                                <div className="mt-1">
                                    <Badge variant={product.sale === 'ACTIVE' ? 'default' : 'secondary'}>
                                        {product.sale === 'ACTIVE' ? 'On Sale' : 'Not On Sale'}
                                    </Badge>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Index</p>
                                <p className="mt-1 text-base font-semibold">{product.index}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Categories</p>
                                <p className="mt-1 text-base font-semibold">{categoryNames}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Product Codes & Identifiers */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Tag className="h-5 w-5" />
                                Product Codes & Identifiers
                            </CardTitle>
                            <CardDescription>SKU, HSN, and other product identifiers</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6 md:grid-cols-2">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">SKU</p>
                                <p className="mt-1 font-mono text-base font-semibold">{product.sku}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">HSN Code</p>
                                <p className="mt-1 font-mono text-base font-semibold">{product.hsn || 'N/A'}</p>
                            </div>
                            {product.pattern && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Pattern</p>
                                    <p className="mt-1 text-base font-semibold">{product.pattern}</p>
                                </div>
                            )}
                            {product.model && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Model</p>
                                    <p className="mt-1 text-base font-semibold">{product.model}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Descriptions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Product Descriptions
                            </CardTitle>
                            <CardDescription>Short and detailed product descriptions</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Short Description</p>
                                <p className="mt-2 text-sm leading-relaxed">{product.short_description}</p>
                            </div>
                            <div className="border-t pt-4">
                                <p className="text-sm font-medium text-muted-foreground">Full Description</p>
                                <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap">{product.description}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Statistics */}
                    {(product.views_count !== undefined ||
                        product.reviews_count !== undefined ||
                        product.rating !== undefined ||
                        product.featured) && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BarChart3 className="h-5 w-5" />
                                    Statistics & Features
                                </CardTitle>
                                <CardDescription>Product performance and feature flags</CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-6 md:grid-cols-2">
                                {product.views_count !== undefined && (
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Views Count</p>
                                        <p className="mt-1 text-base font-semibold">{product.views_count}</p>
                                    </div>
                                )}
                                {product.reviews_count !== undefined && (
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Reviews Count</p>
                                        <p className="mt-1 text-base font-semibold">{product.reviews_count}</p>
                                    </div>
                                )}
                                {product.rating !== undefined && (
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Rating</p>
                                        <p className="mt-1 text-base font-semibold">{product.rating} / 5</p>
                                    </div>
                                )}
                                {product.featured && (
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Featured</p>
                                        <div className="mt-1">
                                            <Badge variant={product.featured === 'ACTIVE' ? 'default' : 'secondary'}>{product.featured}</Badge>
                                        </div>
                                    </div>
                                )}
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
                                <p className="mt-1 text-sm">{new Date(product.created_at).toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Updated At</p>
                                <p className="mt-1 text-sm">{new Date(product.updated_at).toLocaleString()}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
