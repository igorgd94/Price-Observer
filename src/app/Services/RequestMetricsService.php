<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;

class RequestMetricsService
{
    public static function stats(): array
    {
        $totalRequests = (int) Cache::get(
            'metrics.requests.total',
            0
        );

        $totalDuration = (int) Cache::get(
            'metrics.requests.duration_total',
            0
        );

        $avgResponseTime =
            $totalRequests > 0

                ? round(
                $totalDuration / $totalRequests,
                2
            )

                : 0;

        return [

            'total_requests' => $totalRequests,

            'avg_response_time' =>
                $avgResponseTime,

            'slow_requests' => (int) Cache::get(
                'metrics.requests.slow',
                0
            ),

            'last_request_at' => Cache::get(
                'metrics.requests.last_request_at'
            ),

            'last_duration' => Cache::get(
                'metrics.requests.last_duration'
            ),
        ];
    }
}
