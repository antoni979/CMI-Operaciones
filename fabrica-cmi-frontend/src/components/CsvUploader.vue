<template>
  <div>
    <h3 class="text-lg font-medium text-gray-700 mb-2">{{ title }}</h3>
    <p class="text-sm text-gray-500 mb-4">{{ description }}</p>
    
    <div 
      @dragover.prevent="onDragOver"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onDrop"
      :class="['border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-300', 
               isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400']"
      @click="triggerFileInput">
      
      <input
        ref="fileInput"
        type="file"
        @change="handleFileUpload"
        accept=".csv"
        class="hidden"
      />

      <div class="flex flex-col items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-4-4V7a4 4 0 014-4h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V16a4 4 0 01-4 4H7z" /></svg>
        <p class="mt-2 text-sm text-gray-600">
          <span class="font-semibold text-blue-600">Haz clic para subir</span> o arrastra y suelta el archivo aquí.
        </p>
        <p class="text-xs text-gray-500 mt-1">Solo se aceptan archivos CSV</p>
      </div>
    </div>

    <div v-if="fileName" class="mt-4 text-sm text-gray-600 bg-gray-100 p-3 rounded-md">
      Archivo seleccionado: <span class="font-semibold">{{ fileName }}</span>
    </div>
    <div v-if="error" class="mt-2 text-sm text-red-600 font-medium">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Papa from 'papaparse'

// Propiedades que el componente recibe desde el padre (ProduccionView)
const props = defineProps({
  title: String,
  description: String,
  expectedHeaders: {
    type: Array,
    required: true
  }
})

// Evento que el componente emite hacia el padre con los datos procesados
const emit = defineEmits(['data-parsed'])

const fileInput = ref(null)
const fileName = ref('')
const error = ref('')
const isDragging = ref(false)

// --- Manejo del 'arrastrar y soltar' ---
const onDragOver = () => { isDragging.value = true }
const onDragLeave = () => { isDragging.value = false }
const onDrop = (event) => {
  isDragging.value = false
  const file = event.dataTransfer.files[0]
  if (file) {
    processFile(file)
  }
}

// --- Manejo del clic y selección de archivo ---
const triggerFileInput = () => {
  fileInput.value.click()
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    processFile(file)
  }
}

// --- Lógica central para procesar el archivo ---
const processFile = (file) => {
  fileName.value = file.name
  error.value = ''

  if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
    error.value = 'Error: El archivo no es un CSV válido.'
    return
  }

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    delimiter: ';', // <-- CORRECCIÓN APLICADA: Usa punto y coma como separador
    complete: (results) => {
      const headers = results.meta.fields;
      // Comprobar si todas las cabeceras esperadas están en el archivo
      const missingHeaders = props.expectedHeaders.filter(h => !headers.includes(h));

      if (missingHeaders.length > 0) {
        error.value = `Error: Faltan las columnas: ${missingHeaders.join(', ')}. Revisa el archivo CSV.`;
        return;
      }
      
      emit('data-parsed', results.data);
    },
    error: (err) => {
      error.value = `Error al procesar el archivo: ${err.message}`;
      console.error(err);
    }
  })
}
</script>