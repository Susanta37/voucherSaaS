<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function superAdminDashboard()
    {
        return Inertia::render('Dashboards/SuperAdminDashboard');
    }

    public function adminDashboard()
    {
        return Inertia::render('Dashboards/AdminDashboard');
    }

    public function branchDashboard()
    {
        return Inertia::render('Dashboards/BranchDashboard');
    }

    public function employeeDashboard()
    {
        return Inertia::render('Dashboards/EmployeeDashboard');
    }
}