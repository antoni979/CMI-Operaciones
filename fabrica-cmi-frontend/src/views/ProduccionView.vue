<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-800 mb-8">Registro de Producción</h1>

    <!-- Sección de Carga Masiva -->
    <div class="bg-white p-6 rounded-2xl shadow-lg mb-10">
      <CsvUploader 
        title="Subir Parte de Producción (CSV)"
        description="Exporta el informe de SAP a CSV y súbelo aquí. Asegúrate que las cabeceras coinciden."
        :expected-headers="csvHeaders"
        @data-parsed="handleDataUpload"
      />
      <div v-if="uploadStatus" :class="uploadStatus.success ? 'text-green-600' : 'text-red-600'" class="mt-4 text-sm font-semibold">
        {{ uploadStatus.message }}
      </div>
    </div>
    
    <!-- Sección de Visualización de Datos -->
    <div class="bg-white p-6 rounded-2xl shadow-lg">
      <h2 class="text-xl font-semibold mb-4 text-gray-700">Últimos Registros de Producción</h2>
      
      <div v-if="store.loading" class="text-center text-gray-500 py-8">Cargando datos...</div>
      <div v-if="store.error" class="text-center text-red-500 py-8">Error al cargar: {{ store.error }}</div>
      
      <div v-if="!store.loading && store.productionRecords.length > 0" class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="table-header">Fecha</th>
              <th class="table-header">Orden</th>
              <th class="table-header">Descripción Producto</th>
              <th class="table-header">Cajas</th>
              <th class="table-header">Unidades</th>
              <th class="table-header">KG Producidos</th>
              <th class="table-header">Horas</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="record in store.productionRecords" :key="record.id" class="hover:bg-gray-50">
              <td class="table-cell">{{ formatDate(record.fecha_produccion) }}</td>
              <td class="table-cell font-mono text-sm">{{ record.orden_produccion }}</td>
              <td class="table-cell font-medium text-gray-900">{{ record.descripcion_producto }}</td>
              <td class="table-cell">{{ record.cantidad_cajas }}</td>
              <td class="table-cell">{{ record.unidades_fabricadas }}</td>
              <td class="table-cell">{{ record.kg_producidos }}</td>
              <td class="table-cell">{{ record.horas_produccion }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="!store.loading && store.productionRecords.length === 0" class="text-center text-gray-500 py-12">
        No hay registros de producción. ¡Sube tu primer archivo para empezar!
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useProductionStore } from '../stores/productionStore'
import CsvUploader from '../components/CsvUploader.vue'

const store = useProductionStore()
const uploadStatus = ref(null)

// Las cabeceras exactas que esperamos en el archivo CSV
const csvHeaders = [
  'Fecha SAP',
  'Fruta',
  'Descripción producto',
  'Cant notificada',
  'Orden',
  'KG Volcados',
  'KG',
  'Tarrinas fabricadas',
  'Centro de coste',
  'Horas'
];

// Al cargar la página, pedimos los datos iniciales a Supabase
onMounted(() => {
  store.fetchProduction()
})

// Función que se ejecuta cuando el CsvUploader ha procesado un archivo
const handleDataUpload = async (parsedData) => {
  if (!parsedData || parsedData.length === 0) {
    uploadStatus.value = { success: false, message: 'El archivo está vacío o tiene un formato incorrecto.' }
    return;
  }
  
  const formattedData = parsedData.map(row => {
    // Función para convertir fecha de DD.MM.YYYY a YYYY-MM-DD
    const convertDate = (dateStr) => {
      if (!dateStr) return null;
      const parts = dateStr.split('.');
      if (parts.length !== 3) return null;
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    };

    // Función robusta para convertir números
    const parseNumeric = (value) => {
      if (typeof value !== 'string' || !value) return null;
      try {
        const cleanedValue = value.replace(/\./g, '').replace(',', '.');
        const number = parseFloat(cleanedValue);
        return isNaN(number) ? null : number;
      } catch (e) {
        return null;
      }
    };

    return {
      // ===== CORRECCIÓN APLICADA AQUÍ =====
      producto_ref: row['Descripción producto'], // Usamos la descripción como referencia del producto
      // ===================================
      
      fecha_produccion: convertDate(row['Fecha SAP']),
      fruta: row['Fruta'],
      orden_produccion: row['Orden'],
      descripcion_producto: row['Descripción producto'],
      cantidad_cajas: parseInt(row['Cant notificada'], 10) || 0,
      unidades_fabricadas: parseInt(row['Tarrinas fabricadas'], 10) || 0,
      kg_volcados: parseNumeric(row['KG Volcados']),
      kg_producidos: parseNumeric(row['KG']),
      centro_coste: row['Centro de coste'],
      horas_produccion: parseNumeric(row['Horas']),
      fecha_caducidad: null // No viene en el excel
    };
  });
  
  const result = await store.addProductionBatch(formattedData)
  
  if (result.success) {
    uploadStatus.value = { success: true, message: `¡Éxito! Se han subido ${result.count} nuevos registros de producción.` }
  } else {
    uploadStatus.value = { success: false, message: `Error al subir los datos: ${result.error}` }
  }

  setTimeout(() => { uploadStatus.value = null }, 7000);
}

// Pequeña utilidad para formatear fechas en la tabla
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-ES', options);
}
</script>

<style scoped>
.table-header {
  @apply px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider;
}
.table-cell {
  @apply px-6 py-4 whitespace-nowrap text-sm text-gray-600;
}
</style>