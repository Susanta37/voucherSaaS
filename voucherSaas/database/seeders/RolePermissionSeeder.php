<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        Role::findOrCreate('super_admin');
        Role::findOrCreate('company_admin');
        Role::findOrCreate('branch_admin');
        Role::findOrCreate('employee');
    }
}
