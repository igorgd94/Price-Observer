<?php

namespace App\Jobs;

use App\Models\MonitoringJob;
use App\Models\PriceHistory;
use App\Models\Product;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class MonitorProductJob implements ShouldQueue
{
    public int $tries = 3;
    public int $timeout = 30;

    use Queueable;

    public function __construct(
        public Product $product
    ) {
    }

    public function handle(): void
    {
        $monitoringJob = MonitoringJob::create([
            'product_id' => $this->product->id,
            'status' => 'running',
            'attempts' => 1,
            'started_at' => now(),
        ]);

        try {

            // Simula scraping...
            sleep(2);

            if (rand(1, 100) <= 20) {
                throw new \Exception('Falha simulada no scraping.');
            }

            $basePrice = $this->product->current_price
                ?? $this->product->target_price;

            if (!$this->product->current_price) {

                $variationPercent = rand(-30, 30);

            } else {

                $variationPercent = rand(-10, 10);
            }

            $variationValue = (
                    $basePrice * $variationPercent
                ) / 100;

            $fakePrice = round(
                $basePrice + $variationValue,
                2
            );

            // Evita negativo...
            $fakePrice = max(2, $fakePrice);


            $this->product->current_price = $fakePrice;
            $this->product->last_checked_at = now();

            $priceChanged = $this->product->isDirty('current_price');

            $this->product->save();

            if ($priceChanged) {

                PriceHistory::forceCreate([
                    'product_id' => $this->product->id,
                    'price' => $fakePrice,
                    'captured_at' => now(),
                ]);

//                $this->product->priceHistories()->create([
//                    'price' => $fakePrice,
//                    'captured_at' => now(),
//                ]);
            }

            $monitoringJob->update([
                'status' => 'completed',
                'finished_at' => now(),
            ]);

        } catch (\Throwable $e) {

            $monitoringJob->update([
                'status' => 'failed',
                'attempts' => $this->attempts(),
                'error_message' => $e->getMessage(),
                'finished_at' => now(),
            ]);

            throw $e;
        }
    }
}
