import type { RouteRecordRaw } from 'vue-router'
import ProductAdminForm from '@/features/admin/views/product/ProductAdminForm.vue'
import ProductAdminList from '@/features/admin/views/product/ProductAdminList.vue'
const CommandAdminList = () => import('@/features/admin/views/command/CommandAdminList.vue')

export const ADMIN_ROUTES: RouteRecordRaw[] = [
  {
    path: '',
    redirect: '/admin/product-form',
  },
  {
    path: '/product-form',
    component: ProductAdminForm,
    meta: {
      requiresAdmin: true,
    },
  },
  {
    path: '/product-list',
    component: ProductAdminList,
    meta: {
      requiresAdmin: true,
    },
  },
  {
    path: '/command/list',
    component: CommandAdminList,
    meta: {
      requiresAdmin: true,
    },
  },
]
