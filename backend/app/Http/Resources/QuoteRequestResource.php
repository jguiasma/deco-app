<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuoteRequestResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'phone' => $this->phone,
            'email' => $this->email,
            'city' => $this->city,
            'address' => $this->address,
            'service_type' => $this->service_type,
            'quantity' => $this->quantity,
            'unit' => $this->unit,
            'estimated_min' => $this->estimated_min,
            'estimated_max' => $this->estimated_max,
            'description' => $this->description,
            'dimensions' => $this->dimensions,
            'approximate_budget' => $this->approximate_budget,
            'status' => $this->status,
            'admin_notes' => $this->admin_notes,
            'created_at' => $this->created_at?->toISOString(),
            'service' => $this->whenLoaded('service', fn () => [
                'id' => $this->service?->id,
                'title' => $this->service?->title,
                'slug' => $this->service?->slug,
            ]),
            'pricing_rule' => $this->whenLoaded('pricingRule', fn () => [
                'id' => $this->pricingRule?->id,
                'calculation_method' => $this->pricingRule?->calculation_method,
            ]),
            'images' => QuoteRequestImageResource::collection($this->whenLoaded('images')),
        ];
    }
}
