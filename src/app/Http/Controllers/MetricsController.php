<?php

namespace App\Http\Controllers;

use App\Models\MonitoringJob;
use App\Models\PriceHistory;
use App\Models\Product;
use App\Services\RequestMetricsService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redis;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Artisan;

class MetricsController extends Controller
{
    public function index(): Response
    {
        /*
        |--------------------------------------------------------------------------
        | Request Metrics
        |--------------------------------------------------------------------------
        */

        $requestMetrics =
            RequestMetricsService::stats();

        /*
        |--------------------------------------------------------------------------
        | Queue Metrics
        |--------------------------------------------------------------------------
        */

        $queueMetrics = [

            'failed_jobs' =>
                DB::table('failed_jobs')->count(),

            'completed_jobs' =>
                MonitoringJob::query()
                    ->where('status', 'completed')
                    ->count(),

            'failed_monitoring_jobs' =>
                MonitoringJob::query()
                    ->where('status', 'failed')
                    ->count(),
        ];

        /*
        |--------------------------------------------------------------------------
        | Scraping Metrics
        |--------------------------------------------------------------------------
        */

        $totalMonitoringJobs =
            MonitoringJob::query()->count();

        $successfulMonitoringJobs =
            MonitoringJob::query()
                ->where('status', 'completed')
                ->count();

        $successRate =
            $totalMonitoringJobs > 0

                ? round(
                (
                    $successfulMonitoringJobs
                    / $totalMonitoringJobs
                ) * 100,
                2
            )

                : 0;

        $scrapingMetrics = [

            'products_monitored' =>
                Product::query()
                    ->where('is_active', true)
                    ->count(),

            'price_checks' =>
                PriceHistory::query()->count(),

            'success_rate' =>
                $successRate,

            'last_successful_check' =>
                MonitoringJob::query()

                    ->where('status', 'completed')

                    ->latest('finished_at')

                    ->value('finished_at'),
        ];

        /*
        |--------------------------------------------------------------------------
        | System Health
        |--------------------------------------------------------------------------
        */

        $systemHealth = [

            'database' => $this->databaseHealth(),

            'redis' => $this->redisHealth(),

            'horizon' => $this->horizonHealth(),
        ];

        return Inertia::render(
            'metrics/Index',

            [

                'request_metrics' =>
                    $requestMetrics,

                'queue_metrics' =>
                    $queueMetrics,

                'scraping_metrics' =>
                    $scrapingMetrics,

                'system_health' =>
                    $systemHealth,
            ]
        );
    }

    private function databaseHealth(): string
    {
        try {

            DB::select('SELECT 1');

            return 'OK';

        } catch (\Throwable) {

            return 'ERROR';
        }
    }

    private function redisHealth(): string
    {
        try {

            Redis::ping();

            return 'OK';

        } catch (\Throwable) {

            return 'ERROR';
        }
    }

    private function horizonHealth(): string
    {
        try {

            Artisan::call('horizon:status');

            $output = Artisan::output();

            if (
                str_contains(
                    $output,
                    'Horizon is running'
                )
            ) {

                return 'OK';
            }

            return 'STOPPED';

        } catch (\Throwable) {

            return 'ERROR';
        }
    }
}
