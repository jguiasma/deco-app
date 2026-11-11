<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServiceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'parent_id' => $this->parent_id,
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'image_path' => $this->image_path,
            'pricing_mode' => $this->pricing_mode,
            'pricing_rule' => $this->whenLoaded('activePricingRule', fn () => $this->activePricingRule ? [
                'unit' => $this->activePricingRule->unit,
                'calculation_method' => $this->activePricingRule->calculation_method,
            ] : null),
            'children' => $this->whenLoaded('children', fn () => self::collection($this->children)),
        ];
    }
}
