<?php

namespace App\Http\Controllers;

use App\Models\Voucher;
use App\Models\VoucherClaim;
use Illuminate\Http\Request;

class PublicClaimController extends Controller
{
    public function show(string $code)
    {
        $voucher = Voucher::where('code', $code)->firstOrFail();
        return view('claim', compact('voucher'));
    }

    public function submit(string $code, Request $request)
    {
        $voucher = Voucher::where('code', $code)->firstOrFail();

        VoucherClaim::create([
            'company_id' => $voucher->company_id,
            'voucher_id' => $voucher->id,
            'customer_name' => $request->customer_name,
            'customer_email' => $request->customer_email,
            'customer_whatsapp' => $request->customer_whatsapp,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        $voucher->increment('claims_count');

        return back()->with('success', 'Claim submitted successfully');
    }
}
