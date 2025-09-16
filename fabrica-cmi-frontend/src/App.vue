<template>
  <div class="flex min-h-screen bg-gray-100 font-sans">
    <!-- ============================================= -->
    <!-- ==== BARRA LATERAL DE NAVEGACIÓN (SIDEBAR) ==== -->
    <!-- ============================================= -->
    <aside class="w-64 bg-gray-800 text-white flex-shrink-0">
      <div class="p-6 text-2xl font-bold border-b border-gray-700">
        CMI Fábrica
      </div>
      <nav class="mt-6">
        <router-link to="/" class="nav-link">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
          <span>Dashboard</span>
        </router-link>
        <router-link to="/produccion" class="nav-link">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20" /></svg>
          <span>Producción</span>
        </router-link>
        <router-link to="/ventas" class="nav-link">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          <span>Ventas</span>
        </router-link>
        <router-link to="/consumos" class="nav-link">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547a2 2 0 00-.547 1.806l.443 2.216a2 2 0 001.287 1.663l2.387.955a6 6 0 003.86-.517l.318-.158a6 6 0 013.86-.517l2.387-.955a2 2 0 001.287-1.663l.443-2.216a2 2 0 00-.547-1.806z" /></svg>
          <span>Consumos</span>
        </router-link>
      </nav>
    </aside>

    <!-- Contenido Principal -->
    <main class="flex-1 p-10">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useProductionStore } from './stores/productionStore'

// Al montar el componente principal de la app, iniciamos la carga de datos
// pidiendo los años disponibles. El store se encarga del resto.
const productionStore = useProductionStore()
onMounted(() => {
  productionStore.fetchAvailableYears()
})
</script>

<style scoped>
.nav-link {
  @apply flex items-center px-6 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200;
}

.nav-link svg {
  @apply mr-3;
}

/* Estilo para el enlace activo */
.router-link-exact-active {
  @apply bg-gray-900 text-white;
}
</style>