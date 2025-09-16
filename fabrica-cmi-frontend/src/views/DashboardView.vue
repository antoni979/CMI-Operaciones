<template>
  <div>
    <h1 class="text-4xl font-bold text-gray-800 mb-8">Dashboard General</h1>
    
    <!-- Grid para las tarjetas de estadísticas -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      
      <!-- Tarjeta de Producción -->
      <StatCard 
        title="Unidades Producidas" 
        value="12,450" 
        subtitle="Últimos 30 días"
        color="blue">
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4-8-4V7l8 4 8-4z" /></svg>
        </template>
      </StatCard>

      <!-- Tarjeta de Ventas -->
      <StatCard 
        title="Pedidos de Venta" 
        value="320" 
        subtitle="Pendientes de entrega"
        color="green">
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
        </template>
      </StatCard>

      <!-- Tarjeta de Eficiencia/Merma -->
      <StatCard 
        title="Merma de Materia Prima" 
        value="2.5%" 
        subtitle="Promedio del mes"
        color="yellow">
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
        </template>
      </StatCard>
      
    </div>

    <!-- Próximamente: Gráficos y Tablas -->
    <div class="mt-12 bg-white p-8 rounded-2xl shadow-lg">
       <h2 class="text-2xl font-semibold text-gray-700">Evolución de Producción</h2>
       <div class="mt-4 h-64 bg-gray-200 rounded-lg flex items-center justify-center">
         <p class="text-gray-500">Próximamente: Gráfico de barras aquí</p>
       </div>
    </div>

  </div>
</template>

<script setup>
import StatCard from '../components/StatCard.vue'
</script>