<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
class ServicePricingRule extends Model
{
protected $fillable = [
    'service_id',
    'unit',
    'calculation_method',
    'reference_quantity',
    'min_price',
    'max_price',
    'is_active',
];

protected function casts(): array
{
    return [
        'reference_quantity' => 'decimal:3',
        'min_price' => 'decimal:3',
        'max_price' => 'decimal:3',
        'is_active' => 'boolean',
    ];
}

public function service(): BelongsTo
{
    return $this->belongsTo(Service::class);
}}
