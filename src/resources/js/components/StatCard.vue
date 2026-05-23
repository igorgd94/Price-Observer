<script setup>
defineProps({
    title: String,
    value: String,
})
</script>

<template>
    <div class="bg-white rounded-xl shadow p-6">
        <h3 class="text-gray-500 text-sm mb-2">
            {{ title }}
        </h3>

        <p class="text-3xl font-bold">
            {{ value }}
        </p>
    </div>
</template>
