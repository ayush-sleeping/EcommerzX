import ProtectedSection from '@/components/protected-section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Briefcase, Calendar, Edit, Mail, Phone, Shield, User, UserCheck, Users } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Customers',
        href: '/admin/customers',
    },
    {
        title: 'Customer Details',
        href: '#',
    },
];

interface Customer {
    id: number;
    hashid: string;
    customer_id: string;
    personal_email: string;
    designation: string;
    created_at: string;
    updated_at: string;
    user: {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
        mobile: string;
        status: string;
        roles: Array<{
            id: number;
            name: string;
        }>;
        permissions?: Array<{
            id: number;
            name: string;
        }>;
    };
    creator?: {
        id: number;
        first_name: string;
        last_name: string;
    } | null;
    updator?: {
        id: number;
        first_name: string;
        last_name: string;
    } | null;
}

interface Props {
    customer: Customer;
    [key: string]: unknown;
}

export default function Show() {
    const { customer } = usePage<Props>().props;

    const fullName = `${customer.user?.first_name} ${customer.user?.last_name}`;
    const statusColor =
        customer.user?.status === 'ACTIVE'
            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Customer: ${fullName}`} />

            {/* Header with Back Button */}
            <div className="m-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Customer Details</h1>
                        <p className="text-muted-foreground">View detailed information about {fullName}.</p>
                    </div>
                    <div className="flex gap-2">
                        <Link href={route('admin.customers.index')}>
                            <Button variant="outline">Back to Customers</Button>
                        </Link>
                        <ProtectedSection permission="customer-update" showDeniedMessage={false}>
                            <Link href={route('admin.customers.edit', customer.id)}>
                                <Button>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Customer
                                </Button>
                            </Link>
                        </ProtectedSection>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="mx-4 mb-8">
                <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
                    {/* Personal Information Card */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Personal Information
                            </CardTitle>
                            <CardDescription>Basic personal details and contact information.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</span>
                                <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">{fullName}</span>
                            </div>

                            <div className="space-y-2">
                                <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">Status</span>
                                <Badge className={statusColor}>{customer.user?.status}</Badge>
                            </div>

                            <div className="space-y-2">
                                <span className="block flex items-center gap-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                                    <Mail className="h-4 w-4" />
                                    Official Email
                                </span>
                                <span className="text-lg font-medium text-gray-900 dark:text-gray-100">{customer.user?.email}</span>
                            </div>

                            <div className="space-y-2">
                                <span className="block flex items-center gap-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                                    <Phone className="h-4 w-4" />
                                    Mobile Number
                                </span>
                                <span className="text-lg font-medium text-gray-900 dark:text-gray-100">{customer.user?.mobile}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Customer Information Card */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Briefcase className="h-5 w-5" />
                                Customer Information
                            </CardTitle>
                            <CardDescription>Customer-specific details and professional information.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">Customer ID</span>
                                <span className="font-mono text-lg font-semibold text-gray-900 dark:text-gray-100">{customer.customer_id}</span>
                            </div>

                            <div className="space-y-2">
                                <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">Designation</span>
                                <span className="text-lg font-medium text-gray-900 dark:text-gray-100">{customer.designation}</span>
                            </div>

                            {customer.personal_email && (
                                <div className="space-y-2">
                                    <span className="block flex items-center gap-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                                        <Mail className="h-4 w-4" />
                                        Personal Email
                                    </span>
                                    <span className="text-lg font-medium text-gray-900 dark:text-gray-100">{customer.personal_email}</span>
                                </div>
                            )}

                            <div className="space-y-2">
                                <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">Database ID</span>
                                <span className="font-mono text-sm text-gray-900 dark:text-gray-100">#{customer.id}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Roles & Permissions Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                Roles & Permissions
                            </CardTitle>
                            <CardDescription>Assigned roles and permissions for this customer.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <span className="mb-2 block flex items-center gap-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                                    <Users className="h-4 w-4" />
                                    Roles ({customer.user?.roles?.length || 0})
                                </span>
                                <div className="flex flex-wrap gap-2">
                                    {customer.user?.roles && customer.user.roles.length > 0 ? (
                                        customer.user.roles.map((role) => (
                                            <Badge key={role.id} variant="secondary" className="text-xs">
                                                {role.name}
                                            </Badge>
                                        ))
                                    ) : (
                                        <span className="text-sm text-gray-500 dark:text-gray-400">No roles assigned</span>
                                    )}
                                </div>
                            </div>

                            <div>
                                <span className="mb-2 block flex items-center gap-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                                    <UserCheck className="h-4 w-4" />
                                    Permissions ({customer.user?.permissions?.length || 0})
                                </span>
                                <div className="flex max-h-32 flex-wrap gap-2 overflow-y-auto">
                                    {customer.user?.permissions && customer.user.permissions.length > 0 ? (
                                        customer.user.permissions.map((permission) => (
                                            <Badge key={permission.id} variant="outline" className="text-xs">
                                                {permission.name}
                                            </Badge>
                                        ))
                                    ) : (
                                        <span className="text-sm text-gray-500 dark:text-gray-400">No permissions assigned</span>
                                    )}
                                </div>
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
                            <CardDescription>Account creation and modification details.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">Unique Hash ID</span>
                                <span className="font-mono text-sm text-gray-900 dark:text-gray-100">{customer.hashid}</span>
                            </div>

                            <div className="space-y-2">
                                <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">Created At</span>
                                <span className="text-sm text-gray-900 dark:text-gray-100">
                                    {new Date(customer.created_at).toLocaleDateString()} at {new Date(customer.created_at).toLocaleTimeString()}
                                </span>
                            </div>

                            <div className="space-y-2">
                                <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</span>
                                <span className="text-sm text-gray-900 dark:text-gray-100">
                                    {new Date(customer.updated_at).toLocaleDateString()} at {new Date(customer.updated_at).toLocaleTimeString()}
                                </span>
                            </div>

                            {customer.creator && (
                                <div className="space-y-2">
                                    <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">Created By</span>
                                    <span className="text-sm text-gray-900 dark:text-gray-100">
                                        {customer.creator.first_name} {customer.creator.last_name}
                                    </span>
                                </div>
                            )}

                            {customer.updator && (
                                <div className="space-y-2">
                                    <span className="block text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated By</span>
                                    <span className="text-sm text-gray-900 dark:text-gray-100">
                                        {customer.updator.first_name} {customer.updator.last_name}
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
