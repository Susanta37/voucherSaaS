import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Head } from '@inertiajs/react';
import { Separator } from '@/components/ui/separator';
import { useFlashToast } from "@/hooks/useFlashToast";


export default function DashboardLayout({
    header,
    children,
    title,
}: {
    header?: React.ReactNode;
    children: React.ReactNode;
    title: string;
}) {
    useFlashToast();
    return (
        <SidebarProvider>
            <Head title={title} />
            
            {/* 1. The Sidebar Component */}
            <AppSidebar />

            {/* 2. The Main Content Area (automatically handles width/margins) */}
            <SidebarInset className="bg-gray-100 dark:bg-gray-900">
                {header && (
                    <header className="bg-white dark:bg-gray-800 shadow sticky top-0 z-10">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
                            {/* Toggle Button for Mobile/Desktop */}
                            <SidebarTrigger className="-ml-2" />
                            
                            <Separator orientation="vertical" className="h-6" />
                            
                            <div className="flex-1">
                                {header}
                            </div>
                        </div>
                    </header>
                )}

                <main className="flex-1">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}