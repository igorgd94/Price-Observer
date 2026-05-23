<script setup>
import { Link } from '@inertiajs/vue3'

defineProps({
    products: Array,
})

function formatDate(date) {
    if(!date) return '';
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(date))
}
</script>

<template>
    <div class="bg-white rounded-xl shadow overflow-hidden">

        <table class="w-full">

            <thead class="bg-gray-100 border-b">
            <tr>

                <th class="text-left px-6 py-4">
                    Produto
                </th>

                <th class="text-left px-6 py-4">
                    Loja
                </th>

                <th class="text-left px-6 py-4">
                    Preço Atual
                </th>

                <th class="text-left px-6 py-4">
                    Preço Alvo
                </th>

                <th class="text-left px-6 py-4">
                    Status
                </th>

                <th class="text-left px-6 py-4">
                    Última Verificação
                </th>

            </tr>
            </thead>

            <tbody>

            <tr
                v-for="product in products"
                :key="product.id"
                class="border-b hover:bg-gray-50"
            >

                <td class="px-6 py-4 font-medium">
                    <Link
                        :href="`/products/${product.id}`"
                        class="text-blue-600 hover:underline"
                    >
                        {{ product.name }}
                    </Link>
                </td>

                <td class="px-6 py-4">
                    {{ product.source }}
                </td>

                <td class="px-6 py-4">
                    R$ {{ product.current_price }}
                </td>

                <td class="px-6 py-4">
                    R$ {{ product.target_price }}
                </td>

                <td class="px-6 py-4">

                        <span
                            class="px-3 py-1 rounded-full text-sm"
                            :class="{
                                'bg-green-100 text-green-700':
                                    product.is_active,

                                'bg-yellow-100 text-yellow-700':
                                    !product.is_active,
                            }"
                        >
                            {{ product.is_active ? 'Ativo' : 'Pausado' }}
                        </span>

                </td>

                <td class="px-6 py-4 text-gray-500">
                    {{ formatDate(product.last_checked_at) }}
                </td>

            </tr>

            </tbody>

        </table>

    </div>
</template>
