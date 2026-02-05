<?php

namespace App\Http\Controllers;

use App\Models\Voucher;
use App\Models\VoucherClaim;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PublicClaimController extends Controller
{
    public function show(string $code)
    {
        $voucher = Voucher::with('company')->where('code', $code)->firstOrFail();

        return Inertia::render('Public/ClaimPPC', [
            'voucherCode' => $voucher->code,
            'companyName' => $voucher->company->name ?? 'Our Company',
        ]);
    }

    public function submit(string $code, Request $request)
    {
        $voucher = Voucher::where('code', $code)->firstOrFail();

        $validated = $request->validate([
            'customer_name'     => 'required|string|max:100',
            'customer_email'    => 'nullable|email|max:150',
            'customer_whatsapp' => 'required|string|max:20',
        ]);

        // 🚫 Prevent duplicate claim
        $alreadyClaimed = VoucherClaim::where('voucher_id', $voucher->id)
            ->where(function ($q) use ($validated) {
                $q->where('customer_whatsapp', $validated['customer_whatsapp']);

                if (!empty($validated['customer_email'])) {
                    $q->orWhere('customer_email', $validated['customer_email']);
                }
            })
            ->exists();

        if ($alreadyClaimed) {
            return back()->withErrors([
                'customer_whatsapp' => 'This voucher has already been claimed with this contact.',
            ]);
        }

        DB::transaction(function () use ($voucher, $validated, $request) {
            VoucherClaim::create([
                'company_id'        => $voucher->company_id,
                'voucher_id'        => $voucher->id,
                'customer_name'     => $validated['customer_name'],
                'customer_email'    => $validated['customer_email'] ?? null,
                'customer_whatsapp' => $validated['customer_whatsapp'],
                'ip_address'        => $request->ip(),
                'user_agent'        => $request->userAgent(),
            ]);

            $voucher->increment('claims_count');
        });

        return back()->with('success', 'Thank you! Your voucher has been successfully claimed.');
    }
}
