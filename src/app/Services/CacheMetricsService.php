<?php

namespace App\Services;

use App\Support\CacheKeys;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Str;

class CacheMetricsService
{
    public static function stats(): array
    {
        $hits = (int) Cache::get(
            CacheKeys::totalHits(),
            0
        );

        $misses = (int) Cache::get(
            CacheKeys::totalMisses(),
            0
        );

        $total = $hits + $misses;

        $hitRate = $total > 0
            ? round(($hits / $total) * 100, 2)
            : 0;

        return [

            'hits' => $hits,

            'misses' => $misses,

            'total' => $total,

            'hit_rate' => $hitRate,

            'total_keys' => count(
                self::redisKeys()
            ),

            'last_hit_at' => Cache::get(
                CacheKeys::lastHitAt()
            ),
        ];
    }

    public static function keys(): array
    {
        return collect(self::redisKeys())

            ->map(function ($key) {

                /*
                |--------------------------------------------------------------------------
                | Human Readable Key
                |--------------------------------------------------------------------------
                */

                $readableKey = Str::replaceFirst(
                    self::cachePrefix(),
                    '',
                    $key
                );

                /*
                |--------------------------------------------------------------------------
                | Metrics
                |--------------------------------------------------------------------------
                */

                $hits = (int) Cache::get(
                    CacheKeys::keyHits(
                        $readableKey
                    ),
                    0
                );

                $misses = (int) Cache::get(
                    CacheKeys::keyMisses(
                        $readableKey
                    ),
                    0
                );

                $total = $hits + $misses;

                $hitRate = $total > 0
                    ? round(
                        ($hits / $total) * 100,
                        2
                    )
                    : 0;

                /*
                |--------------------------------------------------------------------------
                | TTL
                |--------------------------------------------------------------------------
                */

                $ttl = Redis::connection('cache')
                    ->ttl($key);

                return [

                    'key' => $readableKey,

                    'hits' => $hits,

                    'misses' => $misses,

                    'total' => $total,

                    'hit_rate' => $hitRate,

                    'ttl' => $ttl,

                    'last_hit_at' => Cache::get(
                        CacheKeys::keyLastHitAt(
                            $readableKey
                        )
                    ),
                ];
            })

            ->sortByDesc('hits')

            ->values()

            ->toArray();
    }

    /*
    |--------------------------------------------------------------------------
    | Redis Keys
    |--------------------------------------------------------------------------
    */

    private static function redisKeys(): array
    {
        $redis = Redis::connection('cache');

        $prefix = self::cachePrefix();

        $cursor = null;

        $keys = [];
        do {

            $result = $redis->scan(
                $cursor,
                [
                    'match' =>
                        "{$prefix}"
                        . CacheKeys::productsPagePattern(),

                    'count' => 100,
                ]
            );

            if ($result === false) {
                break;
            }

            $cursor = $result[0];

            $foundKeys = $result[1];

            $keys = array_merge(
                $keys,
                $foundKeys
            );

        } while ($cursor != 0);
//        dd($keys);
        return array_unique($keys);
    }

    private static function cachePrefix(): string
    {
        return
            config('database.redis.options.prefix')
            . config('cache.prefix');
    }
}
