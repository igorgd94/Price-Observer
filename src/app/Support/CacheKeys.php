<?php

namespace App\Support;

class CacheKeys
{
    /*
    |--------------------------------------------------------------------------
    | Cache Payloads
    |--------------------------------------------------------------------------
    */

    public static function productsPagePattern(): string
    {
        return 'products.page.*';
    }

    /*
    |--------------------------------------------------------------------------
    | Global Metrics
    |--------------------------------------------------------------------------
    */

    public static function totalHits(): string
    {
        return 'metrics.cache.hits';
    }

    public static function totalMisses(): string
    {
        return 'metrics.cache.misses';
    }

    public static function lastHitAt(): string
    {
        return 'metrics.cache.last_hit_at';
    }

    /*
    |--------------------------------------------------------------------------
    | Per-Key Metrics
    |--------------------------------------------------------------------------
    */

    public static function keyHits(
        string $cacheKey
    ): string {

        return sprintf(
            'metrics.cache.keys.%s.hits',
            $cacheKey
        );
    }

    public static function keyMisses(
        string $cacheKey
    ): string {

        return sprintf(
            'metrics.cache.keys.%s.misses',
            $cacheKey
        );
    }

    public static function keyLastHitAt(
        string $cacheKey
    ): string {

        return sprintf(
            'metrics.cache.keys.%s.last_hit_at',
            $cacheKey
        );
    }
}
