<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

class RequestMetricsMiddleware
{
    public function handle(
        Request $request,
        Closure $next
    ): Response {
        if (
            $request->is('build/*')
            || $request->is('favicon.ico')
        ) {

            return $next($request);
        }

        $start = microtime(true);

        $response = $next($request);

        /*
        |--------------------------------------------------------------------------
        | Duration
        |--------------------------------------------------------------------------
        */

        $duration = round(
            (microtime(true) - $start) * 1000,
            2
        );

        /*
        |--------------------------------------------------------------------------
        | Global Metrics
        |--------------------------------------------------------------------------
        */

        Cache::increment(
            'metrics.requests.total'
        );

        Cache::increment(
            'metrics.requests.duration_total',
            (int) $duration
        );

        Cache::put(
            'metrics.requests.last_duration',
            $duration
        );

        Cache::put(
            'metrics.requests.last_request_at',
            now()->toDateTimeString()
        );

        /*
        |--------------------------------------------------------------------------
        | Slow Requests
        |--------------------------------------------------------------------------
        */

        if ($duration > 1000) {

            Cache::increment(
                'metrics.requests.slow'
            );
        }

        return $response;
    }
}
