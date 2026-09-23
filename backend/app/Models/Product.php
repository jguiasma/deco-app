<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
protected $fillable = [
    'name',
    'slug',
    'category',
    'description',
    'price',
    'price_label',
    'image_path',
    'is_active',
    'sort_order',
];

protected function casts(): array
{
    return [
        'price' => 'decimal:3',
        'is_active' => 'boolean',
    ];
}}
