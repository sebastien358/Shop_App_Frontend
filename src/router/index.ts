import { createRouter, createWebHistory } from 'vue-router'
import Boutique from '@/features/boutique/Boutique.vue'
import Register from '@/features/boutique/components/auth/Register.vue'
import Login from '@/features/boutique/components/auth/Login.vue'
import { useAuthStore } from '@/stores/authStore.ts'
import Admin from '@/features/admin/Admin.vue'
import { ADMIN_ROUTES } from '@/features/admin/routes.admin.ts'
import RequestPassword from '@/features/boutique/components/auth/reset-password/RequestPassword.vue'
import ResetPassword from '@/features/boutique/components/auth/reset-password/ResetPassword.vue'
import CommandAddress from '@/features/user/components/command/CommandAddress.vue'
import Payment from '@/features/user/components/command/CommandPayment.vue'
import Finish from '@/features/user/components/command/CommandFinish.vue'
import CommandUserList from '@/features/user/components/profile/CommandUserList.vue'
const AccountUserEdit = () => import('@/features/user/components/profile/AccountUserEdit.vue')


const routes = [
  { path: '/', redirect: '/boutique' },
  { path: '/boutique', component: Boutique },
  { path: '/register', name: 'register', component: Register },
  { path: '/login', name: 'login', component: Login },
  { path: '/request-password', component: RequestPassword },
  { path: '/reset-password/:token', component: ResetPassword },
  {
    path: '/command-address',
    component: CommandAddress,
  },
  {
    path: '/payment',
    component: Payment,
    meta: {
      requiresUser: true,
    },
  },
  {
    path: '/finish',
    component: Finish,
    meta: {
      requiresUser: true,
    },
  },
  {
    path: '/command/user/list',
    component: CommandUserList,
    meta: {
      requiresUser: true,
    },
  },
  {
    path: '/account/user/edit/:id',
    name: 'account-user-edit',
    component: AccountUserEdit,
    meta: {
      requiresUser: true,
    },
  },
  {
    path: '/admin',
    name: 'admin',
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
    },
    component: Admin,
    children: ADMIN_ROUTES,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.matched.some(route => route.meta.requiresAuth) && !authStore.isLoggedIn) {
    next({ path: '/login' })
  } else if (to.matched.some((route) => route.meta.requiresAdmin) && !authStore.isAdmin) {
    next({ path: '/' })
  } else if (to.matched.some((route) => route.meta.requiresUser) && !authStore.isUser) {
    next({ path: '/' })
  } else {
    next()
  }
})

export default router
