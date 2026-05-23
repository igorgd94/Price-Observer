<?php

namespace App\Models;

use Database\Factories\CacheMetricFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'key_name',
    'hits',
    'misses',
    'last_hit_at',
])]
class CacheMetric extends Model
{
    /** @use HasFactory<CacheMetricFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'last_hit_at' => 'datetime',
        ];
    }
}
