<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class CacheMetricFactory extends Factory
{
    public function definition(): array
    {
        return [
            'key_name' => fake()->word(),

            'hits' => fake()->numberBetween(0, 1000),

            'misses' => fake()->numberBetween(0, 100),

            'last_hit_at' => now(),
        ];
    }
}
