import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { useEffect } from 'react';
import Select2 from 'react-select';
import { toast, Toaster } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Products',
        href: '/admin/products',
    },
    {
        title: 'Create Product',
        href: '/admin/products/create',
    },
];

interface CreateProductProps {
    categories: Category[];
    nextIndex: number;
}

interface Category {
    id: number;
    name: string;
}

export default function Create({ categories = [], nextIndex = 1 }: CreateProductProps) {
    const { data, setData, post, processing, errors } = useForm<{
        category_ids: number[];
        name: string;
        slug: string;
        index: string;
        sku: string;
        hsn: string;
        short_description: string;
        description: string;
    }>({
        category_ids: [],
        name: '',
        slug: '',
        index: nextIndex.toString(),
        sku: '',
        hsn: '',
        short_description: '',
        description: '',
    });

    // Auto-generate slug from name
    useEffect(() => {
        if (data.name) {
            const slug = data.name
                .toLowerCase()
                .replace(/[^a-z0-9 -]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-');
            setData('slug', slug);
        }
    }, [data.name]);

    const handleCategoryChange = (selectedOptions: any) => {
        const categoryIds = selectedOptions ? selectedOptions.map((option: any) => option.value) : [];
        setData('category_ids', categoryIds);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('admin.products.store'), {
            onSuccess: () => {
                toast.success('Product created successfully');
                router.visit(route('admin.products.index'));
            },
            onError: () => {
                toast.error('Please check the form for errors');
            },
        });
    };

    const categoryOptions = categories.map((cat) => ({
        value: cat.id,
        label: cat.name,
    }));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Product" />
            <Toaster position="top-right" richColors closeButton duration={4000} />

            <div className="m-4">
                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardHeader>
                            <h2 className="text-2xl font-bold">Create Product</h2>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            {/* Category Selection */}
                            <div className="space-y-2">
                                <Label htmlFor="category_ids">
                                    Category <span className="text-red-500">*</span>
                                </Label>
                                <Select2
                                    isMulti
                                    id="category_ids"
                                    options={categoryOptions}
                                    onChange={handleCategoryChange}
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                    placeholder="Select Product Category"
                                />
                                {errors.category_ids && <p className="text-sm text-red-600">{errors.category_ids}</p>}
                            </div>

                            {/* Name and Slug */}
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">
                                        Name <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        placeholder="Write Product Name here..."
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                    />
                                    {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="slug">
                                        Slug <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="slug"
                                        placeholder="Write Slug here..."
                                        value={data.slug}
                                        onChange={(e) => setData('slug', e.target.value)}
                                    />
                                    {errors.slug && <p className="text-sm text-red-600">{errors.slug}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="index">
                                        Index <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="index"
                                        type="number"
                                        placeholder="Enter Index"
                                        value={data.index}
                                        onChange={(e) => setData('index', e.target.value)}
                                    />
                                    {errors.index && <p className="text-sm text-red-600">{errors.index}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="sku">
                                        SKU <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="sku"
                                        placeholder="Write SKU here..."
                                        value={data.sku}
                                        onChange={(e) => setData('sku', e.target.value)}
                                    />
                                    {errors.sku && <p className="text-sm text-red-600">{errors.sku}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="hsn">HSN</Label>
                                    <Input
                                        id="hsn"
                                        placeholder="Write HSN here..."
                                        value={data.hsn}
                                        onChange={(e) => setData('hsn', e.target.value)}
                                    />
                                    {errors.hsn && <p className="text-sm text-red-600">{errors.hsn}</p>}
                                </div>
                            </div>

                            {/* Descriptions */}
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="short_description">
                                        Short Description <span className="text-red-500">*</span>
                                    </Label>
                                    <Textarea
                                        id="short_description"
                                        rows={2}
                                        placeholder="Enter product Short Description ..."
                                        value={data.short_description}
                                        onChange={(e) => setData('short_description', e.target.value)}
                                    />
                                    {errors.short_description && <p className="text-sm text-red-600">{errors.short_description}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">
                                        Description <span className="text-red-500">*</span>
                                    </Label>
                                    <Textarea
                                        id="description"
                                        rows={5}
                                        placeholder="Enter product Description ..."
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                    />
                                    {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className="flex gap-4 border-t p-6">
                            <Button type="submit" disabled={processing}>
                                {processing ? (
                                    <>
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Save
                                    </>
                                )}
                            </Button>
                            <Link href={route('admin.products.index')}>
                                <Button type="button" variant="secondary">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Cancel
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </AppLayout>
    );
}
