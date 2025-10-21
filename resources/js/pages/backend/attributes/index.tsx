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
import { AlertTriangle, ArrowUpDown, ChevronDown, Filter, MoreHorizontal, Settings2, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Attributes',
        href: '/admin/attributes',
    },
];

interface AttributePageProps {
    attributes: Attribute[];
    filters: {
        status?: string;
    };
    [key: string]: unknown;
}

interface Attribute {
    id: number;
    name: string;
    label: string;
    is_color: boolean;
    status: string;
    slug: string;
    index: number;
}

// Define columns for the DataTable
// --------------------------------------------------------------------------------------------------------------- ::
const createColumns = (handleDelete: (id: number, name: string) => void, processing: boolean): ColumnDef<Attribute>[] => [
    {
        id: 'select',
        header: ({ table }) => (
            <div className="flex justify-center">
                {/* ----------------------------------------------------------------------- :: */}
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            </div>
        ),
        cell: ({ row }) => (
            <div className="flex justify-center">
                {/* ----------------------------------------------------------------------- :: */}
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
            const attribute = row.original;

            return (
                <div className="flex justify-center">
                    {/* ----------------------------------------------------------------------- :: */}
                    <DropdownMenu>
                        {/* ---------------------------------------- :: */}
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        {/* ---------------------------------------- :: */}
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href={route('admin.attributes.show', attribute.id)}>View Details</Link>
                            </DropdownMenuItem>
                            <ProtectedSection permission="attribute-update" showDeniedMessage={false}>
                                <DropdownMenuItem asChild>
                                    <Link href={route('admin.attributes.edit', attribute.id)}>Edit Attribute</Link>
                                </DropdownMenuItem>
                            </ProtectedSection>
                            <ProtectedSection permission="attribute-update" showDeniedMessage={false}>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => handleDelete(attribute.id, attribute.label)}
                                    disabled={processing}
                                    className="text-red-600 focus:text-red-600"
                                >
                                    Delete Attribute
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
                    {/* ----------------------------------------------------------------------- :: */}
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                        Status
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            );
        },
        cell: ({ row }) => {
            const status = row.getValue('status') as string;
            const statusColor = status === 'ACTIVE' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';
            return (
                <div className="flex justify-center">
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusColor}`}>{status}</span>
                </div>
            );
        },
    },
    {
        accessorKey: 'name',
        header: ({ column }) => {
            return (
                <div className="flex justify-center">
                    {/* ----------------------------------------------------------------------- :: */}
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
        accessorKey: 'label',
        header: ({ column }) => {
            return (
                <div className="flex justify-center">
                    {/* ----------------------------------------------------------------------- :: */}
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                        Label
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            );
        },
        cell: ({ row }) => <div className="text-center">{row.getValue('label')}</div>,
    },
    {
        accessorKey: 'is_color',
        header: ({ column }) => {
            return (
                <div className="flex justify-center">
                    {/* ----------------------------------------------------------------------- :: */}
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                        Is Color
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            );
        },
        cell: ({ row }) => {
            const isColor = row.getValue('is_color') as boolean;
            return (
                <div className="flex justify-center">
                    <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${isColor ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                    >
                        {isColor ? 'Yes' : 'No'}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: 'index',
        header: ({ column }) => {
            return (
                <div className="flex justify-center">
                    {/* ----------------------------------------------------------------------- :: */}
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                        Index
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            );
        },
        cell: ({ row }) => <div className="text-center">{row.getValue('index')}</div>,
    },
];

export default function Index() {
    const pageProps = usePage<AttributePageProps>().props;
    const flashFromGlobal = (usePage().props.flash as { success?: string; error?: string }) || {};
    const { attributes = [], filters = {} } = pageProps;
    const { processing, delete: destroy } = useForm();

    // Filter states
    // ----------------------------------------------------------------------- ::
    const [statusFilter, setStatusFilter] = useState<string>(filters.status || 'all');

    // TanStack Table states
    // ----------------------------------------------------------------------- ::
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});

    // Delete dialog state
    // ----------------------------------------------------------------------- ::
    const [deleteDialog, setDeleteDialog] = useState({
        open: false,
        attribute: null as Attribute | null,
    });

    // Toast notification effect for flash messages
    useEffect(() => {
        if (flashFromGlobal.success) {
            toast.success(flashFromGlobal.success);
        }
        if (flashFromGlobal.error) {
            toast.error(flashFromGlobal.error);
        }
    }, [flashFromGlobal.success, flashFromGlobal.error]);

    // ----------------------------------------------------------------------- ::
    const handleDelete = (id: number) => {
        const attribute = attributes.find((attr) => attr.id === id);
        setDeleteDialog({
            open: true,
            attribute: attribute || null,
        });
    };

    // ----------------------------------------------------------------------- ::
    const handleStatusFilter = (value: string) => {
        setStatusFilter(value);

        const params = new URLSearchParams(window.location.search);

        if (value === 'all') {
            params.delete('status');
        } else {
            params.set('status', value);
        }

        const queryString = params.toString();
        const url = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;

        router.get(url, {}, { preserveState: true, preserveScroll: true });
    };

    // ----------------------------------------------------------------------- ::
    const clearFilters = () => {
        setStatusFilter('all');
        router.get(window.location.pathname, {}, { preserveState: true, preserveScroll: true });
    };

    // ----------------------------------------------------------------------- ::
    const hasActiveFilters = statusFilter !== 'all';

    // ----------------------------------------------------------------------- ::
    const confirmDelete = () => {
        if (deleteDialog.attribute) {
            destroy(route('admin.attributes.destroy', deleteDialog.attribute.id), {
                onSuccess: () => {
                    setDeleteDialog({ open: false, attribute: null });
                },
                onError: () => {
                    setDeleteDialog({ open: false, attribute: null });
                },
            });
        }
    };

    // ----------------------------------------------------------------------- ::
    const cancelDelete = () => {
        setDeleteDialog({ open: false, attribute: null });
    };

    const columns = createColumns(handleDelete, processing);

    // ----------------------------------------------------------------------- ::
    const table = useReactTable({
        data: attributes,
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
            <Head title="Attributes" />

            {/* Toast Notifications */}
            <Toaster position="top-right" richColors closeButton duration={4000} />

            {/* Main Content */}
            {/* ----------------------------------------------------------------------- :: */}
            <div className="m-4">
                {/* Header with Create Button */}
                <div className="flex items-center justify-between py-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Attributes Management</h1>
                        <p className="text-muted-foreground">Manage product attributes and their properties.</p>
                    </div>
                    <ProtectedSection permission="attribute-store" showDeniedMessage={false}>
                        <Link href={route('admin.attributes.create')}>
                            <Button>Create Attribute</Button>
                        </Link>
                    </ProtectedSection>
                </div>

                {/* Filters and Column Visibility */}
                {/* ----------------------------------------------------------------------- :: */}
                <div className="flex items-center gap-4 py-4">
                    <Input
                        placeholder="Filter attributes..."
                        value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
                        onChange={(event) => table.getColumn('name')?.setFilterValue(event.target.value)}
                        className="max-w-sm"
                    />

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

                {/* Data Table */}
                {/* ----------------------------------------------------------------------- :: */}
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
                                        No attributes found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {/* ----------------------------------------------------------------------- :: */}
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

            {/* Delete Confirmation Dialog */}
            {/* ----------------------------------------------------------------------- :: */}
            <Dialog open={deleteDialog.open} onOpenChange={(open) => !open && cancelDelete()}>
                <DialogContent className="sm:max-w-[525px]">
                    <DialogHeader className="pb-4">
                        <DialogTitle className="flex items-center gap-3 text-xl">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                            </div>
                            Delete Attribute Confirmation
                        </DialogTitle>
                        <DialogDescription className="text-base leading-relaxed">
                            This action cannot be undone. Please review the details carefully before proceeding.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                        <Card className="border-red-200 bg-red-50/50 dark:border-red-800/50 dark:bg-red-900/10">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-lg text-red-800 dark:text-red-200">
                                    <Settings2 className="h-5 w-5" />
                                    Attribute Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center justify-between rounded-md bg-white/70 p-3 dark:bg-gray-800/50">
                                    <span className="font-medium text-gray-700 dark:text-gray-300">Attribute Name:</span>
                                    <span className="font-semibold text-gray-900 dark:text-gray-100">{deleteDialog.attribute?.name || 'N/A'}</span>
                                </div>
                                <div className="flex items-center justify-between rounded-md bg-white/70 p-3 dark:bg-gray-800/50">
                                    <span className="font-medium text-gray-700 dark:text-gray-300">Label:</span>
                                    <span className="font-semibold text-gray-900 dark:text-gray-100">{deleteDialog.attribute?.label || 'N/A'}</span>
                                </div>
                                <div className="flex items-start gap-3 rounded-md bg-yellow-50 p-3 dark:bg-yellow-900/20">
                                    <AlertTriangle className="mt-0.5 h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                                    <div className="text-sm text-yellow-800 dark:text-yellow-200">
                                        <p className="font-medium">Warning:</p>
                                        <p>
                                            Deleting this attribute will permanently remove it from the system. All associated attribute values and
                                            product relationships will also be affected.
                                        </p>
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
                                    Delete Attribute
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
