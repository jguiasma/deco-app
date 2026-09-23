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
        Schema::create('quotes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('quote_request_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();
            $table->string('quote_number')->unique();
            $table->string('status')->default('draft');
            $table->string('currency', 3)->default('TND');
            $table->decimal('subtotal', 12, 3)->default(0);
            $table->decimal('discount', 12, 3)->default(0);
            $table->decimal('total', 12, 3)->default(0);
            $table->decimal('deposit', 12, 3)->default(0);
            $table->decimal('remaining', 12, 3)->default(0);
            $table->date('issued_at')->nullable();
            $table->date('valid_until')->nullable();
            $table->text('conditions')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quotes');
    }
};
