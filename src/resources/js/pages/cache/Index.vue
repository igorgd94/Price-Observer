<script setup>
import StatCard from '@/components/StatCard.vue'
import CardGrid from '@/components/CardGrid.vue'

defineProps({
    metrics: Object,
    cache_metrics: Array,
})

function formatDate(date) {

    if (!date) {
        return '-'
    }

    return new Date(date).toLocaleString('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
    })
}

function calculateHitRate(metric) {

    const total = metric.hits + metric.misses

    if (total === 0) {
        return '0%'
    }

    return `${Math.round((metric.hits / total) * 100)}%`
}

function formatTTL(ttl) {

    if (ttl === null || ttl < 0) {
        return '-'
    }

    const minutes = Math.floor(ttl / 60)

    const seconds = ttl % 60

    if (minutes <= 0) {
        return `${seconds}s`
    }

    return `${minutes}m ${seconds}s`
}
</script>

<template>

    <div class="space-y-6">

        <div>

            <h1 class="text-3xl font-bold text-gray-900">
                Cache
            </h1>

            <p class="text-gray-500 mt-1">
                Métricas e eficiência de cache do sistema.
            </p>

        </div>

        <CardGrid :cols="5">

            <StatCard
                title="Total Hits"
                :value="metrics.total_hits"
            />

            <StatCard
                title="Total Misses"
                :value="metrics.total_misses"
            />

            <StatCard
                title="Hit Rate"
                :value="`${metrics.hit_rate}%`"
            />

            <StatCard
                title="Keys"
                :value="metrics.keys_count"
            />

            <StatCard
                title="Último Hit"
                :value="
                    metrics.last_hit_at
                        ? formatDate(metrics.last_hit_at)
                        : '-'
                "
            />

        </CardGrid>

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
                        Hit Rate
                    </th>

                    <th class="text-left px-6 py-4">
                        TTL
                    </th>

                    <th class="text-left px-6 py-4">
                        Último Hit
                    </th>

                </tr>

                </thead>

                <tbody>

                <tr
                    v-for="metric in cache_metrics"
                    :key="metric.key"
                    class="border-b hover:bg-gray-50"
                >

                    <td class="px-6 py-4 font-medium text-sm">
                        {{ metric.key }}
                    </td>

                    <td class="px-6 py-4">
                        {{ metric.hits }}
                    </td>

                    <td class="px-6 py-4">
                        {{ metric.misses }}
                    </td>

                    <td class="px-6 py-4">

                        <span
                            class="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700"
                        >
                            {{ calculateHitRate(metric) }}
                        </span>

                    </td>

                    <td class="px-6 py-4 text-gray-500">
                        {{ formatTTL(metric.ttl) }}
                    </td>

                    <td class="px-6 py-4 text-gray-500">
                        {{ formatDate(metric.last_hit_at) }}
                    </td>

                </tr>

                </tbody>

            </table>

        </div>

    </div>

</template>
