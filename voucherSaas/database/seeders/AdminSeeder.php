<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::query()->firstOrCreate(
            ['email' => 'companyadmin@example.com'],
            [
                'name' => 'Company Admin',
                'password' => Hash::make('password'),
            ]
        );

        $user->assignRole('company_admin');
        $user->givePermissionTo([
        'users.view', 'users.create', 'users.edit', 'users.delete',
        'branches.view', 'branches.create', 'branches.edit', 'branches.delete',
        'roles.view', 'roles.create', 'roles.edit', 'roles.delete',
        'permissions.view',
    ]);

    }
}
