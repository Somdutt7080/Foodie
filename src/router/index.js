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
  { path: '/', 
    name: 'Home', 
    component: Home 
  },

  { path: '/login', 
    name: 'Login', 
    component: Login 
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    meta: { requiresAuth: true }
  },
  {
    path: '/meal/:id',
    name: 'MealDetail',
    component: MealDetail
  },
  {
    path: '/by-letter',
    name: 'ByLetter',
    component: ByLetter
  },
  {
    path:'/search',
    name:'Search',
    component : Search
  },
  {
    path:'/ingredient',
    name:'Ingredient',
    component : Ingredients
  }
  
]
const router = createRouter({
  history: createWebHistory(),
  routes,
})
// :closed_lock_with_key: Navigation Guard
router.beforeEach((to, from, next) => {
  const user = auth.currentUser
  if (to.matched.some(record => record.meta.requiresAuth) && !user) {
    next('/login')
  } else {
    next()
  }
})
export default router












