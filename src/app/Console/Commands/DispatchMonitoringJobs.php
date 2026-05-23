<?php

namespace App\Console\Commands;

use App\Jobs\MonitorProductJob;
use App\Models\Product;
use Illuminate\Console\Command;

class DispatchMonitoringJobs extends Command
{
    protected $signature = 'monitor:dispatch';

    protected $description = 'Dispatch monitoring jobs';

    public function handle(): void
    {
        Product::query()
            ->where('is_active', true)
            ->where(function ($query) {

                $query->whereNull('last_checked_at')

                    ->orWhere(
                        'last_checked_at',
                        '<=',
                        now()->subHours(12)
                    );
            })
            ->each(function (Product $product) {

                MonitorProductJob::dispatch($product);
            });

        $this->info('Monitoring jobs dispatched.');
    }
}
