<?php

use App\Http\Controllers\Admin\CompanyAdmin\BranchController;
use App\Http\Controllers\Admin\CompanyAdmin\UserController;
use App\Http\Controllers\Admin\SuperAdmin\CompanyController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\Admin\CompanyAdmin\RoleController;
use App\Http\Controllers\Admin\CompanyAdmin\PermissionController;
use App\Http\Controllers\Admin\CompanyAdmin\TemplateController;
use App\Http\Controllers\Branch\EmployeeController;
use App\Http\Controllers\Branch\PPCController;
use App\Http\Controllers\PublicClaimController;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('/test-qr', function () {
    $svg = \App\Services\QRCodeService::generateSvg('QR SAFE WORKING', 250);

    return response($svg, 200, [
        'Content-Type' => 'image/svg+xml',
    ]);
});



// ✅ Public Route for Customer to scan/claim (Outside auth)
Route::get('/claim/{code}', [PublicClaimController::class, 'show'])->name('ppc.claim.form');
Route::post('/claim/{code}', [PublicClaimController::class, 'submit'])->name('ppc.claim.submit');

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
   
    Route::middleware(['companyadmin'])->prefix('admin')->name('companyadmin.')->group(function (): void {
         Route::resource('templates', TemplateController::class);

        Route::get('/branches', [BranchController::class, 'index'])->name('branches.index');
        Route::get('/branches/create', [BranchController::class, 'create'])->name('branches.create');
        Route::post('/branches', [BranchController::class, 'store'])->name('branches.store');

        Route::get('/branches/{branch}/edit', [BranchController::class, 'edit'])->name('branches.edit');
        Route::put('/branches/{branch}', [BranchController::class, 'update'])->name('branches.update');

        Route::delete('/branches/{branch}', [BranchController::class, 'destroy'])->name('branches.destroy');
        Route::patch('/branches/{branch}/toggle', [BranchController::class, 'toggleStatus'])->name('branches.toggle');
        Route::get('/branches/{branch}/employees', [BranchController::class, 'employees'])->name('branches.employees');

        Route::get('/users', [UserController::class, 'index'])->name('users.index');
        Route::get('/users/create', [UserController::class, 'create'])->name('users.create');
        Route::post('/users', [UserController::class, 'store'])->name('users.store');

        // ✅ NEW (Edit / Update / Delete)
        Route::get('/users/{user}/edit', [UserController::class, 'edit'])->name('users.edit');
        Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
        Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');

        Route::get('/roles', [RoleController::class, 'index'])->name('roles.index');
        Route::get('/roles/create', [RoleController::class, 'create'])->name('roles.create');
        Route::post('/roles', [RoleController::class, 'store'])->name('roles.store');
        Route::get('/roles/{role}/edit', [RoleController::class, 'edit'])->name('roles.edit');
        Route::put('/roles/{role}', [RoleController::class, 'update'])->name('roles.update');
        Route::delete('/roles/{role}', [RoleController::class, 'destroy'])->name('roles.destroy');

        // Permissions read-only list
        Route::get('/permissions', [PermissionController::class, 'index'])->name('permissions.index');
    });







    // Branch Admin Dashboard
 Route::middleware([
        'auth',
        'role:company_admin|branch_admin',
        'permission:users.view'
    ])
    ->prefix('branch')
    ->name('branch.')
    ->group(function () {

        Route::get('/dashboard', [DashboardController::class, 'branchAdminDashboard'])
            ->name('dashboard');

        // ✅ Employees (company admin + branch admin)
        Route::get('/employees', [EmployeeController::class, 'index'])
            ->name('employees.index');

            // PPC Routes
    Route::get('/vouchers', [PPCController::class, 'index'])
        ->middleware('permission:vouchers.view')
        ->name('vouchers.index');
    Route::get('/templates', [TemplateController::class, 'index'])
        ->middleware('permission:vouchers.view')
        ->name('vouchers.templates');

    Route::post('/vouchers', [PPCController::class, 'store'])
        ->middleware('permission:vouchers.create')
        ->name('vouchers.store');

    Route::get('/vouchers/claims', [PPCController::class, 'claims'])
        ->middleware('permission:vouchers.claim.view')
        ->name('vouchers.claims');

        // Scanner UI
    Route::get('/scanner', function () {
        return Inertia::render('Branch/PPC/Scanner');
    })->name('scanner');

    // Verification Logic
    Route::post('/vouchers/verify', [PPCController::class, 'verify'])->name('vouchers.verify');
    });

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
