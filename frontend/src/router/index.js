import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/pages/Home.vue')
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/pages/Dashboard.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'builder/:id',
        name: 'Builder',
        component: () => import('@/pages/Builder.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'builder/new',
        name: 'BuilderNew',
        component: () => import('@/pages/Builder.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/pages/Profile.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'keyword-analysis/:id',
        name: 'KeywordAnalysis',
        component: () => import('@/pages/KeywordAnalysis.vue'),
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: '/auth',
    component: () => import('@/layouts/AuthLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/pages/Login.vue'),
        meta: { guestOnly: true }
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('@/pages/Register.vue'),
        meta: { guestOnly: true }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  }
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next({ name: 'Login' })
  }

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return next({ name: 'Dashboard' })
  }

  next()
})

export default router
