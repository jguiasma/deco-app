<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $activeRules = DB::table('service_pricing_rules')
            ->where('is_active', true)
            ->orderByDesc('id')
            ->get(['id', 'service_id']);

        $keptServiceIds = [];

        foreach ($activeRules as $rule) {
            if (in_array($rule->service_id, $keptServiceIds, true)) {
                DB::table('service_pricing_rules')
                    ->where('id', $rule->id)
                    ->update(['is_active' => false]);

                continue;
            }

            $keptServiceIds[] = $rule->service_id;
        }
    }

    public function down(): void
    {
        // Les anciennes règles restent conservées, mais inactives pour éviter une estimation ambiguë.
    }
};
