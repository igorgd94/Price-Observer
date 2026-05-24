<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [

            [
                'name' => 'A Light in the Attic',

                'url' =>
                    'https://books.toscrape.com/catalogue/a-light-in-the-attic_1000/index.html',

                'source' => 'Books to Scrape',

                'target_price' => 35.00,

                'current_price' => 51.77,
            ],

            [
                'name' => 'Tipping the Velvet',

                'url' =>
                    'https://books.toscrape.com/catalogue/tipping-the-velvet_999/index.html',

                'source' => 'Books to Scrape',

                'target_price' => 40.00,

                'current_price' => 53.74,
            ],

            [
                'name' => 'Soumission',

                'url' =>
                    'https://books.toscrape.com/catalogue/soumission_998/index.html',

                'source' => 'Books to Scrape',

                'target_price' => 30.00,

                'current_price' => 50.10,
            ],

            [
                'name' => 'Sharp Objects',

                'url' =>
                    'https://books.toscrape.com/catalogue/sharp-objects_997/index.html',

                'source' => 'Books to Scrape',

                'target_price' => 45.00,

                'current_price' => 47.82,
            ],

            [
                'name' => 'Sapiens: A Brief History of Humankind',

                'url' =>
                    'https://books.toscrape.com/catalogue/sapiens-a-brief-history-of-humankind_996/index.html',

                'source' => 'Books to Scrape',

                'target_price' => 55.00,

                'current_price' => 54.23,
            ],

            [
                'name' => 'The Requiem Red',

                'url' =>
                    'https://books.toscrape.com/catalogue/the-requiem-red_995/index.html',

                'source' => 'Books to Scrape',

                'target_price' => 20.00,

                'current_price' => 22.65,
            ],

            [
                'name' => 'The Dirty Little Secrets of Getting Your Dream Job',

                'url' =>
                    'https://books.toscrape.com/catalogue/the-dirty-little-secrets-of-getting-your-dream-job_994/index.html',

                'source' => 'Books to Scrape',

                'target_price' => 25.00,

                'current_price' => 33.34,
            ],

            [
                'name' => 'The Coming Woman',

                'url' =>
                    'https://books.toscrape.com/catalogue/the-coming-woman-a-novel-based-on-the-life-of-the-infamous-feminist-victoria-woodhull_993/index.html',

                'source' => 'Books to Scrape',

                'target_price' => 15.00,

                'current_price' => 17.93,
            ],

            [
                'name' => 'The Boys in the Boat',

                'url' =>
                    'https://books.toscrape.com/catalogue/the-boys-in-the-boat-nine-americans-and-their-epic-quest-for-gold-at-the-1936-berlin-olympics_992/index.html',

                'source' => 'Books to Scrape',

                'target_price' => 50.00,

                'current_price' => 57.11,
            ],

            [
                'name' => 'The Black Maria',

                'url' =>
                    'https://books.toscrape.com/catalogue/the-black-maria_991/index.html',

                'source' => 'Books to Scrape',

                'target_price' => 45.00,

                'current_price' => 52.15,
            ],
        ];

        foreach ($products as $data) {

            $product = Product::query()->create([

                ...$data,

                'last_checked_at' => now(),
            ]);

            /*
            |--------------------------------------------------------------------------
            | Price Histories
            |--------------------------------------------------------------------------
            */

            $basePrice = $product->current_price;

            for ($i = 15; $i >= 1; $i--) {

                $variation = rand(-700, 700) / 100;

                $price = max(
                    10,
                    $basePrice + $variation
                );

                $product->priceHistories()->create([

                    'price' => round($price, 2),

                    'captured_at' => now()->subDays($i),
                ]);
            }

            /*
            |--------------------------------------------------------------------------
            | Monitoring Jobs
            |--------------------------------------------------------------------------
            */

            for ($i = 10; $i >= 1; $i--) {

                $success = rand(1, 100) > 20;

                $product->monitoringJobs()->create([

                    'status' => $success
                        ? 'completed'
                        : 'failed',

                    'started_at' =>
                        now()->subHours($i),

                    'finished_at' =>
                        now()->subHours($i)->addSeconds(
                            rand(2, 15)
                        ),

                    'created_at' =>
                        now()->subHours($i),

                    'updated_at' =>
                        now()->subHours($i),
                ]);
            }
        }
    }
}
