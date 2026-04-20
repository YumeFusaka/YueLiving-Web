import { createRouter, createWebHashHistory } from 'vue-router'
import { useUserStore } from '@/stores/modules/user'

type AppRouteMeta = {
  requiresAuth: boolean
  roles?: number[]
}

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login.vue'),
      meta: { requiresAuth: false } satisfies AppRouteMeta
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/views/Register.vue'),
      meta: { requiresAuth: false } satisfies AppRouteMeta
    },
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/Home.vue'),
      meta: { requiresAuth: true } satisfies AppRouteMeta,
      children: [
        {
          path: '',
          name: 'Dashboard',
          component: () => import('@/views/Dashboard.vue'),
          meta: { requiresAuth: true } satisfies AppRouteMeta
        },
        {
          path: '/property',
          name: 'Property',
          component: () => import('@/views/Property.vue'),
          meta: { requiresAuth: true } satisfies AppRouteMeta
        },
        {
          path: '/bill',
          name: 'Bill',
          component: () => import('@/views/Bill.vue'),
          meta: { requiresAuth: true } satisfies AppRouteMeta
        },
        {
          path: '/repair',
          name: 'Repair',
          component: () => import('@/views/Repair.vue'),
          meta: { requiresAuth: true } satisfies AppRouteMeta
        },
        {
          path: '/announcement',
          name: 'Announcement',
          component: () => import('@/views/Announcement.vue'),
          meta: { requiresAuth: true } satisfies AppRouteMeta
        },
        {
          path: '/profile',
          name: 'Profile',
          component: () => import('@/views/Profile.vue'),
          meta: { requiresAuth: true } satisfies AppRouteMeta
        },
        {
          path: '/user',
          name: 'User',
          component: () => import('@/views/User.vue'),
          meta: { requiresAuth: true, roles: [2, 3] } satisfies AppRouteMeta
        },
      ]
    }
  ],
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const meta = (to.meta ?? {}) as AppRouteMeta

  if (meta.requiresAuth && !userStore.isLoggedIn()) {
    next('/login')
  } else if (meta.roles && !userStore.hasAnyRole(meta.roles)) {
    next('/')
  } else {
    next()
  }
})

export default router
