<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * The request is only used to manage the first contact. The final quote
     * owns the sent, accepted and rejected states.
     */
    public function up(): void
    {
        DB::table('quote_requests')
            ->whereIn('status', ['quoted', 'accepted', 'rejected'])
            ->update(['status' => 'contacted']);
    }

    public function down(): void
    {
        // Historical request states cannot be inferred safely.
    }
};
