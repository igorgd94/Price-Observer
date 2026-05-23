<?php

namespace Database\Seeders;

use App\Models\CacheMetric;
use Illuminate\Database\Seeder;

class CacheMetricSeeder extends Seeder
{
    public function run(): void
    {
        CacheMetric::factory(10)->create();
    }
}
