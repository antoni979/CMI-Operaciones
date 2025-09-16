import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { supabase } from '../supabase'

export const useProductionStore = defineStore('production', () => {
  // --- STATE ---
  const kpis = ref(null) 
  const availableYears = ref([])
  const selectedYear = ref(null)
  
  const loading = ref(false)
  const error = ref(null)

  // --- ACTIONS ---

  async function fetchAvailableYears() {
    console.log('🔵 [Store] 1. Pidiendo años disponibles al backend...');
    const { data, error: rpcError } = await supabase.rpc('get_distinct_years');
    
    if (rpcError) {
      console.error('🔴 [Store] Error al llamar a get_distinct_years:', rpcError);
      error.value = "No se pudieron cargar los años.";
      return;
    }
    
    availableYears.value = data.map(item => item.year);
    console.log('🟢 [Store] 2. Años disponibles recibidos:', availableYears.value);

    if (availableYears.value.length > 0) {
      selectedYear.value = availableYears.value[0];
    }
  }

  async function fetchKpisForYear(year) {
    if (!year) return;
    console.log(`🔵 [Store] 4. Pidiendo KPIs AGREGADOS para el año ${year}...`);
    loading.value = true;
    error.value = null;
    try {
      const { data, error: rpcError } = await supabase.rpc('get_dashboard_kpis', { p_year: year });
      if (rpcError) throw rpcError;
      kpis.value = data; 
      console.log(`🟢 [Store] 5. KPIs para el año ${year} recibidos:`, kpis.value);
    } catch (e) {
      error.value = e.message;
      kpis.value = null;
      console.error(`🔴 [Store] Error crítico en fetchKpisForYear(${year}):`, e);
    } finally {
      loading.value = false;
    }
  }

  // FUNCIÓN DE SUBIDA RESTAURADA Y MEJORADA
  async function addProductionBatch(records) {
    console.log(`🔵 [Store] Intentando subir ${records.length} nuevos registros...`);
    loading.value = true;
    error.value = null;
    try {
      // Supabase permite subir en lotes para mayor eficiencia
      const { error: insertError } = await supabase
        .from('produccion')
        .insert(records);

      if (insertError) throw insertError;
      
      console.log(`🟢 [Store] ${records.length} registros subidos con éxito.`);
      
      // Después de subir, refrescamos todo para ver los cambios.
      console.log('🔄 [Store] Refrescando datos después de la subida...');
      await fetchAvailableYears();
      
      return { success: true, count: records.length };
    } catch (e) {
      error.value = e.message;
      console.error('🔴 [Store] Error crítico al subir los datos:', e);
      return { success: false, error: e.message };
    } finally {
      loading.value = false;
    }
  }
  
  watch(selectedYear, (newYear) => {
    if (newYear) {
      console.log(`🔁 [Store] 3. El año ha cambiado a ${newYear}. Pidiendo nuevos KPIs...`);
      fetchKpisForYear(newYear);
    }
  });

  // --- GETTERS ---
  const totalUnidadesProducidas = computed(() => kpis.value?.totalUnidades || 0)
  const totalKgProducidos = computed(() => kpis.value?.totalKilos || 0)
  const totalOrdenes = computed(() => kpis.value?.totalOrdenes || 0)
  const averageYield = computed(() => kpis.value?.rendimiento || 0)
  const produccionMensual = computed(() => {
    if (!kpis.value?.produccionMensual) return { labels: [], data: [] };
    const mesesDelBackend = kpis.value.produccionMensual;
    const mesesCompletos = Array(12).fill(0);
    mesesDelBackend.forEach(item => { mesesCompletos[item.mes - 1] = item.unidades; });
    return { labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'], data: mesesCompletos };
  });
  const produccionPorFruta = computed(() => {
    if (!kpis.value?.desgloseFruta) return { labels: [], data: [] };
    return { labels: kpis.value.desgloseFruta.map(item => item.fruta), data: kpis.value.desgloseFruta.map(item => item.unidades) };
  });
  const top5ProductsByUnits = computed(() => {
    if (!kpis.value?.topProductos) return [];
    return kpis.value.topProductos.map(item => ({ name: item.producto_ref, value: item.unidades }));
  });

  // =========================================================================
  // ===== CORRECCIÓN DEFINITIVA APLICADA AQUÍ ===============================
  // =========================================================================
  return { 
    kpis, availableYears, selectedYear, loading, error, 
    fetchAvailableYears,
    addProductionBatch, // <-- ¡LA FUNCIÓN QUE FALTABA AHORA SÍ ESTÁ EXPUESTA!
    totalUnidadesProducidas, totalKgProducidos, totalOrdenes, averageYield,
    produccionMensual, produccionPorFruta, top5ProductsByUnits
  }
  // =========================================================================
})