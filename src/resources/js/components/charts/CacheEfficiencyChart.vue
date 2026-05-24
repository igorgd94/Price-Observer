<script setup>
import { Doughnut } from 'vue-chartjs'

import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js'

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
)

const props = defineProps({
    hits: Number,
    misses: Number,
})

const chartData = {

    labels: [
        'Hits',
        'Misses',
    ],

    datasets: [

        {

            data: [
                props.hits,
                props.misses,
            ],

            backgroundColor: [
                '#22c55e',
                '#ef4444',
            ],

            borderWidth: 1,
        },
    ],
}

const chartOptions = {

    responsive: true,

    maintainAspectRatio: false,

    plugins: {

        legend: {

            position: 'bottom',
        },
    },
}
</script>

<template>

    <div class="h-80">

        <Doughnut
            :data="chartData"
            :options="chartOptions"
        />

    </div>

</template>
