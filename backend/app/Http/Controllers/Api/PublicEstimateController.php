<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CalculateEstimateRequest;
use App\Models\ServicePricingRule;
use App\Models\Service;
use Illuminate\Validation\ValidationException;

class PublicEstimateController extends Controller
{
    public function store(CalculateEstimateRequest $request)
    {
        $data = $request->validated();
        $service = Service::findOrFail($data['service_id']);

        if ($service->pricing_mode === 'on_quote') {
            return response()->json([
                'data' => [
                    'service' => ['id' => $service->id, 'title' => $service->title],
                    'on_quote' => true,
                    'note' => 'Cette prestation est réalisée sur devis. Prenez rendez-vous afin que nous puissions étudier votre projet et préparer le prix final.',
                ],
            ]);
        }

        $pricingRuleQuery = ServicePricingRule::query()
            ->with('service')
            ->where('service_id', $data['service_id'])
            ->where('is_active', true);

        $pricingRule = $pricingRuleQuery->latest()->first();

        if (! $pricingRule) {
            return response()->json([
                'data' => [
                    'service' => ['id' => $service->id, 'title' => $service->title],
                    'on_quote' => true,
                    'note' => 'Cette prestation est réalisée sur devis. Prenez rendez-vous afin que nous puissions étudier votre projet et préparer le prix final.',
                ],
            ]);
        }

        $quantity = (float) $data['quantity'];
        $minPrice = (float) $pricingRule->min_price;
        $maxPrice = (float) $pricingRule->max_price;

        [$estimatedMin, $estimatedMax] = match ($pricingRule->calculation_method) {
            'fixed' => [$minPrice, $maxPrice],
            'per_unit' => [$quantity * $minPrice, $quantity * $maxPrice],
            'prorata' => $this->calculateProrata($quantity, $pricingRule, $minPrice, $maxPrice),
            default => throw ValidationException::withMessages([
                'service_id' => ['La formule de prix configurée est invalide.'],
            ]),
        };

        return response()->json([
            'data' => [
                'service' => [
                    'id' => $pricingRule->service->id,
                    'title' => $pricingRule->service->title,
                ],
                'unit' => $pricingRule->unit,
                'calculation_method' => $pricingRule->calculation_method,
                'quantity' => $quantity,
                'reference_quantity' => $pricingRule->reference_quantity,
                'estimated_min' => round($estimatedMin, 3),
                'estimated_max' => round($estimatedMax, 3),
                'currency' => 'DT',
                'note' => 'Le montant affiché est une estimation indicative. Le prix final peut varier après la visite, la prise de mesures, le choix des matériaux et l’évaluation de la difficulté des travaux sur mesure.',
            ],
        ]);
    }

    private function calculateProrata(
        float $quantity,
        ServicePricingRule $pricingRule,
        float $minPrice,
        float $maxPrice,
    ): array {
        $referenceQuantity = (float) $pricingRule->reference_quantity;

        if ($referenceQuantity <= 0) {
            throw ValidationException::withMessages([
                'service_id' => ['La quantité de référence doit être supérieure à zéro pour un calcul au prorata.'],
            ]);
        }

        $factor = $quantity / $referenceQuantity;

        return [$factor * $minPrice, $factor * $maxPrice];
    }
}
