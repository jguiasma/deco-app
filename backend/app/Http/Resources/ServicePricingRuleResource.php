<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServicePricingRuleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'service_id' => $this->service_id,
            'unit' => $this->unit,
            'calculation_method' => $this->calculation_method,
            'reference_quantity' => $this->reference_quantity,
            'min_price' => $this->min_price,
            'max_price' => $this->max_price,
            'is_active' => $this->is_active,
            'service' => $this->whenLoaded('service', fn () => [
                'id' => $this->service?->id,
                'title' => $this->service?->title,
            ]),
        ];
    }
}
