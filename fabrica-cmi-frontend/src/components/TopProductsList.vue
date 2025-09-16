<template>
  <div>
    <h3 class="text-lg font-semibold text-gray-700 mb-4">{{ title }}</h3>
    <ul class="space-y-4">
      <li v-for="(item, index) in items" :key="index">
        <div class="flex justify-between items-center mb-1">
          <span class="text-sm font-medium text-gray-600 truncate">{{ item.name }}</span>
          <span class="text-sm font-bold text-gray-800">{{ item.value.toLocaleString('es-ES') }}</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2.5">
          <div class="bg-blue-500 h-2.5 rounded-full" :style="{ width: getPercentage(item.value) + '%' }"></div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: { type: String, default: 'Top Items' },
  items: { type: Array, required: true } // Formato esperado: [{ name: '...', value: 123 }]
})

const maxValue = computed(() => {
  if (props.items.length === 0) return 0;
  return Math.max(...props.items.map(item => item.value));
})

const getPercentage = (value) => {
  if (maxValue.value === 0) return 0;
  return (value / maxValue.value) * 100;
}
</script>