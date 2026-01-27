import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Users, Building2, Shield, KeyRound, Ticket, QrCode } from 'lucide-react';
import AppLogo from './app-logo';
import { usePermission } from '@/hooks/usePermission';

export function AppSidebar() {
    const { can } = usePermission();

    // ✅ Main sidebar based on permissions (Enterprise approach)
    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
         ...(can('users.view')
            ? [
                  {
                      title: 'Employees',
                      href: '/branch/employees',
                      icon: Users,
                  },
              ]
            : []),

        ...(can('vouchers.view')
            ? [
                  {
                      title: 'Vouchers',
                      href: '/branch/vouchers',
                      icon: Ticket,
                  },
              ]
            : []),

        ...(can('vouchers.claim.view')
            ? [
                  {
                      title: 'Voucher Claims',
                      href: '/branch/vouchers',
                      icon: QrCode,
                  },
              ]
            : []),

      
    ];

    // ✅ Footer links (open same page)
    const footerNavItems: NavItem[] = [
        ...(can('branches.view')
            ? [
                  {
                      title: 'Branches',
                      href: '/admin/branches',
                      icon: Building2,
                  },
              ]
            : []),

        ...(can('users.view')
            ? [
                  {
                      title: 'Users',
                      href: '/admin/users',
                      icon: Users,
                  },
              ]
            : []),
            ...(can("roles.view")
            ? [{ title: "Roles", href: "/admin/roles", icon: Shield }]
            : []),

            ...(can("permissions.view")
            ? [{ title: "Permissions", href: "/admin/permissions", icon: KeyRound }]
            : []),

    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                
                <NavFooter items={footerNavItems} className="mt-auto border rounded-2xl" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
