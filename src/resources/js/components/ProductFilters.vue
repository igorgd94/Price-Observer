<script setup>
import { reactive } from 'vue'
import { router } from '@inertiajs/vue3'

const props = defineProps({
    filters: Object,
})

const form = reactive({
    search: props.filters.search || '',
    status: props.filters.status || '',
    sort: props.filters.sort || '',
})

function filter() {
    router.get('/products', form, {
        preserveState: true,
        replace: true,
    })
}
</script>

<template>
    <div class="bg-white rounded-xl shadow p-4">

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">

            <input
                v-model="form.search"
                type="text"
                placeholder="Buscar produto..."
                class="border rounded-lg px-4 py-2"
            >

            <select
                v-model="form.status"
                class="border rounded-lg px-4 py-2"
            >
                <option value="">
                    Todos status
                </option>

                <option value="active">
                    Ativo
                </option>

                <option value="inactive">
                    Pausado
                </option>
            </select>

            <select
                v-model="form.sort"
                class="border rounded-lg px-4 py-2"
            >
                <option value="">
                    Ordenar por
                </option>

                <option value="price_asc">
                    Menor preço
                </option>

                <option value="price_desc">
                    Maior preço
                </option>

                <option value="latest">
                    Última verificação
                </option>
            </select>

            <button
                @click="filter"
                class="bg-gray-900 text-white rounded-lg px-4 py-2 hover:bg-black"
            >
                Filtrar
            </button>

        </div>

    </div>
</template>
