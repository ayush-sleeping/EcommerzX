import ProtectedSection from '@/components/protected-section';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from '@tanstack/react-table';
import { AlertTriangle, ArrowUpDown, ChevronDown, FileSpreadsheet, Filter, MoreHorizontal, Package, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Products',
        href: '/admin/products',
    },
];

interface ProductPageProps {
    products: Product[];
    categories: Category[];
    filters: {
        status?: string;
        sale?: string;
        category_id?: string;
    };
    [key: string]: unknown;
}

interface Product {
    id: number;
    name: string;
    slug: string;
    category_ids: number[];
    category?: { name: string };
    status: string;
    sale: string;
    index: number;
}

interface Category {
    id: number;
    name: string;
}

const createColumns = (
    handleDelete: (id: number, name: string) => void,
    handleStatusChange: (id: number, currentStatus: string) => void,
    handleSaleChange: (id: number, currentSale: string) => void,
    processing: boolean,
): ColumnDef<Product>[] => [
    {
        id: 'select',
        header: ({ table }) => (
            <div className="flex justify-center">
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            </div>
        ),
        cell: ({ row }) => (
            <div className="flex justify-center">
                <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />
            </div>
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        id: 'index',
        header: () => <div className="text-center">#</div>,
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            return <div className="text-center font-medium">{pageIndex * pageSize + row.index + 1}</div>;
        },
        enableSorting: false,
        enableHiding: false,
    },
    {
        id: 'actions',
        header: () => <div className="text-center">Actions</div>,
        enableHiding: false,
        cell: ({ row }) => {
            const product = row.original;

            return (
                <div className="flex justify-center">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href={route('admin.products.show', product.id)}>View Details</Link>
                            </DropdownMenuItem>
                            <ProtectedSection permission="product-update" showDeniedMessage={false}>
                                <DropdownMenuItem asChild>
                                    <Link href={route('admin.products.edit', product.id)}>Edit Product</Link>
                                </DropdownMenuItem>
                            </ProtectedSection>
                            <ProtectedSection permission="product-delete" showDeniedMessage={false}>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => handleDelete(product.id, product.name)}
                                    disabled={processing}
                                    className="text-red-600 focus:text-red-600"
                                >
                                    Delete Product
                                </DropdownMenuItem>
                            </ProtectedSection>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    },
    {
        accessorKey: 'status',
        header: ({ column }) => {
            return (
                <div className="flex justify-center">
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                        Status
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            );
        },
        cell: ({ row }) => {
            const product = row.original;
            const isActive = product.status === 'ACTIVE';
            return (
                <div className="flex items-center justify-center space-x-2">
                    <ProtectedSection permission="product-update" showDeniedMessage={false}>
                        <Switch
                            checked={isActive}
                            onCheckedChange={() => handleStatusChange(product.id, product.status)}
                            disabled={processing}
                            aria-label={`Toggle ${product.name} status`}
                        />
                    </ProtectedSection>
                    <span className={`text-xs font-medium ${isActive ? 'text-green-600' : 'text-red-600'}`}>{product.status}</span>
                </div>
            );
        },
    },
    {
        accessorKey: 'sale',
        header: ({ column }) => {
            return (
                <div className="flex justify-center">
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                        Sale
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            );
        },
        cell: ({ row }) => {
            const product = row.original;
            const isOnSale = product.sale === 'ACTIVE';
            return (
                <div className="flex items-center justify-center space-x-2">
                    <ProtectedSection permission="product-update" showDeniedMessage={false}>
                        <Switch
                            checked={isOnSale}
                            onCheckedChange={() => handleSaleChange(product.id, product.sale)}
                            disabled={processing}
                            aria-label={`Toggle ${product.name} sale`}
                        />
                    </ProtectedSection>
                    <span className={`text-xs font-medium ${isOnSale ? 'text-green-600' : 'text-red-600'}`}>{product.sale}</span>
                </div>
            );
        },
    },
    {
        accessorKey: 'index',
        header: ({ column }) => {
            return (
                <div className="flex justify-center">
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                        Index
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            );
        },
        cell: ({ row }) => <div className="text-center">{row.getValue('index')}</div>,
    },
    {
        accessorKey: 'name',
        header: ({ column }) => {
            return (
                <div className="flex justify-center">
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                        Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            );
        },
        cell: ({ row }) => <div className="text-center font-medium">{row.getValue('name')}</div>,
    },
    {
        accessorKey: 'category',
        header: () => <div className="text-center">Category</div>,
        cell: ({ row }) => {
            const product = row.original;
            return <div className="text-center">{product.category?.name || 'N/A'}</div>;
        },
    },
];

export default function Index() {
    const pageProps = usePage<ProductPageProps>().props;
    const flashFromGlobal = (usePage().props.flash as { success?: string; error?: string }) || {};
    const { products = [], categories = [], filters = {} } = pageProps;
    const { processing, delete: destroy } = useForm();

    const [statusFilter, setStatusFilter] = useState<string>(filters.status || 'all');
    const [saleFilter, setSaleFilter] = useState<string>(filters.sale || 'all');
    const [categoryFilter, setCategoryFilter] = useState<string>(filters.category_id || 'all');
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});
    const [deleteDialog, setDeleteDialog] = useState({
        open: false,
        product: null as Product | null,
    });

    useEffect(() => {
        if (flashFromGlobal.success) {
            toast.success(flashFromGlobal.success);
        }
        if (flashFromGlobal.error) {
            toast.error(flashFromGlobal.error);
        }
    }, [flashFromGlobal.success, flashFromGlobal.error]);

    const handleDelete = (id: number) => {
        const product = products.find((prod) => prod.id === id);
        setDeleteDialog({
            open: true,
            product: product || null,
        });
    };

    const handleStatusChange = (id: number, currentStatus: string) => {
        const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        router.post(
            route('admin.products.change.status'),
            {
                product_id: id,
                status: newStatus,
            },
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(`Product status updated to ${newStatus}`);
                },
                onError: () => {
                    toast.error('Failed to update product status');
                },
            },
        );
    };

    const handleSaleChange = (id: number, currentSale: string) => {
        const newSale = currentSale === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        router.post(
            route('admin.products.change.sale'),
            {
                product_id: id,
                sale: newSale,
            },
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(`Product sale status updated to ${newSale}`);
                },
                onError: () => {
                    toast.error('Failed to update product sale status');
                },
            },
        );
    };

    const handleStatusFilter = (value: string) => {
        setStatusFilter(value);
        applyFilters(value, saleFilter, categoryFilter);
    };

    const handleSaleFilter = (value: string) => {
        setSaleFilter(value);
        applyFilters(statusFilter, value, categoryFilter);
    };

    const handleCategoryFilter = (value: string) => {
        setCategoryFilter(value);
        applyFilters(statusFilter, saleFilter, value);
    };

    const applyFilters = (status: string, sale: string, category: string) => {
        const params = new URLSearchParams(window.location.search);
        if (status === 'all') {
            params.delete('status');
        } else {
            params.set('status', status);
        }
        if (sale === 'all') {
            params.delete('sale');
        } else {
            params.set('sale', sale);
        }
        if (category === 'all') {
            params.delete('category_id');
        } else {
            params.set('category_id', category);
        }
        const queryString = params.toString();
        const url = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;
        router.get(url, {}, { preserveState: true, preserveScroll: true });
    };

    const clearFilters = () => {
        setStatusFilter('all');
        setSaleFilter('all');
        setCategoryFilter('all');
        router.get(window.location.pathname, {}, { preserveState: true, preserveScroll: true });
    };

    const hasActiveFilters = statusFilter !== 'all' || saleFilter !== 'all' || categoryFilter !== 'all';

    const confirmDelete = () => {
        if (deleteDialog.product) {
            destroy(route('admin.products.destroy', deleteDialog.product.id), {
                onSuccess: () => {
                    setDeleteDialog({ open: false, product: null });
                },
                onError: () => {
                    setDeleteDialog({ open: false, product: null });
                },
            });
        }
    };

    const cancelDelete = () => {
        setDeleteDialog({ open: false, product: null });
    };

    const columns = createColumns(handleDelete, handleStatusChange, handleSaleChange, processing);

    const table = useReactTable({
        data: products,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />
            <Toaster position="top-right" richColors closeButton duration={4000} />

            <div className="m-4">
                <div className="flex items-center justify-between py-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Products Management</h1>
                        <p className="text-muted-foreground">Manage your product catalog and inventory.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline">
                            <FileSpreadsheet className="mr-2 h-4 w-4" />
                            Export Excel
                        </Button>
                        <ProtectedSection permission="product-store" showDeniedMessage={false}>
                            <Link href={route('admin.products.create')}>
                                <Button>Create Product</Button>
                            </Link>
                        </ProtectedSection>
                    </div>
                </div>

                <div className="flex items-center gap-4 py-4">
                    <Input
                        placeholder="Filter products..."
                        value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
                        onChange={(event) => table.getColumn('name')?.setFilterValue(event.target.value)}
                        className="max-w-sm"
                    />

                    <Select value={categoryFilter} onValueChange={handleCategoryFilter}>
                        <SelectTrigger className="w-48">
                            <div className="flex items-center gap-2">
                                <Filter className="h-4 w-4" />
                                <SelectValue placeholder="Category" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id.toString()}>
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={statusFilter} onValueChange={handleStatusFilter}>
                        <SelectTrigger className="w-40">
                            <div className="flex items-center gap-2">
                                <Filter className="h-4 w-4" />
                                <SelectValue placeholder="Status" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="ACTIVE">Active</SelectItem>
                            <SelectItem value="INACTIVE">Inactive</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={saleFilter} onValueChange={handleSaleFilter}>
                        <SelectTrigger className="w-40">
                            <div className="flex items-center gap-2">
                                <Filter className="h-4 w-4" />
                                <SelectValue placeholder="Sale" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Sale</SelectItem>
                            <SelectItem value="ACTIVE">On Sale</SelectItem>
                            <SelectItem value="INACTIVE">Not On Sale</SelectItem>
                        </SelectContent>
                    </Select>

                    {hasActiveFilters && (
                        <Button variant="outline" onClick={clearFilters} className="flex items-center gap-2">
                            <X className="h-4 w-4" />
                            Clear Filters
                        </Button>
                    )}

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto">
                                Columns <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    );
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="overflow-hidden rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header, index) => {
                                        return (
                                            <TableHead key={header.id} className={index < headerGroup.headers.length - 1 ? 'border-r' : ''}>
                                                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                            </TableHead>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                        {row.getVisibleCells().map((cell, index) => (
                                            <TableCell key={cell.id} className={index < row.getVisibleCells().length - 1 ? 'border-r' : ''}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No products found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div className="flex items-center justify-end space-x-2 py-4">
                    <div className="flex-1 text-sm text-muted-foreground">
                        {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
                    </div>
                    <div className="space-x-2">
                        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                            Previous
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                            Next
                        </Button>
                    </div>
                </div>
            </div>

            <Dialog open={deleteDialog.open} onOpenChange={(open) => !open && cancelDelete()}>
                <DialogContent className="sm:max-w-[525px]">
                    <DialogHeader className="pb-4">
                        <DialogTitle className="flex items-center gap-3 text-xl">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                            </div>
                            Delete Product Confirmation
                        </DialogTitle>
                        <DialogDescription className="text-base leading-relaxed">
                            This action cannot be undone. Please review the details carefully before proceeding.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                        <Card className="border-red-200 bg-red-50/50 dark:border-red-800/50 dark:bg-red-900/10">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-lg text-red-800 dark:text-red-200">
                                    <Package className="h-5 w-5" />
                                    Product Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center justify-between rounded-md bg-white/70 p-3 dark:bg-gray-800/50">
                                    <span className="font-medium text-gray-700 dark:text-gray-300">Product Name:</span>
                                    <span className="font-semibold text-gray-900 dark:text-gray-100">{deleteDialog.product?.name || 'N/A'}</span>
                                </div>
                                <div className="flex items-start gap-3 rounded-md bg-yellow-50 p-3 dark:bg-yellow-900/20">
                                    <AlertTriangle className="mt-0.5 h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                                    <div className="text-sm text-yellow-800 dark:text-yellow-200">
                                        <p className="font-medium">Warning:</p>
                                        <p>Deleting this product will permanently remove it from the system.</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <DialogFooter className="flex gap-3 pt-4">
                        <Button variant="outline" onClick={cancelDelete} disabled={processing} className="flex-1">
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete} disabled={processing} className="flex-1">
                            {processing ? (
                                <>
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="h-4 w-4" />
                                    Delete Product
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
