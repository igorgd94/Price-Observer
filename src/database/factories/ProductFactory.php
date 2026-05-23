<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::inRandomOrder()->first()?->id,

            'name' => fake()->words(3, true),

            'source' => fake()->randomElement([
                'Amazon',
                'Kabum',
                'Pichau',
                'Terabyte',
            ]),

            'url' => fake()->url(),

            'current_price' => fake()->randomFloat(2, 100, 5000),

            'target_price' => fake()->randomFloat(2, 100, 3000),

            'is_active' => true,

            'last_checked_at' => now(),
        ];
    }
}
