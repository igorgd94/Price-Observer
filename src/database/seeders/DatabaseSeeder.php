<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
//            ProductSeeder::class,
//            MonitoringJobSeeder::class,
            CacheMetricSeeder::class,
//            PriceHistorySeeder::class,
        ]);
    }
}
