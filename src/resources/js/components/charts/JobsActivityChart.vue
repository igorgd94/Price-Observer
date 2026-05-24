<script setup>
import { Bar } from 'vue-chartjs'

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
)

const props = defineProps({

    completed: Number,

    failed: Number,
})

const chartData = {

    labels: [
        'Completed',
        'Failed',
    ],

    datasets: [

        {

            label: 'Jobs',

            data: [
                props.completed,
                props.failed,
            ],

            backgroundColor: [
                '#22c55e',
                '#ef4444',
            ],

            barPercentage: 0.3,

            categoryPercentage: 0.3,

            borderRadius: 15,
        },
    ],
}

const chartOptions = {

    responsive: true,

    maintainAspectRatio: false,

    plugins: {

        legend: {

            display: false,
        },
    },

    scales: {

        y: {

            beginAtZero: true,

            max: Math.max(
                props.completed,
                props.failed
            ) * 1.2,

            ticks: {

                display: false,
            },

            grid: {

                display: false,
            },

            border: {

                display: false,
            },
        },
    },
}
</script>

<template>

    <div class="h-64 w-full mt-3">

        <Bar
            :data="chartData"
            :options="chartOptions"
        />

    </div>

</template>
