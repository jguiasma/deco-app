<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('service_pricing_rules', function (Blueprint $table) {
            $table->dropColumn('quality');
        });

        Schema::table('quote_requests', function (Blueprint $table) {
            $table->dropColumn('quality');
        });
    }

    public function down(): void
    {
        Schema::table('service_pricing_rules', function (Blueprint $table) {
            $table->string('quality')->nullable()->after('service_id');
        });

        Schema::table('quote_requests', function (Blueprint $table) {
            $table->string('quality')->nullable()->after('pricing_rule_id');
        });
    }
};
