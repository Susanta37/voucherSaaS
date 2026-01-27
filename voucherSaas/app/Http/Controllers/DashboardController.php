<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function redirect(): RedirectResponse
    {
        $user = Auth::user();

        if ($user->hasRole('super_admin')) {
            return redirect()->route('dashboard.super-admin');
        }

        if ($user->hasRole('company_admin')) {
            return redirect()->route('dashboard.company-admin');
        }

        if ($user->hasRole('branch_admin')) {
            return redirect()->route('branchadmin.dashboard');
        }

        if ($user->hasRole('employee')) {
            return redirect()->route('dashboard.employee');
        }

        // Default fallback if no role matches, though this should not happen in a correctly configured system.
        Auth::logout();

        return redirect('/login');
    }

    public function superAdminDashboard(): Response
    {
        return Inertia::render('Dashboards/SuperAdminDashboard');
    }

    public function companyAdminDashboard(): Response
{
    $user = Auth::user();
    $companyId = $user->company_id;

    // Branch stats
    $totalBranches = \App\Models\Branch::count();
    $activeBranches = \App\Models\Branch::where('is_active', true)->count();

    // User stats
    $totalUsers = \App\Models\User::count();
    $activeUsers = \App\Models\User::where('is_active', true)->count();
    $disabledUsers = \App\Models\User::where('is_active', false)->count();

    // Users by role
    $usersByRole = \Spatie\Permission\Models\Role::withCount('users')
        ->whereIn('name', ['company_admin', 'branch_admin', 'employee'])
        ->get()
        ->map(fn ($r) => [
            'role' => $r->name,
            'count' => $r->users_count,
        ]);

    // Recent users
    $recentUsers = \App\Models\User::with(['branch:id,name', 'roles:name'])
        ->latest()
        ->limit(5)
        ->get();

    // Branch-wise user count
    $usersByBranch = \App\Models\Branch::withCount('users')
        ->orderByDesc('users_count')
        ->limit(5)
        ->get(['id', 'name']);

    return Inertia::render('Dashboards/CompanyAdminDashboard', [
        'kpis' => [
            'branches' => [
                'total' => $totalBranches,
                'active' => $activeBranches,
            ],
            'users' => [
                'total' => $totalUsers,
                'active' => $activeUsers,
                'disabled' => $disabledUsers,
            ],
        ],
        'usersByRole' => $usersByRole,
        'usersByBranch' => $usersByBranch,
        'recentUsers' => $recentUsers,
    ]);
}

    

    public function branchAdminDashboard(): Response
    {
        return Inertia::render('Dashboards/BranchAdminDashboard');
    }

    public function employeeDashboard(): Response
    {
        return Inertia::render('Dashboards/EmployeeDashboard');
    }
}