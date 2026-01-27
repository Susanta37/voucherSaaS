import DashboardLayout from '@/layouts/dashboard-layout';
import * as React from 'react';
import AppLayout from '@/layouts/app-layout';
type AuthUser = {
  id: number;
  name: string;
  email: string;
};

type Props = {
  auth: {
    user: AuthUser | null;
  };
};

export default function SuperAdminDashboard({ auth }: Props) {
    return (
        <AppLayout>
          
            <div className="py-12">
                  <div className="p-6">
        {auth.user ? (
          <p>Welcome {auth.user.name} 👋</p>
        ) : (
          <p>Please login</p>
        )}
      </div>
                <div className=" mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">You're logged in as a Super Admin!</div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}