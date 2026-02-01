<?php
// tests/Feature/PPCGenerationTest.php
use App\Models\Company;
use App\Models\Branch;
use App\Models\User;
use App\Models\VoucherTemplate;
use App\Services\PPCGeneratorService;
use Illuminate\Support\Facades\Storage;

it('generates a branded ppc image successfully', function () {
    // 1. Setup Fake Storage
    Storage::fake('public');
    
    // 2. Create Parent Data
    $company = Company::create([
        'name' => 'Premsons Motors',
        'slug' => 'premsons-motors',
        'status' => 'active'
    ]);

    $branch = Branch::create([
        'company_id' => $company->id,
        'name' => 'Ranchi Main',
        'code' => 'RNC01',
        'is_active' => true
    ]);
    
    $user = User::create([
        'company_id' => $company->id, 
        'branch_id' => $branch->id,
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => bcrypt('password')
    ]);

    // 3. Define the background image path
    $bgPath = 'templates/bg.png';

    // IMPORTANT: Actually put a "fake" image file in the fake storage
    // Intervention Image needs to read real bytes. 
    // Since we are using read(), we provide a tiny valid PNG structure or a placeholder.
    Storage::disk('public')->put($bgPath, base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='));

    $template = VoucherTemplate::create([
        'company_id' => $company->id,
        'name' => 'Default Template',
        'background_image' => $bgPath,
        'layout' => [
            'qr_x' => 100, 
            'qr_y' => 100, 
            'qr_size' => 200,
            'text_x' => 100,
            'text_y' => 350
        ],
        'is_active' => true
    ]);

    // 4. Run Service
    $service = app(PPCGeneratorService::class);
    $voucher = $service->generate($template, [], $user);

    // 5. Assertions
    expect($voucher->code)->toContain('PPC-');
    Storage::disk('public')->assertExists($voucher->image_path);
});