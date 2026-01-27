<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            // Branch management
            'branches.view',
            'branches.create',
            'branches.update',
            'branches.delete',

            // User management
            'users.view',
            'users.create',
            'users.update',
            'users.delete',
        ];

        foreach ($permissions as $permission) {
            Permission::findOrCreate($permission);
        }

        // ✅ Roles
        $superAdmin = Role::findOrCreate('super_admin');
        $companyAdmin = Role::findOrCreate('company_admin');
        $branchAdmin = Role::findOrCreate('branch_admin');
        $employee = Role::findOrCreate('employee');

        // ✅ Assign permissions
        $superAdmin->syncPermissions($permissions);

        $companyAdmin->syncPermissions([
            'branches.view',
            'branches.create',
            'branches.update',
            'branches.delete',

            'users.view',
            'users.create',
            'users.update',
            'users.delete',
        ]);

        $branchAdmin->syncPermissions([
            'users.view', // can view employees in their branch
        ]);

        $employee->syncPermissions([]);
    }
}
