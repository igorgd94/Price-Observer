<script setup>
import StatCard from '@/components/StatCard.vue'
import Pagination from '@/components/Pagination.vue'

defineProps({
    metrics: Object,
    cache_metrics: Object,
})

function formatDate(date) {
    return new Date(date).toLocaleString('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
    })
}
</script>

<template>

    <div class="space-y-6">

        <div>
            <h1 class="text-3xl font-bold text-gray-900">
                Métricas
            </h1>

            <p class="text-gray-500 mt-1">
                Observabilidade e métricas do sistema.
            </p>
        </div>

        <div
            class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
        >

            <StatCard
                title="Total Requests"
                :value="metrics.total_requests"
            />

            <StatCard
                title="Tempo Médio"
                :value="`${metrics.avg_response_time}ms`"
            />

            <StatCard
                title="Cache Hit Rate"
                :value="`${metrics.cache_hit_rate}%`"
            />

            <StatCard
                title="Jobs Falhos"
                :value="metrics.failed_jobs"
            />

        </div>

        <div class="bg-white rounded-xl shadow overflow-hidden">

            <div class="p-6 border-b">
                <h2 class="text-xl font-bold">
                    Cache Metrics
                </h2>
            </div>

            <table class="w-full">

                <thead class="bg-gray-100 border-b">

                <tr>

                    <th class="text-left px-6 py-4">
                        Key
                    </th>

                    <th class="text-left px-6 py-4">
                        Hits
                    </th>

                    <th class="text-left px-6 py-4">
                        Misses
                    </th>

                    <th class="text-left px-6 py-4">
                        Último Hit
                    </th>

                </tr>

                </thead>

                <tbody>

                <tr
                    v-for="metric in cache_metrics.data"
                    :key="metric.id"
                    class="border-b hover:bg-gray-50"
                >

                    <td class="px-6 py-4">
                        {{ metric.key_name }}
                    </td>

                    <td class="px-6 py-4">
                        {{ metric.hits }}
                    </td>

                    <td class="px-6 py-4">
                        {{ metric.misses }}
                    </td>

                    <td class="px-6 py-4 text-gray-500">
                        {{ formatDate(metric.last_hit_at) }}
                    </td>

                </tr>

                </tbody>

            </table>

        </div>

        <Pagination :links="cache_metrics.links" />

    </div>

</template>
