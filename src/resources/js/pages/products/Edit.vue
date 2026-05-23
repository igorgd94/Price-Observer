<script setup>
import { useForm, Link } from '@inertiajs/vue3'

const props = defineProps({
    product: Object,
})

const form = useForm({
    name: props.product.name,
    source: props.product.source,
    url: props.product.url,
    target_price: props.product.target_price,
})

function submit() {

    form.put(`/products/${props.product.id}`)
}
</script>

<template>

    <div class="max-w-3xl mx-auto space-y-6">

        <div class="flex items-center justify-between">

            <div>

                <h1 class="text-3xl font-bold">
                    Editar Produto
                </h1>

                <p class="text-gray-500 mt-1">
                    Atualize os dados do produto.
                </p>

            </div>

        </div>

        <div class="bg-white rounded-xl shadow p-6">

            <form
                class="space-y-6"
                @submit.prevent="submit"
            >

                <div>

                    <label class="block text-sm font-medium mb-2">
                        Nome
                    </label>

                    <input
                        v-model="form.name"
                        type="text"
                        class="w-full border rounded-lg px-4 py-2"
                    >

                </div>

                <div>

                    <label class="block text-sm font-medium mb-2">
                        Loja/Origem
                    </label>

                    <input
                        v-model="form.source"
                        type="text"
                        class="w-full border rounded-lg px-4 py-2"
                    >

                </div>

                <div>

                    <label class="block text-sm font-medium mb-2">
                        URL
                    </label>

                    <input
                        v-model="form.url"
                        type="url"
                        class="w-full border rounded-lg px-4 py-2"
                    >

                </div>

                <div>

                    <label class="block text-sm font-medium mb-2">
                        Preço alvo
                    </label>

                    <input
                        v-model="form.target_price"
                        type="number"
                        step="0.01"
                        class="w-full border rounded-lg px-4 py-2 appearance-none"
                    >

                </div>

                <div class="flex justify-end gap-4">

                    <Link
                        href="/products"
                        class="border px-4 py-2 rounded-lg hover:bg-gray-100"
                    >
                        Cancelar
                    </Link>

                    <button
                        type="submit"
                        :disabled="form.processing"
                        class="bg-gray-900 text-white px-6 py-2 rounded-lg disabled:opacity-50"
                    >
                        {{
                            form.processing
                                ? 'Salvando...'
                                : 'Salvar'
                        }}
                    </button>

                </div>

            </form>

        </div>

    </div>

</template>
