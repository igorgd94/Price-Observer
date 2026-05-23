<?php

namespace App\Http\Controllers;

use App\Services\CacheMetricsService;
use Inertia\Inertia;
use Inertia\Response;

class CacheController extends Controller
{
    public function index(): Response
    {
        $stats = CacheMetricsService::stats();

        $cacheMetrics = CacheMetricsService::keys();

        return Inertia::render('cache/Index', [

            'metrics' => [

                'total_hits' => $stats['hits'],

                'total_misses' => $stats['misses'],

                'hit_rate' => $stats['hit_rate'],

                'keys_count' => $stats['total_keys'],

                'last_hit_at' => $stats['last_hit_at'],
            ],

            'cache_metrics' => $cacheMetrics,
        ]);
    }
}
