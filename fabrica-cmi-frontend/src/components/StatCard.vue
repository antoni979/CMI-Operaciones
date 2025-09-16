<template>
  <div class="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
    <div class="flex items-center">
      <div class="p-3 rounded-full" :class="iconBgColor">
        <!-- El slot permite pasar un SVG desde el componente padre -->
        <slot name="icon"></slot>
      </div>
      <h3 class="ml-4 text-lg font-semibold text-gray-600">{{ title }}</h3>
    </div>
    <div class="mt-4">
      <p class="text-4xl font-bold text-gray-800">{{ value }}</p>
      <p v-if="subtitle" class="text-sm text-gray-500 mt-1">{{ subtitle }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: 'blue' // Acepta 'blue', 'green', 'yellow'
  }
})

// Calcula dinámicamente el color de fondo del icono
const iconBgColor = computed(() => {
  return {
    'blue': 'bg-blue-100',
    'green': 'bg-green-100',
    'yellow': 'bg-yellow-100',
  }[props.color] || 'bg-gray-100'
})
</script>