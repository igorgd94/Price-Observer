<script setup>
import ProductFilters from '@/components/ProductFilters.vue'
import ProductTable from '@/components/ProductTable.vue'
import Pagination from '@/components/Pagination.vue'
import { Link } from '@inertiajs/vue3'

defineProps({
    products: Object,
    filters: Object,
})

</script>

<template>
    <div class="space-y-6">

        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-3xl font-bold text-gray-900">
                    Produtos
                </h1>

                <p class="text-gray-500 mt-1">
                    Monitoramento e histórico de preços.
                </p>
            </div>

            <Link
                href="/products/create"
                class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
                Novo Produto
            </Link>
        </div>

        <ProductFilters :filters="filters" />

        <ProductTable :products="products.data" />

        <Pagination :links="products.links" />
    </div>
</template>
