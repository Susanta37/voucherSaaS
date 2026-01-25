<?php

use App\Models\User;
use Spatie\Permission\Models\Role;

it('blocks non super admin from companies route', function () {
    Role::findOrCreate('super_admin');

    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/super-admin/companies')
        ->assertForbidden();
});
