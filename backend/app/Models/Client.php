<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
class Client extends Model
{
protected $fillable = [
    'first_name',
    'last_name',
    'phone',
    'email',
    'city',
    'address',
    'notes',
];
public function quoteRequests(): HasMany
{
    return $this->hasMany(QuoteRequest::class);
}
}
