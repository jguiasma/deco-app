<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreServicePricingRuleRequest;
use App\Http\Requests\UpdateServicePricingRuleRequest;
use App\Http\Resources\ServicePricingRuleResource;
use App\Models\ServicePricingRule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminServicePricingRuleController extends Controller
{
    public function index(Request $request)
    {
        $this->ensureAdmin($request);

        $pricingRules = ServicePricingRule::query()
            ->with('service')
            ->where('is_active', true)
            ->latest()
            ->paginate(20);

        return ServicePricingRuleResource::collection($pricingRules);
    }

    public function store(StoreServicePricingRuleRequest $request)
    {
        $this->ensureAdmin($request);

        $data = $request->validated();

        $pricingRule = DB::transaction(function () use ($data) {
            if (($data['is_active'] ?? true) === true) {
                return ServicePricingRule::updateOrCreate(
                    ['service_id' => $data['service_id'], 'is_active' => true],
                    $data,
                );
            }

            return ServicePricingRule::create($data);
        });

        return ServicePricingRuleResource::make($pricingRule->load('service'))
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdateServicePricingRuleRequest $request, ServicePricingRule $pricingRule)
    {
        $this->ensureAdmin($request);

        $data = $request->validated();

        DB::transaction(function () use ($pricingRule, $data) {
            $willBeActive = $data['is_active'] ?? $pricingRule->is_active;

            if ($willBeActive) {
                ServicePricingRule::query()
                    ->where('service_id', $data['service_id'])
                    ->where('is_active', true)
                    ->whereKeyNot($pricingRule->id)
                    ->update(['is_active' => false]);
            }

            $pricingRule->update($data);
        });

        return ServicePricingRuleResource::make($pricingRule->load('service'));
    }

    public function destroy(Request $request, ServicePricingRule $pricingRule)
    {
        $this->ensureAdmin($request);

        $pricingRule->delete();

        return response()->noContent();
    }

    private function ensureAdmin(Request $request): void
    {
        abort_unless($request->user()?->is_admin, 403, 'Accès réservé à l’administrateur.');
    }
}
