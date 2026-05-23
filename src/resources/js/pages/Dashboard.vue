<script setup>
import StatCard from '@/components/StatCard.vue'
import CardGrid from "@/components/CardGrid.vue";

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
