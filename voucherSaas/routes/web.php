<?php

use App\Http\Controllers\Admin\CompanyAdmin\BranchController;
use App\Http\Controllers\Admin\SuperAdmin\CompanyController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth'])->group(function () {
    // Redirect to the correct dashboard after login
    Route::get('/dashboard', [DashboardController::class, 'redirect'])->name('dashboard');

    // Super Admin Dashboard
    Route::get('/super-admin/dashboard', [DashboardController::class, 'superAdminDashboard'])
        ->middleware('superadmin')
        ->name('dashboard.super-admin');

    // Company Admin Dashboard
    Route::get('/admin/dashboard', [DashboardController::class, 'companyAdminDashboard'])
        ->middleware('companyadmin')
        ->name('dashboard.company-admin');

    // Branch Admin Dashboard
    Route::get('/branch/dashboard', [DashboardController::class, 'branchAdminDashboard'])
        ->middleware('branchadmin')
        ->name('dashboard.branch-admin');

    // Employee Dashboard
    Route::get('/employee/dashboard', [DashboardController::class, 'employeeDashboard'])
        ->middleware('employee')
        ->name('dashboard.employee');

    // ✅ Super Admin Panel
    Route::middleware(['superadmin'])->prefix('super-admin')->name('superadmin.')->group(function (): void {
        Route::resource('companies', CompanyController::class)->only(['index', 'create', 'store']);
    });

    // ✅ Company Admin Panel
    Route::middleware(['companyadmin'])->prefix('admin')->name('companyadmin.')->group(function (): void {
        Route::get('/branches', [BranchController::class, 'index'])->name('branches.index');
        Route::post('/branches', [BranchController::class, 'store'])->name('branches.store');
    });
});

require __DIR__.'/settings.php';
