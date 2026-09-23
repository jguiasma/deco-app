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
    Schema::create('service_pricing_rules', function (Blueprint $table) {
        $table->id();

        $table->foreignId('service_id')
            ->constrained()
            ->cascadeOnDelete();

        $table->string('quality')->nullable();
        $table->string('unit'); // m², mètre, pièce…
        $table->string('calculation_method')->default('prorata');

        $table->decimal('reference_quantity', 12, 3);
        $table->decimal('min_price', 12, 3);
        $table->decimal('max_price', 12, 3);

        $table->boolean('is_active')->default(true);
        $table->timestamps();
    });
}
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('service_pricing_rules');
    }
};
