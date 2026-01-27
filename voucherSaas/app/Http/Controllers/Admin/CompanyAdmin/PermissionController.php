<?php

namespace App\Http\Controllers\Admin\CompanyAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;

class PermissionController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->toString();

        $permissions = Permission::query()
            ->when($search, fn ($q) => $q->where('name', 'like', "%{$search}%"))
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('CompanyAdmin/Permissions/Index', [
            'permissions' => $permissions,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }
}
