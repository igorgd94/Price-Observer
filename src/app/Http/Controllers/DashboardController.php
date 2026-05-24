<?php

namespace App\Http\Controllers;

use App\Models\MonitoringJob;
use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;
use App\Services\CacheMetricsService;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $productsCount = Product::count();

        $jobsProcessed = MonitoringJob::count();

        $cacheHitRate = CacheMetricsService::stats()['hit_rate'];

        $recentProducts = Product::query()
            ->where('last_checked_at', '>=', now()->subDay())
            ->latest('last_checked_at')
            ->take(5)
            ->get();

        $completedJobs = MonitoringJob::query()
            ->where('status', 'completed')
            ->count();

        $failedJobs = MonitoringJob::query()
            ->where('status', 'failed')
            ->count();

        return Inertia::render('Dashboard', [

            'metrics' => [

                'products_count' => $productsCount,

                'jobs_processed' => $jobsProcessed,

                'cache_hit_rate' => $cacheHitRate,

                'avg_response_time' => 120,

                'completed_jobs' => $completedJobs,

                'failed_jobs' => $failedJobs,
            ],

            'recent_products' => $recentProducts,
        ]);
    }
}
