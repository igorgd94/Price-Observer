<script setup>

import CardGrid from '@/components/CardGrid.vue'
import StatCard from '@/components/StatCard.vue'

defineProps({

    request_metrics: Object,

    queue_metrics: Object,

    scraping_metrics: Object,

    system_health: Object,
})

function formatDate(date) {

    if (!date) {
        return '-'
    }

    return new Date(date).toLocaleString(
        'pt-BR',
        {
            dateStyle: 'short',
            timeStyle: 'short',
        }
    )
}
</script>
<template>

    <div class="space-y-8">

        <div>

            <h1 class="text-3xl font-bold">
                Metrics
            </h1>

            <p class="text-gray-500 mt-1">
                Runtime metrics and system observability.
            </p>

        </div>

        <!-- Request Metrics -->

        <section class="space-y-4">

            <h2 class="text-xl font-bold">
                Request Metrics
            </h2>

            <CardGrid :cols="4">

                <StatCard
                    title="Total Requests"
                    :value="
                    request_metrics.total_requests
                "
                />

                <StatCard
                    title="Avg Response Time"
                    :value="
                    `${request_metrics.avg_response_time}ms`
                "
                />

                <StatCard
                    title="Slow Requests"
                    :value="
                    request_metrics.slow_requests
                "
                />

                <StatCard
                    title="Last Request"
                    :value="
                    formatDate(
                        request_metrics.last_request_at
                    )
                "
                />

            </CardGrid>

        </section>

        <!-- Queue Metrics -->

        <section class="space-y-4">

            <h2 class="text-xl font-bold">
                Queue Metrics
            </h2>

            <CardGrid :cols="3">

                <StatCard
                    title="Completed Jobs"
                    :value="
                    queue_metrics.completed_jobs
                "
                />

                <StatCard
                    title="Failed Jobs"
                    :value="
                    queue_metrics.failed_jobs
                "
                />

                <StatCard
                    title="Failed Monitoring Jobs"
                    :value="
                    queue_metrics.failed_monitoring_jobs
                "
                />

            </CardGrid>

        </section>

        <!-- Scraping Metrics -->

        <section class="space-y-4">

            <h2 class="text-xl font-bold">
                Scraping Metrics
            </h2>

            <CardGrid :cols="4">

                <StatCard
                    title="Products Monitored"
                    :value="
                    scraping_metrics.products_monitored
                "
                />

                <StatCard
                    title="Price Checks"
                    :value="
                    scraping_metrics.price_checks
                "
                />

                <StatCard
                    title="Success Rate"
                    :value="
                    `${scraping_metrics.success_rate}%`
                "
                />

                <StatCard
                    title="Last Successful Check"
                    :value="
                    formatDate(
                        scraping_metrics.last_successful_check
                    )
                "
                />

            </CardGrid>

        </section>

        <!-- System Health -->

        <section class="space-y-4">

            <h2 class="text-xl font-bold">
                System Health
            </h2>

            <div
                class="
                bg-white
                rounded-xl
                shadow
                overflow-hidden
            "
            >

                <table class="w-full">

                    <thead
                        class="
                        bg-gray-100
                        border-b
                    "
                    >

                    <tr>

                        <th class="px-6 py-4 text-left">
                            Service
                        </th>

                        <th class="px-6 py-4 text-left">
                            Status
                        </th>

                    </tr>

                    </thead>

                    <tbody>

                    <tr class="border-b">

                        <td class="px-6 py-4">
                            PostgreSQL
                        </td>

                        <td class="px-6 py-4">
                            {{ system_health.database }}
                        </td>

                    </tr>

                    <tr class="border-b">

                        <td class="px-6 py-4">
                            Redis
                        </td>

                        <td class="px-6 py-4">
                            {{ system_health.redis }}
                        </td>

                    </tr>

                    <tr>

                        <td class="px-6 py-4">
                            Horizon
                        </td>

                        <td class="px-6 py-4">
                            {{ system_health.horizon }}
                        </td>

                    </tr>

                    </tbody>

                </table>

            </div>

        </section>

    </div>

</template>
