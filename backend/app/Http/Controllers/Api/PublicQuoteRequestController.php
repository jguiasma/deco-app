<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreQuoteRequestRequest;
use App\Models\QuoteRequest;
use App\Models\ServicePricingRule;
use Illuminate\Validation\ValidationException;

class PublicQuoteRequestController extends Controller
{
    public function store(StoreQuoteRequestRequest $request)
    {
        $data = $request->validated();
        $pricingRule = $this->findPricingRule($data);
        [$estimatedMin, $estimatedMax] = $this->calculateEstimate(
            (float) $data['quantity'],
            $pricingRule,
        );

        $quoteRequest = QuoteRequest::create([
            'client_id' => null,

            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'phone' => $data['phone'],
            'email' => $data['email'] ?? null,
            'city' => $data['city'] ?? null,
            'address' => $data['address'] ?? null,

            'service_id' => $data['service_id'],
            'service_type' => $data['service_type'] ?? null,
            'pricing_rule_id' => $pricingRule->id,
            'quantity' => $data['quantity'],
            'unit' => $pricingRule->unit,
            'estimated_min' => $estimatedMin,
            'estimated_max' => $estimatedMax,
            'description' => $data['description'],
            'dimensions' => $data['dimensions'] ?? null,
            'approximate_budget' => $data['approximate_budget'] ?? null,
            'status' => 'new',
        ]);

        foreach ($request->file('photos', []) as $index => $photo) {
            $path = $photo->store("quote-request-images/{$quoteRequest->id}", 'local');

            $quoteRequest->images()->create([
                'disk' => 'local',
                'path' => $path,
                'original_name' => $photo->getClientOriginalName(),
                'mime_type' => $photo->getMimeType(),
                'size' => $photo->getSize(),
                'sort_order' => $index,
            ]);
        }

        return response()->json([
            'message' => 'Votre demande de devis a bien été envoyée.',
            'data' => [
                'id' => $quoteRequest->id,
                'status' => $quoteRequest->status,
                'estimated_min' => $quoteRequest->estimated_min,
                'estimated_max' => $quoteRequest->estimated_max,
                'photos_count' => $quoteRequest->images()->count(),
                'currency' => 'DT',
            ],
        ], 201);
    }

    private function findPricingRule(array $data): ServicePricingRule
    {
        $query = ServicePricingRule::query()
            ->where('service_id', $data['service_id'])
            ->where('is_active', true);

        $pricingRule = $query->latest()->first();

        if (! $pricingRule) {
            throw ValidationException::withMessages([
                'service_id' => ['Aucune règle de prix active n’est configurée pour ce service.'],
            ]);
        }

        return $pricingRule;
    }

    private function calculateEstimate(float $quantity, ServicePricingRule $pricingRule): array
    {
        $minPrice = (float) $pricingRule->min_price;
        $maxPrice = (float) $pricingRule->max_price;

        if ($pricingRule->calculation_method === 'fixed') {
            return [$minPrice, $maxPrice];
        }

        if ($pricingRule->calculation_method === 'per_unit') {
            return [$quantity * $minPrice, $quantity * $maxPrice];
        }

        if ($pricingRule->calculation_method === 'prorata') {
            $referenceQuantity = (float) $pricingRule->reference_quantity;

            if ($referenceQuantity <= 0) {
                throw ValidationException::withMessages([
                    'service_id' => ['La quantité de référence doit être supérieure à zéro pour un calcul au prorata.'],
                ]);
            }

            $factor = $quantity / $referenceQuantity;

            return [$factor * $minPrice, $factor * $maxPrice];
        }

        throw ValidationException::withMessages([
            'service_id' => ['La formule de prix configurée est invalide.'],
        ]);
    }
}
