<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
 public function up(): void
{
    Schema::table('quote_requests', function (Blueprint $table) {
        $table->foreignId('pricing_rule_id')
            ->nullable()
            ->constrained('service_pricing_rules')
            ->nullOnDelete();

        $table->string('quality')->nullable();
        $table->decimal('quantity', 12, 3)->nullable();
        $table->string('unit')->nullable();

        $table->decimal('estimated_min', 12, 3)->nullable();
        $table->decimal('estimated_max', 12, 3)->nullable();
    });
}
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('quote_requests', function (Blueprint $table) {
            //
        });
    }
};
