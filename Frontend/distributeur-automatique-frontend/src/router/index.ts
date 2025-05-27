import { createRouter, createWebHistory } from 'vue-router'
import DistributeurView from '@/views/DistributeurView.vue'
import ConfirmationView from '@/views/ConfirmationView.vue'
import { useDistributeurStore } from '@/stores/distributeurStore'
import type { RouteLocationNormalized } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'distributeur',
    component: DistributeurView
  },
  {
    path: '/confirmation',
    name: 'confirmation',
    component: ConfirmationView,
    beforeEnter: (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
      const store = useDistributeurStore()
      if (!store.transaction) {
        return { path: '/' } // Redirige si pas de transaction
      }
      return true
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
