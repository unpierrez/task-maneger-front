import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../pages/LoginPage.vue'
import RegisterPage from '../pages/RegisterPage.vue'
import DashboardPage from '../pages/DashboardPage.vue' 

const routes = [
  { path: '/', name: 'login', component: LoginPage },
  { path: '/register', name: 'register', component: RegisterPage },
  { path: '/dashboard', name: 'dashboard', component: DashboardPage }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('user'))

  const isUnauthenticated = !user

  const publicPages = ['login', 'register']

  if (isUnauthenticated && !publicPages.includes(to.name)) {
     next({ name: 'login' })
  } 

  if (!isUnauthenticated && publicPages.includes(to.name)) {
     next({ name: 'dashboard' })
  }
   else next()
})
