<?php

namespace App\Http\Controllers;

use App\Models\MonitoringJob;
use App\Models\PriceHistory;
use App\Models\Product;
use App\Services\CacheMetricsService;
use App\Services\RequestMetricsService;
use Illuminate\Http\Response;

class PrometheusMetricsController extends Controller
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
        | Cache Metrics
        |--------------------------------------------------------------------------
        */

        $cacheMetrics =
            CacheMetricsService::stats();

        /*
        |--------------------------------------------------------------------------
        | Scraping Metrics
        |--------------------------------------------------------------------------
        */

        $productsMonitored =
            Product::query()
                ->where('is_active', true)
                ->count();

        $priceChecks =
            PriceHistory::query()->count();

        $completedJobs =
            MonitoringJob::query()
                ->where('status', 'completed')
                ->count();

        $failedJobs =
            MonitoringJob::query()
                ->where('status', 'failed')
                ->count();

        /*
        |--------------------------------------------------------------------------
        | Prometheus Output
        |--------------------------------------------------------------------------
        */

        $metrics = [];

        /*
        |--------------------------------------------------------------------------
        | Requests
        |--------------------------------------------------------------------------
        */

        $metrics[] =
            '# HELP app_requests_total Total application requests';

        $metrics[] =
            '# TYPE app_requests_total counter';

        $metrics[] =
            "app_requests_total {$requestMetrics['total_requests']}";

        $metrics[] =
            '# HELP app_avg_response_time Average response time in milliseconds';

        $metrics[] =
            '# TYPE app_avg_response_time gauge';

        $metrics[] =
            "app_avg_response_time {$requestMetrics['avg_response_time']}";

        $metrics[] =
            '# HELP app_slow_requests_total Total slow requests';

        $metrics[] =
            '# TYPE app_slow_requests_total counter';

        $metrics[] =
            "app_slow_requests_total {$requestMetrics['slow_requests']}";

        /*
        |--------------------------------------------------------------------------
        | Cache
        |--------------------------------------------------------------------------
        */

        $metrics[] =
            '# HELP app_cache_hits_total Total cache hits';

        $metrics[] =
            '# TYPE app_cache_hits_total counter';

        $metrics[] =
            "app_cache_hits_total {$cacheMetrics['hits']}";

        $metrics[] =
            '# HELP app_cache_misses_total Total cache misses';

        $metrics[] =
            '# TYPE app_cache_misses_total counter';

        $metrics[] =
            "app_cache_misses_total {$cacheMetrics['misses']}";

        $metrics[] =
            '# HELP app_cache_hit_rate Cache hit rate percentage';

        $metrics[] =
            '# TYPE app_cache_hit_rate gauge';

        $metrics[] =
            "app_cache_hit_rate {$cacheMetrics['hit_rate']}";

        /*
        |--------------------------------------------------------------------------
        | Scraping
        |--------------------------------------------------------------------------
        */

        $metrics[] =
            '# HELP app_products_monitored Total monitored products';

        $metrics[] =
            '# TYPE app_products_monitored gauge';

        $metrics[] =
            "app_products_monitored {$productsMonitored}";

        $metrics[] =
            '# HELP app_price_checks_total Total price checks';

        $metrics[] =
            '# TYPE app_price_checks_total counter';

        $metrics[] =
            "app_price_checks_total {$priceChecks}";

        /*
        |--------------------------------------------------------------------------
        | Jobs
        |--------------------------------------------------------------------------
        */

        $metrics[] =
            '# HELP app_jobs_completed_total Total completed jobs';

        $metrics[] =
            '# TYPE app_jobs_completed_total counter';

        $metrics[] =
            "app_jobs_completed_total {$completedJobs}";

        $metrics[] =
            '# HELP app_jobs_failed_total Total failed jobs';

        $metrics[] =
            '# TYPE app_jobs_failed_total counter';

        $metrics[] =
            "app_jobs_failed_total {$failedJobs}";

        return response(

            implode("\n", $metrics),

            200,

            [
                'Content-Type' =>
                    'text/plain; version=0.0.4',
            ]
        );
    }
}
