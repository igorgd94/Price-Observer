<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class MonitoringJobFactory extends Factory
{
    public function definition(): array
    {
        return [
            'product_id' => Product::inRandomOrder()->first()?->id,

            'status' => fake()->randomElement([
                'pending',
                'running',
                'completed',
                'failed',
            ]),

            'attempts' => fake()->numberBetween(0, 5),

            'error_message' => fake()->optional()->sentence(),

            'started_at' => now(),

            'finished_at' => fake()->optional()->dateTimeBetween('-1 hour'),
        ];
    }
}
