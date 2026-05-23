<script setup>
import Sidebar from '@/components/Sidebar.vue'
import Topbar from '@/components/Topbar.vue'
</script>

<template>
    <div class="flex bg-gray-100 min-h-screen">
        <Sidebar />

        <div class="flex-1">
            <Topbar />

            <main class="p-6">
                <slot />
            </main>
        </div>
    </div>
</template>
