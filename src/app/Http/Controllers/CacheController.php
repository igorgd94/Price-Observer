<?php

namespace App\Http\Controllers;

use App\Models\CacheMetric;
use Inertia\Inertia;
use Inertia\Response;

class CacheController extends Controller
{
    public function index(): Response
    {
        $totalHits = CacheMetric::sum('hits');

        $totalMisses = CacheMetric::sum('misses');

        $hitRate = 0;

        if (($totalHits + $totalMisses) > 0) {
            $hitRate = round(
                ($totalHits / ($totalHits + $totalMisses)) * 100
            );
        }

        $lastHit = CacheMetric::query()
            ->latest('last_hit_at')
            ->value('last_hit_at');

        $metrics = [

            'total_hits' => $totalHits,

            'total_misses' => $totalMisses,

            'hit_rate' => $hitRate,

            'keys_count' => CacheMetric::count(),

            'last_hit_at' => $lastHit,
        ];

        $cacheMetrics = CacheMetric::query()
            ->latest('last_hit_at')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('cache/Index', [
            'metrics' => $metrics,
            'cache_metrics' => $cacheMetrics,
        ]);
    }
}
