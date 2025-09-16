import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView
    },
    {
      path: '/produccion',
      name: 'produccion',
      component: () => import('../views/ProduccionView.vue')
    },
    {
      path: '/ventas',
      name: 'ventas',
      component: () => import('../views/VentasView.vue')
    },
    {
      path: '/consumos',
      name: 'consumos',
      component: () => import('../views/ConsumosView.vue')
    }
  ]
})

export default router