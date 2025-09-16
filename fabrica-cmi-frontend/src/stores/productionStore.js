import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../supabase'

export const useProductionStore = defineStore('production', () => {
  // State: donde guardamos los datos
  const productionRecords = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Action: Función para obtener todos los registros de la BBDD
  async function fetchProduction() {
    loading.value = true
    error.value = null
    try {
      const { data, error: fetchError } = await supabase
        .from('produccion')
        .select('*')
        .order('fecha_produccion', { ascending: false }) // Los más nuevos primero
        .limit(100) // Traemos solo los últimos 100 para no sobrecargar

      if (fetchError) throw fetchError
      productionRecords.value = data
    } catch (e) {
      error.value = e.message
      console.error("Error fetching production data:", e)
    } finally {
      loading.value = false
    }
  }

  // Action: Función para añadir un lote de registros desde el CSV
  async function addProductionBatch(records) {
    loading.value = true
    error.value = null
    try {
      const { data, error: insertError } = await supabase
        .from('produccion')
        .insert(records)
        .select() // Devuelve los registros insertados

      if (insertError) throw insertError
      
      // Añade los nuevos registros al principio de la lista sin recargar todo
      productionRecords.value.unshift(...data)
      return { success: true, count: data.length }
    } catch (e) {
      error.value = e.message
      console.error("Error inserting production data:", e)
      return { success: false, error: e.message }
    } finally {
      loading.value = false
    }
  }

  return { productionRecords, loading, error, fetchProduction, addProductionBatch }
})