import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import MatchDetails from '@/components/MatchDetails.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/match/:id',
    name: 'MatchDetails',
    component: MatchDetails,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
