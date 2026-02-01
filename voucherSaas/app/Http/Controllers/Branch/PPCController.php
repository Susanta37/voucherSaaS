<?php

namespace App\Http\Controllers\Branch;

use App\Http\Controllers\Controller;
use App\Models\Voucher;
use App\Models\VoucherTemplate;
use chillerlan\QRCode\QRCode;
use chillerlan\QRCode\QROptions;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
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
                'total' => Voucher::count(),
                'claims' => Voucher::sum('claims_count'),
                'today' => Voucher::whereDate('created_at', today())->count(),
            ],
        ]);
    }

    // ===========================
    // GENERATE FINAL VOUCHER
    // ===========================
    public function store(Request $request)
    {
        $request->validate([
            'template_id' => 'required|exists:voucher_templates,id',
        ]);

        $template = VoucherTemplate::findOrFail($request->template_id);
        $layout   = $template->layout;

        // 🔒 Layout is ALREADY REAL PIXELS (from designer)
        $qrX = (int) $layout['qr_x'];
        $qrY = (int) $layout['qr_y'];
        $qrSize = (int) $layout['qr_size'];
        $textX = (int) $layout['text_x'];
        $textY = (int) $layout['text_y'];

        $code = 'PPC-' . strtoupper(uniqid());

        $voucher = Voucher::create([
            'company_id'  => auth()->user()->company_id,
            'branch_id'   => auth()->user()->branch_id,
            'employee_id' => auth()->id(),
            'template_id' => $template->id,
            'code'        => $code,
            'claims_count'=> 0,
        ]);

        // ===========================
        // QR GENERATION (PNG)
        // ===========================
        $claimUrl = route('ppc.claim.form', $code);

        $qrOptions = new QROptions([
            'outputType' => QRCode::OUTPUT_IMAGE_PNG,
            'eccLevel'   => QRCode::ECC_L,
            'scale'      => 10,
            'imageBase64'=> false,
        ]);

        $qrBinary = (new QRCode($qrOptions))->render($claimUrl);

        $qrPath = "qr/{$code}.png";
        Storage::disk('public')->put($qrPath, $qrBinary);

        // ===========================
        // IMAGE COMPOSITION (INTERVENTION ONLY)
        // ===========================
        $img = $this->image->read(
            Storage::disk('public')->path($template->background_image)
        );

        $img->place(
            Storage::disk('public')->path($qrPath),
            'top-left',
            $qrX,
            $qrY,
            $qrSize,
            $qrSize
        );

        $img->text($code, $textX, $textY, function ($font) {
            $font->file(public_path('fonts/Inter-Bold.ttf'));
            $font->size(28);
            $font->color('#ffffff');
        });

        $finalPath = "vouchers/{$code}.png";
        $img->toPng()->save(Storage::disk('public')->path($finalPath));

        $voucher->update([
            'qr_path'    => $qrPath,
            'image_path' => $finalPath,
        ]);

        return back()->with('success', 'Voucher generated successfully');
    }

    // ===========================
    // PREVIEW (USES SAME ENGINE)
    // ===========================
    public function preview(Request $request)
    {
        $request->validate([
            'template_id' => 'required|exists:voucher_templates,id',
        ]);

        $template = VoucherTemplate::findOrFail($request->template_id);
        $layout   = $template->layout;

        $qrX = (int) $layout['qr_x'];
        $qrY = (int) $layout['qr_y'];
        $qrSize = (int) $layout['qr_size'];
        $textX = (int) $layout['text_x'];
        $textY = (int) $layout['text_y'];

        $dummyCode = 'PPC-PREVIEW';

        // QR
        $qrOptions = new QROptions([
            'outputType' => QRCode::OUTPUT_IMAGE_PNG,
            'scale'      => 10,
        ]);

        $qrBinary = (new QRCode($qrOptions))->render(route('home'));
        Storage::disk('public')->put('preview/qr.png', $qrBinary);

        // Compose preview
        $img = $this->image->read(
            Storage::disk('public')->path($template->background_image)
        );

        $img->place(
            Storage::disk('public')->path('preview/qr.png'),
            'top-left',
            $qrX,
            $qrY,
            $qrSize,
            $qrSize
        );

        $img->text($dummyCode, $textX, $textY, function ($font) {
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

    // ===========================
// VIEW ALL CLAIMS
// ===========================
public function claims(Request $request)
{
    // We use the VoucherClaim model to get all claims
    // We eager load the 'voucher' and its 'template' to show details in the UI
    $query = \App\Models\VoucherClaim::with(['voucher.template'])->latest();

    // Optional: Search by customer name or email
    if ($request->search) {
        $query->where('customer_name', 'like', "%{$request->search}%")
              ->orWhere('customer_email', 'like', "%{$request->search}%");
    }

    return Inertia::render('Branch/PPC/Claims', [
        'claims' => $query->paginate(15)->withQueryString(),
        'filters' => $request->only(['search']),
    ]);
}

public function verify(Request $request)
{
    $request->validate([
        'code' => 'required|string',
    ]);

    // Find voucher within the user's company (CompanyScope applies automatically)
    $voucher = Voucher::where('code', $request->code)->first();

    if (!$voucher) {
        return response()->json([
            'success' => false,
            'message' => 'Invalid Privilege Code.'
        ], 404);
    }

    return response()->json([
        'success' => true,
        'message' => 'Code Verified Successfully!',
        'data' => [
            'code' => $voucher->code,
            'created_at' => $voucher->created_at->format('d M Y'),
            'claims' => $voucher->claims_count,
        ]
    ]);
}
}
