import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../pages/LoginPage.vue'
import DashboardPage from '../pages/DashboardPage.vue' 

const routes = [
  { path: '/', name: 'login', component: LoginPage },
  { path: '/dashboard', name: 'dashboard', component: DashboardPage }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('user'))

  if (to.name !== 'login' && !user) next({ name: 'login' })
  else next()
})
