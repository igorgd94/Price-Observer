<?php

namespace App\Http\Controllers;

use App\Models\MonitoringJob;
use Inertia\Inertia;
use Inertia\Response;

class JobController extends Controller
{
    public function index(): Response
    {
        $jobs = MonitoringJob::query()
            ->with('product')
            ->latest()
            ->paginate(10)
            ->withQueryString();

        $metrics = [

            'total_jobs' => MonitoringJob::count(),

            'running_jobs' => MonitoringJob::query()
                ->where('status', 'running')
                ->count(),

            'failed_jobs' => MonitoringJob::query()
                ->where('status', 'failed')
                ->count(),

            'completed_jobs' => MonitoringJob::query()
                ->where('status', 'completed')
                ->count(),

            'pending_jobs' => MonitoringJob::query()
                ->where('status', 'pending')
                ->count(),
        ];

        return Inertia::render('jobs/Index', [
            'jobs' => $jobs,
            'metrics' => $metrics,
        ]);
    }
}
