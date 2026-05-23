<?php

namespace Database\Seeders;

use App\Models\MonitoringJob;
use Illuminate\Database\Seeder;

class MonitoringJobSeeder extends Seeder
{
    public function run(): void
    {
        MonitoringJob::factory(50)->create();
    }
}
