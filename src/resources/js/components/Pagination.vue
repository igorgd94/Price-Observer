<script setup>
import { Link } from '@inertiajs/vue3'

defineProps({
    links: Array,
})
</script>

<template>
    <div class="flex justify-end gap-2">

        <Link
            v-for="link in links"
            :key="link.label"
            :href="link.url || ''"
            class="px-4 py-2 rounded border text-sm"
            :class="{
        'bg-gray-900 text-white': link.active,
        'opacity-50 pointer-events-none': !link.url,
    }"
        >
            {{
                link.label
                    .replace('pagination.previous', 'Anterior')
                    .replace('pagination.next', 'Próxima')
            }}
        </Link>

    </div>
</template>
