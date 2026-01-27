<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // ✅ Roles
        $superAdmin = Role::findOrCreate('super_admin');
        $companyAdmin = Role::findOrCreate('company_admin');
        $branchAdmin = Role::findOrCreate('branch_admin');
        $employee = Role::findOrCreate('employee');

        // ✅ Permissions (add more later)
        $permissions = [
            'users.view',
            'users.create',
            'users.edit',
            'users.delete',

            'customers.view',
            'customers.create',
            'branches.view',
            'branches.create',
            'branches.edit',
            'branches.delete',


            'vouchers.view',
            'vouchers.create',
            'vouchers.claim.view',

            'roles.view',
            'roles.create',
            'roles.edit',
            'roles.delete',

            'permissions.view',
            'permissions.create',
            'permissions.edit',
            'permissions.delete',
        ];

        foreach ($permissions as $perm) {
            Permission::findOrCreate($perm);
        }

        // ✅ Assign default permissions to roles (enterprise style)
        $companyAdmin->syncPermissions([
            'users.view',
            'users.create',
            'users.edit',
            'users.delete',
            'customers.view',
            'customers.create',
            'branches.view',
            'branches.create',
            'branches.edit',
            'branches.delete',
            'vouchers.view',
            'vouchers.create',
            'vouchers.claim.view',
        ]);

        $branchAdmin->syncPermissions([
            'users.view',
            'customers.view',
            'customers.create',
            'vouchers.view',
            'vouchers.create',
            'vouchers.claim.view',
        ]);

        $employee->syncPermissions([
            'customers.create',
            'vouchers.create',
            'vouchers.claim.view',
        ]);

        // ✅ Super admin gets everything
        $superAdmin->syncPermissions(Permission::all());
    }
}
