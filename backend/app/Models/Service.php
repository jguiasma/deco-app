<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
class Service extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'description',
        'image_path',
        'is_active',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }


    public function quoteRequests(): HasMany
{
    return $this->hasMany(QuoteRequest::class);
}
public function pricingRules(): HasMany
{
    return $this->hasMany(ServicePricingRule::class);
}
}