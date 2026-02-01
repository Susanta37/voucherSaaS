<?php

namespace App\Http\Controllers\Admin\CompanyAdmin;

use App\Http\Controllers\Controller;
use App\Models\VoucherTemplate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class TemplateController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Templates/Index', [
            'templates' => VoucherTemplate::latest()->paginate(9),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Templates/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'background_image' => 'required|image',
            'layout' => 'required',
        ]);

        $layout = is_string($request->layout) ? json_decode($request->layout, true) : $request->layout;

        $path = $request->file('background_image')->store('templates', 'public');

        VoucherTemplate::create([
            'company_id' => auth()->user()->company_id,
            'name' => $request->name,
            'background_image' => $path,
            'layout' => $layout,
            'is_active' => true,
        ]);

        return redirect('/admin/templates');
    }

    public function edit(VoucherTemplate $template)
    {
        return Inertia::render('Admin/Templates/Edit', ['template' => $template]);
    }

    public function update(Request $request, VoucherTemplate $template)
    {
        $request->validate([
            'name' => 'required|string',
            'layout' => 'required',
        ]);

        $data = [
            'name' => $request->name,
            'layout' => is_string($request->layout) ? json_decode($request->layout, true) : $request->layout,
        ];

        if ($request->hasFile('background_image')) {
            Storage::disk('public')->delete($template->background_image);
            $data['background_image'] = $request->file('background_image')->store('templates', 'public');
        }

        $template->update($data);

        return redirect('/admin/templates');
    }
        public function destroy(VoucherTemplate $template)
    {
        Storage::disk('public')->delete($template->background_image);
        $template->delete();
        return redirect()->back()->with('success', 'Template removed');
    }
}