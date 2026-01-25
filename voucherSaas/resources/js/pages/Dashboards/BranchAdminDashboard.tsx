import DashboardLayout from '@/layouts/dashboard-layout';
import * as React from 'react';
import type { PageProps } from '@/types';

export default function BranchAdminDashboard({ auth }: PageProps) {
    return (
        <DashboardLayout
            title="Branch Admin Dashboard"
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Branch Admin Dashboard</h2>}
        >
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">You're logged in as a Branch Admin!</div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
