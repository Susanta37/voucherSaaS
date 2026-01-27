    import {
        SidebarGroup,
        SidebarGroupContent,
        SidebarMenu,
        SidebarMenuButton,
        SidebarMenuItem,
    } from '@/components/ui/sidebar';
    import { toUrl } from '@/lib/utils';
    import type { NavItem } from '@/types';
    import { Link, usePage } from '@inertiajs/react';
    import type { ComponentPropsWithoutRef } from 'react';

    export function NavFooter({
        items,
        className,
        ...props
    }: ComponentPropsWithoutRef<typeof SidebarGroup> & {
        items: NavItem[];
    }) {
        return (
            <SidebarGroup
                {...props}
                className={`group-data-[collapsible=icon]:p-0 ${className || ''}`}
            >
                <SidebarGroupContent>
                    <SidebarMenu>
                        {(() => {
                            const { url } = usePage();
                            const currentPath = (() => {
                                try {
                                    return new URL(url || window.location.href, window.location.origin).pathname;
                                } catch {
                                    return window.location.pathname;
                                }
                            })();

                            return items.map((item) => {
                                const itemUrl = toUrl(item.href);
                                let itemPath = itemUrl;
                                try {
                                    itemPath = new URL(itemUrl, window.location.origin).pathname;
                                } catch {
                                    // keep itemUrl as-is
                                }

                                const isActive = itemPath === currentPath || currentPath.startsWith(itemPath + '/');

                                const btnClass = `text-neutral-600 hover:text-neutral-800 dark:text-neutral-300 dark:hover:text-neutral-100 ${
                                    isActive ? 'bg-red-100 text-neutral-900 rounded-md dark:bg-neutral-800 dark:text-neutral-100' : ''
                                }`;

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild className={btnClass}>
                                            {/* ✅ Inertia Link: same tab navigation */}
                                            <Link href={itemUrl} prefetch aria-current={isActive ? 'page' : undefined}>
                                                {item.icon && <item.icon className="h-5 w-5" />}
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            });
                        })()}
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        );
    }
