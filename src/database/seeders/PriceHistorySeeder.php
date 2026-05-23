<?php

namespace Database\Seeders;

use App\Models\PriceHistory;
use Illuminate\Database\Seeder;

class PriceHistorySeeder extends Seeder
{
    public function run(): void
    {
        PriceHistory::factory(200)->create();
    }
}
