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
            return redirect()->route('dashboard.branch-admin');
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
        return Inertia::render('Dashboards/CompanyAdminDashboard');
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