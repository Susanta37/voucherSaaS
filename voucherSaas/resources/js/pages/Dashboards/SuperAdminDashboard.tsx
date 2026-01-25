import DashboardLayout from '@/layouts/dashboard-layout';
import * as React from 'react';
import type { PageProps } from '@/types';
import AppLayout from '@/layouts/app-layout';

export default function SuperAdminDashboard({ auth }: PageProps) {
    return (
        <AppLayout>
          
            <div className="py-12">
                <div className=" mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">You're logged in as a Super Admin!</div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}