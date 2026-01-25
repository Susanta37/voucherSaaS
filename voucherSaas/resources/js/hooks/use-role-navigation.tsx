import { usePage } from '@inertiajs/react';
import type { NavItem, SharedData } from '@/types';
import { BookOpen, Folder, LayoutGrid, Shield, Building, User, Users } from 'lucide-react';

// Route placeholders
const superAdminDashboard = () => ({ url: '/super-admin/dashboard' });
const adminDashboard = () => ({ url: '/admin/dashboard' });
const branchDashboard = () => ({ url: '/branch/dashboard' });
const employeeDashboard = () => ({ url: '/employee/dashboard' });

const superAdminNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: superAdminDashboard().url,
        icon: LayoutGrid,
    },
    {
        title: 'Companies',
        href: '#', // TODO: Add companies route
        icon: Building,
    },
];

const adminNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: adminDashboard().url,
        icon: LayoutGrid,
    },
    {
        title: 'Branches',
        href: '#', // TODO: Add branches route
        icon: Users,
    },
    {
        title: 'Staff',
        href: '#', // TODO: Add staff route
        icon: User,
    },
];

const branchAdminNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: branchDashboard().url,
        icon: LayoutGrid,
    },
    {
        title: 'Vouchers',
        href: '#', // TODO: Add vouchers route
        icon: Folder,
    },
];

const employeeNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: employeeDashboard().url,
        icon: LayoutGrid,
    },
    {
        title: 'Create Voucher',
        href: '#', // TODO: Add create voucher route
        icon: BookOpen,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function useRoleNavigation() {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;

    let mainNavItems: NavItem[] = [];

    if (user.roles.includes('super_admin')) {
        mainNavItems = superAdminNavItems;
    } else if (user.roles.includes('company_admin')) {
        mainNavItems = adminNavItems;
    } else if (user.roles.includes('branch_admin')) {
        mainNavItems = branchAdminNavItems;
    } else if (user.roles.includes('employee')) {
        mainNavItems = employeeNavItems;
    }

    return { mainNavItems, footerNavItems };
}
