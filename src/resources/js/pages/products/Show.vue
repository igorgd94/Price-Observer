<script setup>
import { Link, router } from '@inertiajs/vue3'

defineProps({
    product: Object,
})

function formatDate(date) {
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(date))
}

function destroyProduct(id) {

    if (!confirm('Deseja realmente excluir este produto?')) {
        return
    }

    router.delete(`/products/${id}`)
}
</script>

<template>

    <div class="space-y-6">

        <div class="flex items-center justify-between">

            <div>

                <h1 class="text-3xl font-bold">
                    {{ product.name }}
                </h1>

                <p class="text-gray-500">
                    {{ product.source }}
                </p>

            </div>

            <div class="flex gap-3">

            <Link
                :href="`/products/${product.id}/edit`"
                class="bg-gray-900 text-white px-4 py-2 rounded-lg"
            >
                Editar
            </Link>

                <button
                    class="bg-red-600 text-white px-4 py-2 rounded-lg"
                    @click="destroyProduct(product.id)"
                >
                    Excluir
                </button>

            </div>

        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div class="bg-white rounded-xl shadow p-6">

                <p class="text-sm text-gray-500 mb-2">
                    Preço Atual
                </p>

                <p class="text-2xl font-bold">
                    R$ {{ product.current_price ?? '--' }}
                </p>

            </div>

            <div class="bg-white rounded-xl shadow p-6">

                <p class="text-sm text-gray-500 mb-2">
                    Preço Alvo
                </p>

                <p class="text-2xl font-bold">
                    R$ {{ product.target_price }}
                </p>

            </div>

            <div class="bg-white rounded-xl shadow p-6">

                <p class="text-sm text-gray-500 mb-2">
                    Última Verificação
                </p>

                <p class="text-lg">
                    {{ formatDate(product.last_checked_at) ?? '--' }}
                </p>

            </div>

        </div>

        <div class="bg-white rounded-xl shadow p-6">

            <h2 class="text-xl font-semibold mb-4">
                Histórico de preços
            </h2>

            <table class="w-full text-left">

                <thead>

                <tr class="border-b">

                    <th class="py-3">
                        Data
                    </th>

                    <th class="py-3">
                        Preço
                    </th>

                </tr>

                </thead>

                <tbody>

                <tr
                    v-for="history in product.price_histories"
                    :key="history.id"
                    class="border-b"
                >

                    <td class="py-3">
                        {{ formatDate(history.captured_at) }}
                    </td>

                    <td class="py-3">
                        R$ {{ history.price }}
                    </td>

                </tr>

                </tbody>

            </table>

        </div>

    </div>

</template>
