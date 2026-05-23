<script setup>
import Pagination from '@/components/Pagination.vue'
import StatCard from '@/components/StatCard.vue'
import CardGrid from "@/components/CardGrid.vue";

defineProps({
    jobs: Object,
    metrics: Object,
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
</script>

<template>

    <div class="space-y-6">

        <div>
            <h1 class="text-3xl font-bold text-gray-900">
                Filas
            </h1>

            <p class="text-gray-500 mt-1">
                Monitoramento de jobs e processamento assíncrono.
            </p>
        </div>

        <CardGrid :cols="5">

                <StatCard
                    title="Total Jobs"
                    :value="metrics.total_jobs"
                />

                <StatCard
                    title="Running"
                    :value="metrics.running_jobs"
                />

                <StatCard
                    title="Pending"
                    :value="metrics.pending_jobs"
                />

                <StatCard
                    title="Failed"
                    :value="metrics.failed_jobs"
                />

                <StatCard
                    title="Completed"
                    :value="metrics.completed_jobs"
                />
            </CardGrid>


            <div class="bg-white rounded-xl shadow overflow-hidden">

                <div class="p-6 border-b">
                    <h2 class="text-xl font-bold">
                        Monitoring Jobs
                    </h2>
                </div>

                <table class="w-full">

                    <thead class="bg-gray-100 border-b">

                    <tr>

                        <th class="text-left px-6 py-4">
                            ID
                        </th>

                        <th class="text-left px-6 py-4">
                            Produto
                        </th>

                        <th class="text-left px-6 py-4">
                            Status
                        </th>

                        <th class="text-left px-6 py-4">
                            Tentativas
                        </th>

                        <th class="text-left px-6 py-4">
                            Início
                        </th>

                        <th class="text-left px-6 py-4">
                            Fim
                        </th>

                        <th class="text-left px-6 py-4">
                            Erro
                        </th>

                    </tr>

                    </thead>

                    <tbody>

                    <tr
                        v-for="job in jobs.data"
                        :key="job.id"
                        class="border-b hover:bg-gray-50"
                    >

                        <td class="px-6 py-4">
                            #{{ job.id }}
                        </td>

                        <td class="px-6 py-4">
                            {{ job.product?.name || '-' }}
                        </td>

                        <td class="px-6 py-4">

                            <span
                                class="px-3 py-1 rounded-full text-sm"
                                :class="{

                                    'bg-yellow-100 text-yellow-700':
                                        job.status === 'running',

                                    'bg-red-100 text-red-700':
                                        job.status === 'failed',

                                    'bg-green-100 text-green-700':
                                        job.status === 'completed',

                                    'bg-gray-100 text-gray-700':
                                        job.status === 'pending',
                                }"
                            >
                                {{ job.status }}
                            </span>

                        </td>

                        <td class="px-6 py-4">
                            {{ job.attempts }}
                        </td>

                        <td class="px-6 py-4 text-gray-500">
                            {{ formatDate(job.started_at) }}
                        </td>

                        <td class="px-6 py-4 text-gray-500">
                            {{ formatDate(job.finished_at) }}
                        </td>

                        <td
                            class="px-6 py-4 text-sm text-red-500 max-w-xs truncate"
                        >
                            {{ job.error_message || '-' }}
                        </td>

                    </tr>

                    </tbody>

                </table>

            </div>

            <Pagination :links="jobs.links"/>

    </div>

</template>
