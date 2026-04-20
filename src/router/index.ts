import { createRouter, createWebHashHistory } from 'vue-router'
import { useUserStore } from '@/stores/modules/user'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/views/Register.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/Home.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'Dashboard',
          component: () => import('@/views/Dashboard.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: '/property',
          name: 'Property',
          component: () => import('@/views/Property.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: '/bill',
          name: 'Bill',
          component: () => import('@/views/Bill.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: '/repair',
          name: 'Repair',
          component: () => import('@/views/Repair.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: '/announcement',
          name: 'Announcement',
          component: () => import('@/views/Announcement.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: '/profile',
          name: 'Profile',
          component: () => import('@/views/Profile.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: '/user',
          name: 'User',
          component: () => import('@/views/User.vue'),
          meta: { requiresAuth: true }
        },
      ]
    }
  ],
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  if (to.meta.requiresAuth && !userStore.isLoggedIn()) {
    next('/login')
  } else if (to.path === '/user' && !userStore.isSystemAdmin()) {
    next('/')
  } else {
    next()
  }
})

export default router
