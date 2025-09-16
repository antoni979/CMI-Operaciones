<template>
  <Doughnut :data="data" :options="options" />
</template>

<script setup>
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
ChartJS.register(ArcElement, Tooltip, Legend)

defineProps({
  data: { type: Object, required: true },
  options: { type: Object }
})
</script>