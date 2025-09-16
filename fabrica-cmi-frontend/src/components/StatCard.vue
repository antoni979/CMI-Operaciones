<template>
  <div class="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
    <div class="flex items-center">
      <div class="p-3 rounded-full" :class="iconBgColor">
        <!-- El slot permite pasar un SVG desde el componente padre -->
        <slot name="icon">
           <!-- Icono por defecto si no se proporciona uno -->
           <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" /></svg>
        </slot>
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
    default: 'blue' // Acepta 'blue', 'green', 'yellow', 'purple'
  }
})

// Calcula dinámicamente el color de fondo del icono
const iconBgColor = computed(() => {
  return {
    'blue': 'bg-blue-100',
    'green': 'bg-green-100',
    'yellow': 'bg-yellow-100',
    'purple': 'bg-purple-100', // <-- CORRECCIÓN APLICADA
  }[props.color] || 'bg-gray-100'
})
</script>