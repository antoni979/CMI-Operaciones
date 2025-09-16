<template>
  <div>
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-gray-800">Histórico de Producción</h1>
      <div v-if="availableYears.length > 0">
        <select v-model="selectedYear" class="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
          <option v-for="year in availableYears" :key="year" :value="year">
            Año {{ year }}
          </option>
        </select>
      </div>
    </div>

    <div class="bg-white p-6 rounded-2xl shadow-lg mb-10">
      <CsvUploader 
        title="Subir Parte de Producción (CSV)"
        description="Sube un nuevo parte para añadirlo a los datos existentes."
        :expected-headers="csvHeaders"
        @data-parsed="handleDataUpload"
      />
       <div v-if="uploadStatus" :class="uploadStatus.success ? 'text-green-600' : 'text-red-600'" class="mt-4 text-sm font-semibold">
        {{ uploadStatus.message }}
      </div>
    </div>

    <div class="bg-white p-4 rounded-2xl shadow-lg mb-10">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="search" class="block text-sm font-medium text-gray-700">Buscar (Orden/Desc.)</label>
          <input type="text" v-model="searchTerm" id="search" placeholder="Escribe para filtrar..." class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
        </div>
      </div>
    </div>

    <div class="bg-white p-6 rounded-2xl shadow-lg">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold text-gray-700">Registros del Año {{ selectedYear }}</h2>
        <span class="text-sm font-medium text-gray-500">{{ filteredRecords.length }} registros encontrados</span>
      </div>
      
      <div v-if="loading" class="text-center text-gray-500 py-8">Cargando datos...</div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="table-header">Fecha</th>
              <th class="table-header">Orden</th>
              <th class="table-header">Descripción Producto</th>
              <th class="table-header">Unidades</th>
              <th class="table-header">KG Producidos</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="record in paginatedRecords" :key="record.id" class="hover:bg-gray-50">
              <td class="table-cell">{{ formatDate(record.fecha_produccion) }}</td>
              <td class="table-cell font-mono text-sm">{{ record.orden_produccion }}</td>
              <td class="table-cell font-medium text-gray-900">{{ record.descripcion_producto }}</td>
              <td class="table-cell">{{ record.unidades_fabricadas.toLocaleString('es-ES') }}</td>
              <td class="table-cell">{{ record.kg_producidos.toLocaleString('es-ES') }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="flex items-center justify-between mt-6">
        <p class="text-sm text-gray-600">Página {{ currentPage }} de {{ totalPages }}</p>
        <div>
          <button @click="prevPage" :disabled="currentPage === 1" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50">Anterior</button>
          <button @click="nextPage" :disabled="currentPage === totalPages || totalPages === 0" class="ml-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50">Siguiente</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useProductionStore } from '../stores/productionStore'
import { supabase } from '../supabase'
import CsvUploader from '../components/CsvUploader.vue'

const store = useProductionStore()
const records = ref([])
const loading = ref(false)
const selectedYear = ref(store.selectedYear || new Date().getFullYear())
const availableYears = computed(() => store.availableYears)
const searchTerm = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(15)
const uploadStatus = ref(null)

const fetchRawDataForYear = async (year) => {
  if (!year) return;
  loading.value = true;
  records.value = [];
  try {
    let allData = [];
    let page = 0;
    
    // ===== CORRECCIÓN DE SINTAXIS DEFINITIVA =====
    // Creamos las fechas de inicio y fin para el filtro
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;

    while (true) {
      const { data, error } = await supabase
        .from('produccion')
        .select('*')
        // Usamos .gte() y .lte(), que funcionan perfectamente
        .gte('fecha_produccion', startDate) // Mayor o igual que el primer día del año
        .lte('fecha_produccion', endDate)   // Menor o igual que el último día del año
        .order('fecha_produccion', { ascending: false })
        .range(page * 1000, (page + 1) * 1000 - 1);
      // ===========================================
      
      if (error) throw error;
      if (data) allData.push(...data);
      if (!data || data.length < 1000) break;
      page++;
    }
    records.value = allData;
  } catch (err) {
    console.error("Error fetching raw data for production view:", err);
  } finally {
    loading.value = false;
  }
}

watch(selectedYear, (newYear) => {
  if (newYear) {
    fetchRawDataForYear(newYear)
  }
}, { immediate: true })

const filteredRecords = computed(() => {
  if (!searchTerm.value) return records.value;
  const lowerCaseSearch = searchTerm.value.toLowerCase();
  return records.value.filter(r => 
    (r.descripcion_producto && r.descripcion_producto.toLowerCase().includes(lowerCaseSearch)) ||
    (r.orden_produccion && r.orden_produccion.toLowerCase().includes(lowerCaseSearch))
  );
});

const totalPages = computed(() => Math.ceil(filteredRecords.value.length / itemsPerPage.value) || 1)
const paginatedRecords = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredRecords.value.slice(start, start + itemsPerPage.value);
})

const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++ }
const prevPage = () => { if (currentPage.value > 1) currentPage.value-- }

const csvHeaders = ['Fecha SAP', 'Fruta', 'Descripción producto', 'Cant notificada', 'Orden', 'KG Volcados', 'KG', 'Tarrinas fabricadas', 'Centro de coste', 'Horas'];
const handleDataUpload = async (parsedData) => {
  const formattedData = parsedData.map(row => {
    const convertDate = (d) => { if (!d) return null; const p = d.split('.'); return p.length !== 3 ? null : `${p[2]}-${p[1]}-${p[0]}` };
    const parseNumeric = (v) => { if (typeof v !== 'string' || !v) return null; try { const c = v.replace(/\./g, '').replace(',', '.'); const n = parseFloat(c); return isNaN(n) ? null : n; } catch (e) { return null; } };
    return { producto_ref: row['Descripción producto'], fecha_produccion: convertDate(row['Fecha SAP']), fruta: row['Fruta'], orden_produccion: row['Orden'], descripcion_producto: row['Descripción producto'], cantidad_cajas: parseInt(row['Cant notificada'], 10) || 0, unidades_fabricadas: parseInt(row['Tarrinas fabricadas'], 10) || 0, kg_volcados: parseNumeric(row['KG Volcados']), kg_producidos: parseNumeric(row['KG']), centro_coste: row['Centro de coste'], horas_produccion: parseNumeric(row['Horas']), fecha_caducidad: null };
  });
  const result = await store.addProductionBatch(formattedData);
  if (result.success) {
    uploadStatus.value = { success: true, message: `¡Éxito! Se han subido ${result.count} nuevos registros.` };
  } else {
    uploadStatus.value = { success: false, message: `Error al subir los datos: ${result.error}` };
  }
  setTimeout(() => { uploadStatus.value = null }, 7000);
}
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
</script>

<style scoped>
.table-header { @apply px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider; }
.table-cell { @apply px-6 py-4 whitespace-nowrap text-sm text-gray-600; }
</style>