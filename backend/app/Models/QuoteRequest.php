<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
class QuoteRequest extends Model
{
protected $fillable = [
    'client_id',

    'first_name',
    'last_name',
    'phone',
    'email',
    'city',
    'address',

    'service_id',
    'service_type',
    'pricing_rule_id',
    'quantity',
    'unit',
    'estimated_min',
    'estimated_max',
    'description',
    'dimensions',
    'approximate_budget',
    'status',
    'admin_notes',
];

protected function casts(): array
{
    return [
        'approximate_budget' => 'decimal:3',
        'quantity' => 'decimal:3',
        'estimated_min' => 'decimal:3',
        'estimated_max' => 'decimal:3',
    ];
}

public function client(): BelongsTo
{
    return $this->belongsTo(Client::class);
}

public function service(): BelongsTo
{
    return $this->belongsTo(Service::class);
}

public function pricingRule(): BelongsTo
{
    return $this->belongsTo(ServicePricingRule::class, 'pricing_rule_id');
}

public function images(): HasMany
{
    return $this->hasMany(QuoteRequestImage::class)->orderBy('sort_order');
}
}
