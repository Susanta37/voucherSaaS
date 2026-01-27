<?php

namespace App\Http\Controllers\Admin\CompanyAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->toString();

        $roles = Role::query()
            ->withCount('users')
            ->when($search, fn ($q) => $q->where('name', 'like', "%{$search}%"))
            ->orderBy('name')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('CompanyAdmin/Roles/Index', [
            'roles' => $roles,
            'filters' => [
                'search' => $search,
            ],
            'kpis' => [
                'total' => Role::count(),
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('CompanyAdmin/Roles/Create', [
            'permissions' => Permission::query()->orderBy('name')->pluck('name'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        try {
            $validated = $request->validate([
                'name' => ['required', 'string', 'max:100', 'unique:roles,name'],
                'permissions' => ['nullable', 'array'],
                'permissions.*' => ['string', 'exists:permissions,name'],
            ]);

            $role = Role::create([
                'name' => $validated['name'],
            ]);

            $role->syncPermissions($validated['permissions'] ?? []);

            return to_route('companyadmin.roles.index')
                ->with('success', '✅ Role created successfully!');
        } catch (\Throwable $e) {
            report($e);
            return back()->with('error', '❌ Something went wrong!');
        }
    }

    public function edit(Role $role): Response
    {
        return Inertia::render('CompanyAdmin/Roles/Edit', [
            'role' => [
                'id' => $role->id,
                'name' => $role->name,
                'permissions' => $role->permissions->pluck('name')->toArray(),
            ],
            'permissions' => Permission::query()->orderBy('name')->pluck('name'),
        ]);
    }

    public function update(Request $request, Role $role): RedirectResponse
    {
        try {
            $validated = $request->validate([
                'name' => ['required', 'string', 'max:100', 'unique:roles,name,' . $role->id],
                'permissions' => ['nullable', 'array'],
                'permissions.*' => ['string', 'exists:permissions,name'],
            ]);

            $role->update([
                'name' => $validated['name'],
            ]);

            $role->syncPermissions($validated['permissions'] ?? []);

            return to_route('companyadmin.roles.index')
                ->with('success', '✅ Role updated successfully!');
        } catch (\Throwable $e) {
            report($e);
            return back()->with('error', '❌ Something went wrong!');
        }
    }

    public function destroy(Role $role): RedirectResponse
    {
        try {
            $role->delete();

            return back()->with('success', '🗑️ Role deleted successfully!');
        } catch (\Throwable $e) {
            report($e);
            return back()->with('error', '❌ Something went wrong!');
        }
    }
}
