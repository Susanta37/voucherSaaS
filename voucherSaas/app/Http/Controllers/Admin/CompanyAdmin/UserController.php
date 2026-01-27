<?php

namespace App\Http\Controllers\Admin\CompanyAdmin;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        try {
            $search = $request->string('search')->toString();
            $role = $request->string('role')->toString();
            $status = $request->string('status')->toString();
            $branchId = $request->integer('branch_id');
            $companyId = $request->user()->company_id;
            $query = User::query()
            ->where('company_id', $companyId) // ✅ THIS LINE IS REQUIRED
            ->with(['branch:id,name'])
            ->with('roles:name')
            ->when($search, fn ($q) => $q->where(function ($qq) use ($search) {
                $qq->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            }))
            ->when($role, fn ($q) => $q->whereHas('roles', fn ($r) => $r->where('name', $role)))
            ->when($status !== '', function ($q) use ($status) {
                if ($status === 'active') {
                    $q->where('is_active', true);
                }
                if ($status === 'disabled') {
                    $q->where('is_active', false);
                }
            })
            ->when($branchId, fn ($q) => $q->where('branch_id', $branchId))
            ->latest();

            $users = $query->paginate(10)->withQueryString();

            return Inertia::render('CompanyAdmin/Users/Index', [
                'users' => $users,
                'filters' => [
                    'search' => $search,
                    'role' => $role,
                    'status' => $status,
                    'branch_id' => $branchId,
                ],
                'branches' => Branch::select('id', 'name')->orderBy('name')->get(),
                'kpis' => [
                    'total' => User::where('company_id', $companyId)->count(),
                    'active' => User::where('company_id', $companyId)->where('is_active', true)->count(),
                    'disabled' => User::where('company_id', $companyId)->where('is_active', false)->count(),
                ],

            ]);
        } catch (\Throwable $e) {
            report($e);

            $empty = new \Illuminate\Pagination\LengthAwarePaginator([], 0, 10);

            return Inertia::render('CompanyAdmin/Users/Index', [
                'users' => $empty,
                'filters' => [
                    'search' => '',
                    'role' => '',
                    'status' => '',
                    'branch_id' => null,
                ],
                'branches' => Branch::select('id', 'name')->orderBy('name')->get(),
                'kpis' => [
                    'total' => 0,
                    'active' => 0,
                    'disabled' => 0,
                ],
                'error' => 'Something went wrong',
            ]);
        }
    }

    public function create(Request $request): Response
    {
        try {
            $companyId = $request->user()->company_id;

            $branches = Branch::query()
                ->where('company_id', $companyId)
                ->select('id', 'name')
                ->orderBy('name')
                ->get();

            $roles = Role::query()
                ->whereIn('name', ['branch_admin', 'employee'])
                ->pluck('name');

            $permissions = Permission::query()
                ->orderBy('name')
                ->pluck('name');

            return Inertia::render('CompanyAdmin/Users/Create', [
                'branches' => $branches,
                'roles' => $roles,
                'permissions' => $permissions,
            ]);
        } catch (\Throwable $e) {
            report($e);

            return Inertia::render('CompanyAdmin/Users/Create', [
                'branches' => [],
                'roles' => [],
                'permissions' => [],
                'error' => 'Something went wrong',
            ]);
        }
    }

    public function store(Request $request): RedirectResponse
    {
        try {
            $companyId = $request->user()->company_id;

            $validated = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'email' => ['required', 'email', 'max:255', 'unique:users,email'],
                'phone' => ['nullable', 'string', 'max:30'],
                'whatsapp' => ['nullable', 'string', 'max:30'],
                'branch_id' => ['required', 'exists:branches,id'],
                'role' => ['required', 'in:branch_admin,employee'],
                'password' => ['required', 'string', 'min:8'],

                'permissions' => ['nullable', 'array'],
                'permissions.*' => ['string', 'exists:permissions,name'],
            ]);

            // Ensure branch belongs to this company
            $branch = Branch::query()
                ->where('company_id', $companyId)
                ->where('id', $validated['branch_id'])
                ->firstOrFail();

            $user = User::query()->create([
                'company_id' => $companyId,
                'branch_id' => $branch->id,
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'] ?? null,
                'whatsapp' => $validated['whatsapp'] ?? null,
                'password' => Hash::make($validated['password']),
                'is_active' => true,
            ]);

            $user->syncRoles([$validated['role']]);
            $user->syncPermissions($validated['permissions'] ?? []);

            return to_route('companyadmin.users.index')
                ->with('success', '✅ User created successfully!');
        } catch (\Throwable $e) {
            report($e);

            return back()->with('error', 'Something went wrong');
        }
    }

    public function edit(Request $request, User $user): Response
    {
        try {
            $companyId = $request->user()->company_id;

            // Security: user must belong to same company
            abort_if($user->company_id !== $companyId, 403);

            $branches = Branch::query()
                ->where('company_id', $companyId)
                ->select('id', 'name')
                ->orderBy('name')
                ->get();

            $roles = Role::query()
                ->whereIn('name', ['branch_admin', 'employee'])
                ->pluck('name');

            $permissions = Permission::query()
                ->orderBy('name')
                ->pluck('name');

            return Inertia::render('CompanyAdmin/Users/Edit', [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'whatsapp' => $user->whatsapp,
                    'branch_id' => $user->branch_id,
                    'role' => $user->roles->pluck('name')->first() ?? 'employee',
                    'is_active' => (bool) $user->is_active,
                    'permissions' => $user->permissions->pluck('name')->toArray(),
                ],
                'branches' => $branches,
                'roles' => $roles,
                'permissions' => $permissions,
            ]);
        } catch (\Throwable $e) {
            report($e);

            return Inertia::render('CompanyAdmin/Users/Edit', [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name ?? '',
                    'email' => $user->email ?? '',
                    'phone' => $user->phone ?? null,
                    'whatsapp' => $user->whatsapp ?? null,
                    'branch_id' => $user->branch_id ?? null,
                    'role' => $user->roles->pluck('name')->first() ?? 'employee',
                    'is_active' => (bool) ($user->is_active ?? false),
                    'permissions' => $user->permissions->pluck('name')->toArray() ?? [],
                ],
                'branches' => [],
                'roles' => [],
                'permissions' => [],
                'error' => 'Something went wrong',
            ]);
        }
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        try {
            $companyId = $request->user()->company_id;

            abort_if($user->company_id !== $companyId, 403);

            $validated = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'email' => ['required', 'email', 'max:255', 'unique:users,email,' . $user->id],
                'phone' => ['nullable', 'string', 'max:30'],
                'whatsapp' => ['nullable', 'string', 'max:30'],
                'branch_id' => ['required', 'exists:branches,id'],
                'role' => ['required', 'in:branch_admin,employee'],
                'password' => ['nullable', 'string', 'min:8'],
                'is_active' => ['required', 'boolean'],

                'permissions' => ['nullable', 'array'],
                'permissions.*' => ['string', 'exists:permissions,name'],
            ]);

            // Ensure branch belongs to this company
            $branch = Branch::query()
                ->where('company_id', $companyId)
                ->where('id', $validated['branch_id'])
                ->firstOrFail();

            $user->update([
                'branch_id' => $branch->id,
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'] ?? null,
                'whatsapp' => $validated['whatsapp'] ?? null,
                'is_active' => $validated['is_active'],
            ]);

            if (!empty($validated['password'])) {
                $user->update([
                    'password' => Hash::make($validated['password']),
                ]);
            }

            $user->syncRoles([$validated['role']]);
            $user->syncPermissions($validated['permissions'] ?? []);

            return to_route('companyadmin.users.index')
                ->with('success', '✅ User updated successfully!');
        } catch (\Throwable $e) {
            report($e);

            return back()->with('error', 'Something went wrong');
        }
    }

    public function destroy(Request $request, User $user): RedirectResponse
    {
        try {
            $companyId = $request->user()->company_id;

            abort_if($user->company_id !== $companyId, 403);

            $user->delete();

            return back()->with('success', '🗑️ User deleted successfully!');
        } catch (\Throwable $e) {
            report($e);

            return back()->with('error', 'Something went wrong');
        }
    }
}
