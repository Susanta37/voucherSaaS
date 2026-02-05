<?php

namespace App\Http\Controllers\Branch;

use App\Http\Controllers\Controller;
use App\Models\Voucher;
use App\Models\VoucherTemplate;
use chillerlan\QRCode\QRCode;
use chillerlan\QRCode\QROptions;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;
use Inertia\Inertia;

class PPCController extends Controller
{
    protected ImageManager $image;

    public function __construct()
    {
        $this->image = new ImageManager(new Driver());
    }

    public function index(Request $request)
    {
        $query = Voucher::with(['template', 'claims'])->latest();

        if ($request->search) {
            $query->where('code', 'like', "%{$request->search}%");
        }

        if ($request->template_id) {
            $query->where('template_id', $request->template_id);
        }

        return Inertia::render('Branch/PPC/Index', [
            'vouchers' => $query->paginate(10)->withQueryString(),
            'templates' => VoucherTemplate::where('is_active', true)->get(),
            'filters' => $request->only(['search', 'template_id']),
            'kpis' => [
                'total'  => Voucher::count(),
                'claims' => Voucher::sum('claims_count'),
                'today'  => Voucher::whereDate('created_at', today())->count(),
            ],
        ]);
    }

    // ======================================================
    // GENERATE FINAL VOUCHER (SAFE & SCANNABLE)
    // ======================================================
    public function store(Request $request)
    {
        $request->validate([
            'template_id' => 'required|exists:voucher_templates,id',
        ]);

        $template = VoucherTemplate::findOrFail($request->template_id);
        $layout   = $template->layout;

        foreach (['qr_x', 'qr_y', 'qr_size', 'text_x', 'text_y'] as $key) {
            abort_unless(isset($layout[$key]), 422, 'Invalid template layout');
        }

        try {
            $qrX    = (int) $layout['qr_x'];
            $qrY    = (int) $layout['qr_y'];
            $qrSize = (int) $layout['qr_size'];
            $textX  = (int) $layout['text_x'];
            $textY  = (int) $layout['text_y'];

            $code = 'PPC-' . strtoupper(uniqid());

            $voucher = Voucher::create([
                'company_id'   => Auth::user()->company_id,
                'branch_id'    => Auth::user()->branch_id,
                'employee_id'  => Auth::user()->id(),
                'template_id'  => $template->id,
                'code'         => $code,
                'claims_count' => 0,
            ]);

            // ===========================
            // QR GENERATION (CORRECT)
            // ===========================
            $qrOptions = new QROptions([
                'outputType'    => QRCode::OUTPUT_IMAGE_PNG,
                'eccLevel'      => QRCode::ECC_H,
                'scale'         => 1,
                'quietzoneSize' => 16,
                'imageBase64'   => false,
            ]);

            $qrBinary = (new QRCode($qrOptions))
                ->render(route('ppc.claim.form', $code));

            $qrImage = $this->image
                ->read($qrBinary)
                ->resize($qrSize, $qrSize);

            // ===========================
            // IMAGE COMPOSITION
            // ===========================
            $img = $this->image->read(
                Storage::disk('public')->path($template->background_image)
            );

            // --- White backing plate (SAFE METHOD) ---
            $padding = 12;
            $bgSize  = $qrSize + ($padding * 2);

            $whiteBg = $this->image
                ->create($bgSize, $bgSize)
                ->fill('#ffffff');

            // Place white background
            $img->place(
                $whiteBg,
                'top-left',
                $qrX - $padding,
                $qrY - $padding
            );

            // Place QR on top
            $img->place(
                $qrImage,
                'top-left',
                $qrX,
                $qrY
            );

            // PPC Code Text
            $img->text($code, $textX, $textY, function ($font) {
                $font->file(public_path('fonts/Inter-Bold.ttf'));
                $font->size(28);
                $font->color('#ffffff');
            });

            $finalPath = "vouchers/{$code}.png";
            $img->toPng()->save(Storage::disk('public')->path($finalPath));

            $voucher->update([
                'image_path' => $finalPath,
            ]);

            return back()->with('success', 'Voucher generated successfully');

        } catch (\Throwable $e) {
            Log::error('PPC voucher generation failed', [
                'template_id' => $template->id,
                'layout'      => $layout,
                'error'       => $e->getMessage(),
            ]);

            return back()->withErrors(
                'Voucher generation failed. Please try again or contact support.'
            );
        }
    }

    // ======================================================
    // PREVIEW (USES SAME ENGINE)
    // ======================================================
    public function preview(Request $request)
    {
        $request->validate([
            'template_id' => 'required|exists:voucher_templates,id',
        ]);

        $template = VoucherTemplate::findOrFail($request->template_id);
        $layout   = $template->layout;

        $qrX    = (int) $layout['qr_x'];
        $qrY    = (int) $layout['qr_y'];
        $qrSize = (int) $layout['qr_size'];
        $textX  = (int) $layout['text_x'];
        $textY  = (int) $layout['text_y'];

        $qrOptions = new QROptions([
            'outputType'    => QRCode::OUTPUT_IMAGE_PNG,
            'eccLevel'      => QRCode::ECC_H,
            'scale'         => 1,
            'quietzoneSize' => 16,
        ]);

        $qrImage = $this->image
            ->read((new QRCode($qrOptions))->render(route('home')))
            ->resize($qrSize, $qrSize);

        $img = $this->image->read(
            Storage::disk('public')->path($template->background_image)
        );

        $padding = 12;
        $bgSize  = $qrSize + ($padding * 2);

        $whiteBg = $this->image
            ->create($bgSize, $bgSize)
            ->fill('#ffffff');

        $img->place(
            $whiteBg,
            'top-left',
            $qrX - $padding,
            $qrY - $padding
        );

        $img->place(
            $qrImage,
            'top-left',
            $qrX,
            $qrY
        );

        $img->text('PPC-PREVIEW', $textX, $textY, function ($font) {
            $font->file(public_path('fonts/Inter-Bold.ttf'));
            $font->size(28);
            $font->color('#ffffff');
        });

        $previewPath = 'preview/voucher_preview.png';
        $img->toPng()->save(Storage::disk('public')->path($previewPath));

        return response()->json([
            'image' => asset("storage/{$previewPath}") . '?t=' . time(),
        ]);
    }

    // ======================================================
    // CLAIMS & VERIFY
    // ======================================================
    public function claims(Request $request)
{
    $query = \App\Models\VoucherClaim::with(['voucher.template', 'voucher.branch'])->latest();

    if ($search = $request->search) {
        $query->where(function($q) use ($search) {
            $q->where('customer_name', 'like', "%{$search}%")
              ->orWhere('customer_email', 'like', "%{$search}%")
              ->orWhere('vehicle_registration', 'like', "%{$search}%")
              ->orWhereHas('voucher', function($v) {
                  $v->where('code', 'like', "%{$v}%");
              });
        });
    }

    return Inertia::render('Branch/PPC/Claims', [
        'claims'  => $query->paginate(15)->withQueryString(),
        'filters' => $request->only(['search']),
        'stats'   => [
            'total_claims' => \App\Models\VoucherClaim::count(),
            'today_claims' => \App\Models\VoucherClaim::whereDate('created_at', today())->count(),
            'unique_vehicles' => \App\Models\VoucherClaim::distinct('vehicle_registration')->count(),
        ]
    ]);
}

public function verify(Request $request)
{
    $request->validate([
        'code' => 'required|string',
    ]);

    $code = $request->code;

    // Defensive: extract code if full URL is sent
    if (str_contains($code, '/claim/')) {
        $code = basename($code);
    }

    $voucher = Voucher::with([
            'template',
            'claims',
            'branch',
             'employee' => function ($query) {
            $query->withoutGlobalScopes(); // 🔥 KEY FIX
        },
        ])
         ->withoutGlobalScopes()
        ->where('code', $code)
        ->first();

    if (! $voucher) {
        return response()->json([
            'success' => false,
            'message' => 'Invalid Privilege Code.',
        ], 404);
    }

    // 🚨 Inactive privilege
    if (! $voucher->template?->is_active) {
        return response()->json([
            'success' => false,
            'message' => 'This privilege is currently inactive.',
        ], 403);
    }

    // ✅ ALREADY CLAIMED — BUT GENUINE
    if ($voucher->claims()->exists()) {
        return response()->json([
            'success' => true,
            'status'  => 'claimed',
            'message' => 'This is a genuine Premsons Privilege code and has already been registered.',
            'data' => [
                'code'        => $voucher->code,
                'template'    => $voucher->template->name,
                'branch'      => $voucher->branch->name,
                'created_by'  => $voucher->employee?->name ?? 'Premsons Staff',
                'created_at'  => $voucher->created_at->format('d M Y'),
                'claimed_at'  => optional($voucher->claims->first())->created_at?->format('d M Y'),
            ],
        ]);
    }

    // ✅ VALID & UNUSED
    return response()->json([
        'success' => true,
        'status'  => 'valid',
        'message' => 'Privilege Code is Genuine and Valid',
        'data' => [
            'code'        => $voucher->code,
            'template'    => $voucher->template->name,
            'branch'      => $voucher->branch->name,
            'created_by'  => $voucher->employee?->name ?? 'Premsons Staff',
            'created_at'  => $voucher->created_at->format('d M Y'),
        ],
    ]);
}


}
