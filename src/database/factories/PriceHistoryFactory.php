<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class PriceHistoryFactory extends Factory
{
    public function definition(): array
    {
        return [
            'product_id' => Product::inRandomOrder()->first()?->id,

            'price' => fake()->randomFloat(2, 100, 5000),

            'captured_at' => fake()->dateTimeBetween('-30 days'),
        ];
    }
}
