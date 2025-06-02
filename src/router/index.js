import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Admin from '../views/Admin.vue'
import { auth } from '../plugins/firebase'
import MealDetail from '../views/MealDetail.vue'
import ByLetter from '../views/ByLetter.vue'
import Search from '../views/Search.vue'
import Ingredients from '../views/Ingredients.vue'
const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: Login },
  { path: '/home', name: 'Home', component: Home, meta: { requiresAuth: true } },
  { path: '/admin', name: 'Admin', component: Admin, meta: { requiresAuth: true } },
  { path: '/meal/:id', name: 'MealDetail', component: MealDetail, meta: { requiresAuth: true } },
  { path: '/by-letter', name: 'ByLetter', component: ByLetter, meta: { requiresAuth: true } },
  { path: '/search', name: 'Search', component: Search, meta: { requiresAuth: true } },
  { path: '/ingredient', name: 'Ingredient', component: Ingredients, meta: { requiresAuth: true } }
]
const router = createRouter({
  history: createWebHistory(),
  routes
})
// :white_check_mark: Navigation Guard with Admin check
router.beforeEach((to, from, next) => {
  const user = auth.currentUser
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isAdminRoute = to.path === '/admin'
  const role = localStorage.getItem('userRole')
  if (requiresAuth && !user) {
    next('/login')
  } else if (to.path === '/login' && user) {
    next('/home')
  } else if (isAdminRoute && role !== 'admin') {
    alert(':no_entry_sign: Access Denied: You are not an admin')
    next('/home')
  } else {
    next()
  }
})
export default router