<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('voucher_templates', function (Blueprint $table) {

            // Only add if not exists (safe for prod)
            if (!Schema::hasColumn('voucher_templates', 'name')) {
                $table->string('name')->after('company_id');
            }

            if (!Schema::hasColumn('voucher_templates', 'background_image')) {
                $table->string('background_image')->after('name');
            }

            if (!Schema::hasColumn('voucher_templates', 'is_active')) {
                $table->boolean('is_active')->default(true)->after('layout');
            }
        });
    }

    public function down(): void
    {
        Schema::table('voucher_templates', function (Blueprint $table) {
            $table->dropColumn(['name', 'background_image', 'is_active']);
        });
    }
};
