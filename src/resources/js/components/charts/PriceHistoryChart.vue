<script setup>
import { Line } from 'vue-chartjs'

import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
} from 'chart.js'

ChartJS.register(
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
)

const props = defineProps({
    histories: Array,
})

const histories = [...props.histories].reverse()

const labels = histories.map(history =>

    new Intl.DateTimeFormat('pt-BR', {

        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',

    }).format(new Date(history.captured_at))
)

const prices = histories.map(history =>

    Number(history.price)
)

const chartData = {

    labels,

    datasets: [

        {

            label: 'Preço',

            data: prices,

            borderWidth: 2,

            tension: 0.3,

            fill: false,
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

            ticks: {

                callback(value) {

                    return `R$ ${value}`
                },
            },
        },
    },
}
</script>

<template>

    <div class="h-80">

        <Line
            :data="chartData"
            :options="chartOptions"
        />

    </div>

</template>
