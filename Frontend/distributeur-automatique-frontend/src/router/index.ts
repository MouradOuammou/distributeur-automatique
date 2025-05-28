// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import DistributeurView from '@/views/DistributeurView.vue'
import ConfirmationView from '@/views/ConfirmationView.vue'

const routes = [
  {
    path: '/',
    name: 'distributeur',
    component: DistributeurView
  },
  {
    path: '/confirmation',
    name: 'confirmation',
    component: ConfirmationView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
