<?php

namespace App\Http\Controllers\Admin\CompanyAdmin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\BranchStoreRequest;
use App\Models\Branch;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BranchController extends Controller
{
    public function index(Request $request): Response
    {
        $branches = Branch::query()
            ->where('company_id', $request->user()->company_id)
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('CompanyAdmin/Branches/Index', [
            'branches' => $branches,
        ]);
    }

    public function store(BranchStoreRequest $request): RedirectResponse
    {
        Branch::query()->create([
            ...$request->validated(),
            'company_id' => $request->user()->company_id,
        ]);

        return back()->with('success', 'Branch created successfully.');
    }
}
