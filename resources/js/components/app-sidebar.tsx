import { NavFooter } from '@/components/nav-footer';
import { NavUser } from '@/components/nav-user';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    AlignHorizontalJustifyStart,
    ChartNoAxesCombined,
    ChevronRight,
    Combine,
    LayoutGrid,
    Notebook,
    ReceiptText,
    SquareUser,
    StarHalf,
    Tickets,
    Users,
} from 'lucide-react';
import AppLogo from './app-logo';

// Grouped navigation items with their required permissions
const navigationGroups = [
    {
        title: 'Overview',
        items: [
            {
                title: 'Dashboard',
                href: '/dashboard',
                icon: LayoutGrid,
                permission: 'dashboard-view',
            },
            {
                title: 'Analytics',
                href: '/admin/analytics',
                icon: ChartNoAxesCombined,
                permission: 'analytics-view',
            },
        ],
    },
    {
        title: 'User Management',
        items: [
            {
                title: 'Roles',
                href: '/admin/roles',
                icon: Notebook,
                permission: 'role-view',
            },
            {
                title: 'Users',
                href: '/admin/users',
                icon: Users,
                permission: 'user-view',
            },
            {
                title: 'Employees',
                href: '/admin/employees',
                icon: SquareUser,
                permission: 'employee-view',
            },
            {
                title: 'Customers',
                href: '/admin/customers',
                icon: SquareUser,
                permission: 'customer-view',
            },
        ],
    },
    {
        title: 'Business',
        items: [
            {
                title: 'Enquiries',
                href: '/admin/enquiries',
                icon: ReceiptText,
                permission: 'enquiry-view',
            },
            {
                title: 'Reviews',
                href: '/admin/reviews',
                icon: StarHalf,
                permission: 'review-view',
            },
            {
                title: 'Hightlighted',
                href: '/admin/highlighted',
                icon: Combine,
                permission: 'highlighted-view',
            },
            {
                title: 'Coupon Codes',
                href: '/admin/coupons',
                icon: Tickets,
                permission: 'coupon-view',
            },
        ],
    },
    {
        title: 'Products',
        items: [
            {
                title: 'Attributes',
                href: '/admin/attributes',
                icon: AlignHorizontalJustifyStart,
                permission: 'attribute-view',
            },
            // {
            //     title: 'Collections',
            //     href: '/admin/collections',
            //     icon: Shapes,
            //     permission: 'collection-view',
            // },
            // {
            //     title: 'Categories',
            //     href: '/admin/categories',
            //     icon: ChartBarStacked,
            //     permission: 'category-view',
            // },
            // {
            //     title: 'Products',
            //     href: '/admin/products',
            //     icon: Package,
            //     permission: 'product-view',
            // },
        ],
    },
    {
        title: 'Orders',
        items: [
            {
                title: 'Orders',
                href: '/admin/orders',
                icon: LayoutGrid,
                permission: 'order-view',
            },
        ],
    },
];

const footerNavItems: NavItem[] = [
    // {
    //     title: 'Repository',
    //     href: 'https://github.com/laravel/react-starter-kit',
    //     icon: Folder,
    // },
    // {
    //     title: 'Documentation',
    //     href: 'https://laravel.com/docs/starter-kits#react',
    //     icon: BookOpen,
    // },
];

interface AuthUser {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    permissions: Array<{ id: number; name: string; guard_name: string }>;
    roles: Array<{ id: number; name: string; guard_name: string }>;
}

interface PageProps {
    auth: {
        user: AuthUser | null;
    };
    [key: string]: unknown;
}

// Helper function to check if user has permission
const hasPermission = (user: AuthUser | null, permission: string): boolean => {
    if (!user) return false;

    // Check if user has RootUser role (has all permissions)
    if (user.roles?.some((role) => role.name === 'RootUser')) {
        return true;
    }

    // Check if user has the specific permission
    return user.permissions?.some((p) => p.name === permission) || false;
};

export function AppSidebar() {
    const { auth } = usePage<PageProps>().props;
    const page = usePage();

    // Filter navigation groups based on user permissions
    const filteredNavigationGroups = navigationGroups
        .map((group) => ({
            ...group,
            items: group.items.filter((item) => {
                // If no permission required, show the item
                if (!item.permission) return true;
                // Check if user has the required permission
                return hasPermission(auth.user, item.permission);
            }),
        }))
        .filter((group) => group.items.length > 0); // Only show groups that have visible items

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Platform</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {filteredNavigationGroups.map((group) => (
                                <Collapsible key={group.title} asChild defaultOpen={true} className="group/collapsible">
                                    <SidebarMenuItem>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton tooltip={group.title}>
                                                <ChevronRight className="transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                <span>{group.title}</span>
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <SidebarMenuSub>
                                                {group.items.map((item) => (
                                                    <SidebarMenuSubItem key={item.title}>
                                                        <SidebarMenuSubButton asChild isActive={page.url.startsWith(item.href)}>
                                                            <Link href={item.href} prefetch>
                                                                {item.icon && <item.icon />}
                                                                <span>{item.title}</span>
                                                            </Link>
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                ))}
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    </SidebarMenuItem>
                                </Collapsible>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
