<script setup>
import { computed } from 'vue'

const props = defineProps({
    cols: {
        type: Number,
        default: 4,
    },
})

const gridClass = computed(() => {

    const colsMap = {
        1: 'xl:grid-cols-1',
        2: 'xl:grid-cols-2',
        3: 'xl:grid-cols-3',
        4: 'xl:grid-cols-4',
        5: 'xl:grid-cols-5',
        6: 'xl:grid-cols-6',
    }

    return colsMap[props.cols] || 'xl:grid-cols-4'
})
</script>

<template>

    <div
        class="grid grid-cols-1 md:grid-cols-2 gap-6"
        :class="gridClass"
    >
        <slot />
    </div>

</template>
