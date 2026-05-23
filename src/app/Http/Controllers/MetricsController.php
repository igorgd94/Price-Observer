<?php

namespace App\Http\Controllers;

use App\Models\CacheMetric;
use App\Models\MonitoringJob;
use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class MetricsController extends Controller
{
    public function index(): Response
    {
        $cacheHits = CacheMetric::sum('hits');

        $cacheMisses = CacheMetric::sum('misses');

        $cacheHitRate = 0;

        if (($cacheHits + $cacheMisses) > 0) {
            $cacheHitRate = round(
                ($cacheHits / ($cacheHits + $cacheMisses)) * 100
            );
        }

        $failedJobs = MonitoringJob::query()
            ->where('status', 'failed')
            ->count();

        $metrics = [
            'total_requests' => rand(1000, 5000),

            'avg_response_time' => rand(80, 300),

            'cache_hit_rate' => $cacheHitRate,

            'failed_jobs' => $failedJobs,
        ];

        $cacheMetrics = CacheMetric::query()
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('metrics/Index', [
            'metrics' => $metrics,
            'cache_metrics' => $cacheMetrics,
        ]);
    }
}
