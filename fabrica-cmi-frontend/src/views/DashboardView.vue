<template>
  <div>
    <!-- Cabecera con Filtro Global -->
    <div class="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
      <h1 class="text-4xl font-bold text-gray-800">Cuadro de Mando Integral</h1>
      <div v-if="store.availableYears.length > 0">
        <label for="year-select" class="sr-only">Seleccionar Año</label>
        <select id="year-select" v-model="store.selectedYear" class="w-full md:w-auto rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
          <option v-for="year in store.availableYears" :key="year" :value="year">
            Año {{ year }}
          </option>
        </select>
      </div>
    </div>
    
    <!-- Pantalla de carga mientras se obtienen los datos iniciales -->
    <div v-if="store.loading && store.recordsForYear.length === 0" class="text-center text-gray-500 py-16">
      Cargando métricas...
    </div>

    <!-- Contenido principal del dashboard -->
    <div v-else>
      <!-- KPIs Principales -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Unidades Producidas" :value="store.totalUnidadesProducidas.toLocaleString('es-ES')" :subtitle="'En el año ' + store.selectedYear" color="blue">
           <template #icon><svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4-8-4V7l8 4 8-4z" /></svg></template>
        </StatCard>
        <StatCard title="Total Kilos Producidos" :value="store.totalKgProducidos.toLocaleString('es-ES', { maximumFractionDigits: 0 })" :subtitle="'En el año ' + store.selectedYear" color="green">
           <template #icon><svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4" /></svg></template>
        </StatCard>
        <StatCard title="Total Órdenes" :value="store.totalOrdenes.toLocaleString('es-ES')" :subtitle="'En el año ' + store.selectedYear" color="yellow">
           <template #icon><svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM16.5 9.75h-7.5" /></svg></template>
        </StatCard>
        <StatCard title="Rendimiento Medio" :value="store.averageYield.toFixed(2) + '%'" :subtitle="'En el año ' + store.selectedYear" color="purple">
           <template #icon><svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6a7.5 7.5 0 100 15 7.5 7.5 0 000-15zM21 21l-5.197-5.197" /></svg></template>
        </StatCard>
      </div>

      <!-- Fila de Gráficos Principales -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
        <div class="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg">
           <h2 class="text-xl font-semibold text-gray-700 mb-4">Evolución Mensual (Unidades)</h2>
           <div style="height: 350px;">
             <!-- ===== SOLUCIÓN APLICADA AQUÍ ===== -->
             <Bar v-if="chartDataIsReady" :data="barChartData" :options="barChartOptions" />
             <p v-else class="text-gray-500 h-full flex items-center justify-center">No hay datos para el periodo seleccionado.</p>
           </div>
        </div>
        <div class="bg-white p-6 rounded-2xl shadow-lg">
          <h2 class="text-xl font-semibold text-gray-700 mb-4">Desglose por Fruta</h2>
          <div style="height: 350px;" class="flex items-center justify-center">
             <!-- ===== SOLUCIÓN APLICADA AQUÍ ===== -->
            <DoughnutChart v-if="doughnutDataIsReady" :data="doughnutChartData" :options="doughnutChartOptions" />
            <p v-else class="text-gray-500">No hay datos.</p>
          </div>
        </div>
      </div>
      
      <!-- Fila de Información Adicional -->
      <div class="mt-10 bg-white p-6 rounded-2xl shadow-lg">
         <!-- ===== SOLUCIÓN APLICADA AQUÍ ===== -->
        <TopProductsList v-if="topProductsDataIsReady" title="Top 5 Productos por Unidades Producidas" :items="store.top5ProductsByUnits" />
         <p v-else class="text-gray-500 text-center">No hay datos de productos.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useProductionStore } from '../stores/productionStore'
import StatCard from '../components/StatCard.vue'
import TopProductsList from '../components/TopProductsList.vue'
import DoughnutChart from '../components/DoughnutChart.vue'

import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const store = useProductionStore()

// ===== SOLUCIÓN APLICADA AQUÍ =====
// Creamos propiedades computadas que VERIFICAN si los datos para cada gráfico están listos.
const chartDataIsReady = computed(() => store.produccionMensual && store.produccionMensual.data && store.produccionMensual.data.length > 0)
const doughnutDataIsReady = computed(() => store.produccionPorFruta && store.produccionPorFruta.data && store.produccionPorFruta.data.length > 0)
const topProductsDataIsReady = computed(() => store.top5ProductsByUnits && store.top5ProductsByUnits.length > 0)

// Estas propiedades computadas solo se ejecutarán si los datos están listos, evitando el error.
const barChartData = computed(() => ({
  labels: store.produccionMensual.labels,
  datasets: [{
    label: 'Unidades',
    backgroundColor: '#3b82f6',
    borderRadius: 5,
    data: store.produccionMensual.data
  }]
}))
const barChartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }

const doughnutChartData = computed(() => ({
  labels: store.produccionPorFruta.labels,
  datasets: [{
    backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#6b7280'],
    data: store.produccionPorFruta.data
  }]
}))
const doughnutChartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
</script>