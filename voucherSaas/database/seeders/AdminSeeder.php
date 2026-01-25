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
    }
}
