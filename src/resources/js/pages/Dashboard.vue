<script setup>
import StatCard from '@/components/StatCard.vue'
import CardGrid from "@/components/CardGrid.vue";
import JobsActivityChart
    from '@/components/charts/JobsActivityChart.vue'

defineProps({
    metrics: Object,
    recent_products: Array,
})

function formatDate(date) {
    return new Date(date).toLocaleString('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
    })
}
</script>

<template>
    <CardGrid :cols="4">

        <StatCard
            title="Produtos Monitorados"
            :value="metrics.products_count"
        />

        <StatCard
            title="Jobs Processados"
            :value="metrics.jobs_processed"
        />

        <StatCard
            title="Cache Hit Rate"
            :value="`${metrics.cache_hit_rate}%`"
        />

        <StatCard
            title="Tempo Médio"
            :value="`${metrics.avg_response_time}ms`"
        />

    </CardGrid>

    <div class="
        grid
        mt-6
        grid-cols-1
        lg:grid-cols-3
        gap-6
        items-stretch
    ">

        <div
            class="
        bg-gray-50
        rounded-xl
        p-8
        flex
        flex-col
        justify-center
        h-full
    "
        >

            <p class="text-sm text-gray-500 mb-2">
                Success Rate
            </p>

            <p class="text-5xl font-bold">

                {{
                    Math.round(
                        (
                            metrics.completed_jobs
                            / metrics.jobs_processed
                        ) * 100
                    )
                }}%

            </p>

            <div class="mt-6 space-y-3">

                <div class="flex items-center justify-between">

                <span class="text-gray-500">
                    Completed
                </span>

                    <span
                        class="font-semibold text-green-600"
                    >
                    {{ metrics.completed_jobs }}
                </span>

                </div>

                <div class="flex items-center justify-between">

                <span class="text-gray-500">
                    Failed
                </span>

                    <span
                        class="font-semibold text-red-600"
                    >
                    {{ metrics.failed_jobs }}
                </span>

                </div>

                <div class="flex items-center justify-between">

                <span class="text-gray-500">
                    Total
                </span>

                    <span class="font-semibold">
                    {{ metrics.jobs_processed }}
                </span>

                </div>

            </div>

        </div>

        <div class="
        lg:col-span-2
        flex
        items-center
    ">

            <JobsActivityChart

                :completed="metrics.completed_jobs"

                :failed="metrics.failed_jobs"
            />

        </div>

    </div>

        <div class="bg-white rounded-xl shadow mt-6 p-6">
            <h2 class="text-xl font-bold mb-4">
                Atividade recente
            </h2>

            <div class="space-y-4">

                <div
                    v-for="product in recent_products"
                    :key="product.id"
                    class="flex items-center justify-between border-b pb-3"
                >

                    <div>

                        <p class="font-medium text-gray-900">
                            {{ product.name }}
                        </p>

                        <p class="text-sm text-gray-500">
                            {{ product.source }}
                        </p>

                    </div>

                    <div class="text-right">

                        <p class="font-semibold">
                            R$ {{ product.current_price }}
                        </p>

                        <p class="text-sm text-gray-500">
                            {{ formatDate(product.last_checked_at) }}
                        </p>

                    </div>

                </div>

            </div>
            <div v-if="recent_products.length === 0">
                Nenhuma atividade nas últimas 24 horas.
            </div>
        </div>
</template>
