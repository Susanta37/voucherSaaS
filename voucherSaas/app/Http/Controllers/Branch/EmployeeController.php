<?php

namespace App\Http\Controllers\Branch;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmployeeController extends Controller
{
    public function index(Request $request): Response
    {
        $authUser = $request->user();

        $search = $request->string('search')->toString();
        $status = $request->string('status')->toString();

        $query = User::query()
            ->with(['branch:id,name'])
            ->withCount('vouchers')
            ->whereHas('roles', fn ($q) => $q->where('name', 'employee'))
            ->when($search, fn ($q) =>
                $q->where(function ($qq) use ($search) {
                    $qq->where('name', 'like', "%{$search}%")
                       ->orWhere('email', 'like', "%{$search}%");
                })
            )
            ->when($status !== '', fn ($q) =>
                $q->where('is_active', $status === 'active')
            );

        // Branch admin → own branch
        if ($authUser->hasRole('branch_admin')) {
            $query->where('branch_id', $authUser->branch_id);
        }

        // Company admin → full company
        if ($authUser->hasRole('company_admin')) {
            $query->where('company_id', $authUser->company_id);
        }

        $employees = $query
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Branch/Employees/Index', [
            'employees' => $employees,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
            'kpis' => [
                'total' => (clone $query)->count(),
                'active' => (clone $query)->where('is_active', true)->count(),
                'disabled' => (clone $query)->where('is_active', false)->count(),
            ],
        ]);
    }
}
