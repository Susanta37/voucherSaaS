<?php

namespace App\Services;

use App\Models\Voucher;
use App\Models\VoucherTemplate;
use chillerlan\QRCode\QRCode;
use chillerlan\QRCode\QROptions;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Laravel\Facades\Image;

class PPCGeneratorService
{
    /**
     * Generate a composite PPC image with QR overlay.
     */
    public function generate(VoucherTemplate $template, array $data, $user): Voucher
    {
        $ppcCode = 'PPC-' . strtoupper(Str::random(8));
        $claimUrl = route('ppc.claim.form', ['code' => $ppcCode]);

        // 1. Configure and Generate QR Code binary
        $options = new QROptions([
            'version'      => 5,
            'outputType'   => QRCode::OUTPUT_IMAGE_PNG,
            'eccLevel'     => QRCode::ECC_L,
            'scale'        => 10,
            'imageBase64'  => false,
        ]);

        $qrBinary = (new QRCode($options))->render($claimUrl);

        // 2. Load the Background Template using Intervention v3
        $image = Image::read(Storage::disk('public')->path($template->background_image));

        // 3. Load the QR binary and resize based on template layout
        $qrImage = Image::read($qrBinary);
        $qrSize = $template->layout['qr_size'] ?? 200;
        $qrImage->resize($qrSize, $qrSize);

        // 4. Place QR on the Template at defined coordinates
        $image->place(
            $qrImage,
            'top-left',
            (int) ($template->layout['qr_x'] ?? 0),
            (int) ($template->layout['qr_y'] ?? 0)
        );

        // 5. Overlay the PPC Text
        // Note: Ensure public/fonts/Inter-Bold.ttf exists
        $image->text($ppcCode, (int) ($template->layout['text_x'] ?? 50), (int) ($template->layout['text_y'] ?? 50), function ($font) {
            $font->file(public_path('fonts/Inter-Bold.ttf')); 
            $font->size(35);
            $font->color('#ffffff');
        });

        // 6. Save final composite image to SaaS storage
        $finalPath = "generated_ppc/{$ppcCode}.png";
        Storage::disk('public')->put($finalPath, (string) $image->encodeByExtension('png'));

        return Voucher::create([
            'company_id'  => $user->company_id,
            'branch_id'   => $user->branch_id,
            'employee_id' => $user->id,
            'template_id' => $template->id,
            'code'        => $ppcCode,
            'image_path'  => $finalPath,
        ]);
    }
}