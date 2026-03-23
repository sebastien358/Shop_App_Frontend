import { defineStore } from 'pinia'
import { axiosGetCategoryAdmin } from '@/shared/services/admin/categoryAdmin.service.ts'

export const useCategoryAdminStore = defineStore('categoryAdmin', {
  state: () => ({
    category: []
  }),
  actions: {
    async getAdminCategories() {
      try {
        const response = await axiosGetCategoryAdmin()
        if (response) {
          this.category = Array.isArray(response) ? response : [response]
        } else {
          console.log('La response est nulle')
        }
      } catch(e) {
        console.log(e)
      }
    }
  }
})
