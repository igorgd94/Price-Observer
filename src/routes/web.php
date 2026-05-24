<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{
    CacheController,
    DashboardController,
    JobController,
    MetricsController,
    ProductController,
    PrometheusMetricsController,
};

Route::get(
    '/metrics/prometheus',
    [PrometheusMetricsController::class, 'index']
);

Route::get('/cache', [CacheController::class, 'index'])
    ->name('cache.index');

Route::get('/jobs', [JobController::class, 'index'])
    ->name('jobs.index');

Route::get('/metrics', [MetricsController::class, 'index'])
    ->name('metrics.index');

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->name('dashboard');


Route::prefix('products')
    ->controller(ProductController::class)
    ->group(function () {

        Route::get('/', 'index')
            ->name('products.index');

        Route::get('/create', 'create')
            ->name('products.create');

        Route::post('/', 'store')
            ->name('products.store');

        Route::get('/{product}', 'show')
            ->name('products.show');

        Route::get('/{product}/edit', 'edit')
            ->name('products.edit');

        Route::put('/{product}', 'update')
            ->name('products.update');

        Route::delete('/{product}', 'destroy')
            ->name('products.destroy');
    });

require __DIR__.'/settings.php';
