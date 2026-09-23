<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Quote extends Model
{
    protected $fillable = [
        'quote_request_id',
        'quote_number',
        'status',
        'currency',
        'subtotal',
        'discount',
        'total',
        'deposit',
        'remaining',
        'issued_at',
        'valid_until',
        'conditions',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'subtotal' => 'decimal:3',
            'discount' => 'decimal:3',
            'total' => 'decimal:3',
            'deposit' => 'decimal:3',
            'remaining' => 'decimal:3',
            'issued_at' => 'date',
            'valid_until' => 'date',
        ];
    }

    public function quoteRequest(): BelongsTo
    {
        return $this->belongsTo(QuoteRequest::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(QuoteItem::class)->orderBy('sort_order');
    }

    public function project(): HasOne
    {
        return $this->hasOne(Project::class);
    }
}
