<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('service_pricing_rules', function (Blueprint $table) {
            $table->decimal('reference_quantity', 12, 3)->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('service_pricing_rules', function (Blueprint $table) {
            $table->decimal('reference_quantity', 12, 3)->nullable(false)->change();
        });
    }
};
