<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\User;
use App\Models\Voucher;
use App\Models\VoucherClaim;
use App\Models\VoucherTemplate;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class DashboardController extends Controller
{
    public function redirect(): RedirectResponse
        {
            $user = Auth::user();

            if (!$user) {
                return redirect()->route('login');
            }

            // Force save session to ensure cookie is set before redirect
            request()->session()->save();

            if ($user->hasRole('super_admin')) {
                return redirect()->route('dashboard.super-admin');
            }

            if ($user->hasRole('company_admin')) {
                return redirect()->route('dashboard.company-admin');
            }

            if ($user->hasRole('branch_admin')) {
                // Note: This matches the 'branch.dashboard' name in web.php
                return redirect()->route('branch.dashboard');
            }

            if ($user->hasRole('employee')) {
                return redirect()->route('dashboard.employee');
            }

            Auth::logout();
            return redirect()->route('login');
        }

    public function superAdminDashboard(): Response
    {
        return Inertia::render('Dashboards/SuperAdminDashboard');
    }

    public function companyAdminDashboard(): Response
    {
        $user = Auth::user();
        $companyId = $user->company_id;

        // 1. Infrastructure Stats (Branches)
        $totalBranches = Branch::count();
        $activeBranches = Branch::where('is_active', true)->count();

        // 2. Personnel Stats (Users)
        $totalUsers = User::count();
        $activeUsers = User::where('is_active', true)->count();
        $disabledUsers = User::where('is_active', false)->count();

        // 3. PPC System Stats (Premium Metrics)
        $ppcStats = [
            'total_vouchers'   => Voucher::count(),
            'total_claims'     => VoucherClaim::count(),
            'active_templates' => VoucherTemplate::where('is_active', true)->count(),
            'claims_today'     => VoucherClaim::whereDate('created_at', today())->count(),
        ];

        // 4. Workforce Distribution by Role
        $usersByRole = Role::withCount('users')
            ->whereIn('name', ['company_admin', 'branch_admin', 'employee'])
            ->get()
            ->map(fn ($r) => [
                'role'  => $r->name,
                'count' => $r->users_count,
            ]);

        // 5. Personnel Distribution by Branch (Top 5)
        $usersByBranch = Branch::withCount('users')
            ->orderByDesc('users_count')
            ->limit(5)
            ->get(['id', 'name', 'users_count']);

        // 6. Recent Personnel Activity
        $recentUsers = User::with(['branch:id,name', 'roles:name'])
            ->latest()
            ->limit(6)
            ->get();

        return Inertia::render('Dashboards/CompanyAdminDashboard', [
            'kpis' => [
                'branches' => [
                    'total'  => $totalBranches,
                    'active' => $activeBranches,
                ],
                'users' => [
                    'total'    => $totalUsers,
                    'active'   => $activeUsers,
                    'disabled' => $disabledUsers,
                ],
                'ppc' => $ppcStats, // Injected for the Premium UI
            ],
            'usersByRole'   => $usersByRole,
            'usersByBranch' => $usersByBranch,
            'recentUsers'   => $recentUsers,
        ]);
    }

    

    public function branchAdminDashboard(): Response
    {
        $user = Auth::user();
        $branchId = $user->branch_id;

        // 1. Branch Specific KPIs
        $stats = [
            'total_vouchers' => Voucher::where('branch_id', $branchId)->count(),
            'total_claims'   => VoucherClaim::whereHas('voucher', function($q) use ($branchId) {
                $q->where('branch_id', $branchId);
            })->count(),
            'today_claims'   => VoucherClaim::whereDate('created_at', today())
                ->whereHas('voucher', function($q) use ($branchId) {
                    $q->where('branch_id', $branchId);
                })->count(),
            'active_employees' => User::where('branch_id', $branchId)
                ->where('is_active', true)
                ->count(),
        ];

        // 2. Recent Claims at this Branch
        $recentClaims = VoucherClaim::with(['voucher.template'])
            ->whereHas('voucher', function($q) use ($branchId) {
                $q->where('branch_id', $branchId);
            })
            ->latest()
            ->limit(5)
            ->get();

        // 3. Top Performing Employees (by vouchers generated)
        $topEmployees = User::where('branch_id', $branchId)
            ->withCount('vouchers')
            ->orderByDesc('vouchers_count')
            ->limit(5)
            ->get();

        return Inertia::render('Dashboards/BranchAdminDashboard', [
            'branchName' => $user->branch?->name ?? 'Branch Dashboard',
            'stats' => $stats,
            'recentClaims' => $recentClaims,
            'topEmployees' => $topEmployees
        ]);
    }

    public function employeeDashboard(): Response
    {
        return Inertia::render('Dashboards/EmployeeDashboard');
    }
}