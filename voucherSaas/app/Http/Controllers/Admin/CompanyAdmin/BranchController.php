<?php

namespace App\Http\Controllers\Admin\CompanyAdmin;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class BranchController extends Controller
{
    public function index(Request $request): Response
    {
        $companyId = $request->user()->company_id;

        $search = $request->string('search')->toString();
        $status = $request->string('status')->toString();

        $query = Branch::query()
            ->where('company_id', $companyId)
            ->withCount('users')
            ->when($search, fn ($q) => $q->where(function ($qq) use ($search) {
                $qq->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            }))
            ->when($status !== '', function ($q) use ($status) {
                if ($status === 'active') {
                    $q->where('is_active', true);
                }

                if ($status === 'disabled') {
                    $q->where('is_active', false);
                }
            })
            ->latest();

        $branches = $query->paginate(10)->withQueryString();

        return Inertia::render('CompanyAdmin/Branches/Index', [
            'branches' => $branches,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
            'kpis' => [
                'total' => Branch::where('company_id', $companyId)->count(),
                'active' => Branch::where('company_id', $companyId)->where('is_active', true)->count(),
                'disabled' => Branch::where('company_id', $companyId)->where('is_active', false)->count(),
            ],
        ]);
    }

    public function create(Request $request): Response
    {
        // Preview next code in UI
        $companyId = $request->user()->company_id;

        $nextCode = $this->generateBranchCode($companyId);

        return Inertia::render('CompanyAdmin/Branches/Create', [
            'nextCode' => $nextCode,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        try {
            $companyId = $request->user()->company_id;

            $validated = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'phone' => ['nullable', 'string', 'max:30'],
                'address' => ['nullable', 'string', 'max:500'],
            ]);

            $code = $this->generateBranchCode($companyId);

            Branch::query()->create([
                'company_id' => $companyId,
                'name' => $validated['name'],
                'code' => $code,
                'phone' => $validated['phone'] ?? null,
                'address' => $validated['address'] ?? null,
                'is_active' => true,
            ]);

            return to_route('companyadmin.branches.index')
                ->with('success', '✅ Branch created successfully!');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()
                ->withErrors($e->errors())
                ->with('error', '⚠️ Please fix the validation errors.');
        } catch (\Throwable $e) {
            return back()->with('error', '❌ ' . $e->getMessage());
        }
    }

    public function edit(Request $request, Branch $branch): Response
    {
        $companyId = $request->user()->company_id;

        abort_if($branch->company_id !== $companyId, 403);

        return Inertia::render('CompanyAdmin/Branches/Edit', [
            'branch' => [
                'id' => $branch->id,
                'name' => $branch->name,
                'code' => $branch->code,
                'phone' => $branch->phone,
                'address' => $branch->address,
                'is_active' => (bool) $branch->is_active,
            ],
        ]);
    }

    public function update(Request $request, Branch $branch): RedirectResponse
    {
        try {
            $companyId = $request->user()->company_id;

            abort_if($branch->company_id !== $companyId, 403);

            $validated = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'phone' => ['nullable', 'string', 'max:30'],
                'address' => ['nullable', 'string', 'max:500'],
                'is_active' => ['required', 'boolean'],
            ]);

            $branch->update([
                'name' => $validated['name'],
                'phone' => $validated['phone'] ?? null,
                'address' => $validated['address'] ?? null,
                'is_active' => $validated['is_active'],
            ]);

            return to_route('companyadmin.branches.index')
                ->with('success', '✅ Branch updated successfully!');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()
                ->withErrors($e->errors())
                ->with('error', '⚠️ Please fix the validation errors.');
        } catch (\Throwable $e) {
            return back()->with('error', '❌ ' . $e->getMessage());
        }
    }

    public function destroy(Request $request, Branch $branch): RedirectResponse
    {
        try {
            $companyId = $request->user()->company_id;

            abort_if($branch->company_id !== $companyId, 403);

            $branch->delete();

            return back()->with('success', '🗑️ Branch deleted successfully!');
        } catch (\Throwable $e) {
            return back()->with('error', '❌ ' . $e->getMessage());
        }
    }

    // ✅ ENTERPRISE: Quick toggle from table
    public function toggleStatus(Request $request, Branch $branch): RedirectResponse
    {
        try {
            $companyId = $request->user()->company_id;

            abort_if($branch->company_id !== $companyId, 403);

            $branch->update([
                'is_active' => ! $branch->is_active,
            ]);

            return back()->with('success', '✅ Branch status updated!');
        } catch (\Throwable $e) {
            return back()->with('error', '❌ ' . $e->getMessage());
        }
    }

    // ✅ ENTERPRISE: View employees per branch
    public function employees(Request $request, Branch $branch): Response
    {
        $companyId = $request->user()->company_id;

        abort_if($branch->company_id !== $companyId, 403);

        $users = User::query()
            ->where('company_id', $companyId)
            ->where('branch_id', $branch->id)
            ->with('roles:name')
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('CompanyAdmin/Branches/Employees', [
            'branch' => [
                'id' => $branch->id,
                'name' => $branch->name,
                'code' => $branch->code,
            ],
            'users' => $users,
        ]);
    }

    private function generateBranchCode(int $companyId): string
    {
        $count = Branch::query()->where('company_id', $companyId)->count() + 1;

        return 'PMGB-' . str_pad((string) $count, 4, '0', STR_PAD_LEFT);
    }
}
