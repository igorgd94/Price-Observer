<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('cache_metrics', function (Blueprint $table) {
            $table->id();

            $table->string('key_name');

            $table->integer('hits')->default(0);

            $table->integer('misses')->default(0);

            $table->timestamp('last_hit_at')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cache_metrics');
    }
};
