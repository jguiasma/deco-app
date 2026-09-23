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
        $table->dropForeign(['client_id']);

        $table->foreignId('client_id')->nullable()->change();

        $table->string('first_name')->nullable()->after('id');
        $table->string('last_name')->nullable()->after('first_name');
        $table->string('phone')->nullable()->after('last_name');
        $table->string('email')->nullable()->after('phone');
        $table->string('city')->nullable()->after('email');
        $table->text('address')->nullable()->after('city');

        $table->foreign('client_id')
            ->references('id')
            ->on('clients')
            ->nullOnDelete();
    });
}

    /**
     * Reverse the migrations.
     */
   public function down(): void
{
    Schema::table('quote_requests', function (Blueprint $table) {
        $table->dropForeign(['client_id']);

        $table->dropColumn([
            'first_name',
            'last_name',
            'phone',
            'email',
            'city',
            'address',
        ]);

        $table->foreignId('client_id')->change();

        $table->foreign('client_id')
            ->references('id')
            ->on('clients')
            ->cascadeOnDelete();
    });
}
};
