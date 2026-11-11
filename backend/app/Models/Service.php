<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
class Service extends Model
{
    protected $fillable = [
        'title',
        'parent_id',
        'slug',
        'description',
        'image_path',
        'pricing_mode',
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

    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(self::class, 'parent_id')->orderBy('sort_order');
    }

    public function pricingRules(): HasMany
    {
        return $this->hasMany(ServicePricingRule::class);
    }

public function activePricingRule(): HasOne
{
    return $this->hasOne(ServicePricingRule::class)
        ->where('is_active', true)
        ->latestOfMany();
}
}
