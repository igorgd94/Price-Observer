<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;

class CacheMetricsService
{
    public static function stats(): array
    {
        $hits = Cache::get('metrics.cache.hits', 0);

        $misses = Cache::get('metrics.cache.misses', 0);

        $total = $hits + $misses;

        $hitRate = $total > 0
            ? round(($hits / $total) * 100, 2)
            : 0;

        return [
            'hits' => $hits,
            'misses' => $misses,
            'total' => $total,
            'hit_rate' => $hitRate,
        ];
    }
}
