<script setup>
import { Link } from '@inertiajs/vue3'

const items = [
    {
        label: 'Dashboard',
        href: '/dashboard',
    },
    {
        label: 'Produtos',
        href: '/products',
    },
    {
        label: 'Métricas',
        href: '/metrics',
    },
    {
        label: 'Filas',
        href: '/jobs',
    },
    {
        label: 'Cache',
        href: '/cache',
    },
]
</script>

<template>
    <aside class="w-64 bg-gray-900 text-white min-h-screen p-4">
        <h1 class="text-2xl font-bold mb-8">
            Price Observer
        </h1>

        <nav class="space-y-2">

            <Link
                v-for="item in items"
                :key="item.href"
                :href="item.href"
                class="block px-4 py-2 rounded hover:bg-gray-800 transition"
            >
                {{ item.label }}
            </Link>

        </nav>
    </aside>
</template>
