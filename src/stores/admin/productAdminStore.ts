import { defineStore } from 'pinia'
import { axiosAddProductAdmin, axiosdeleteProductAdmin, axiosGetProductAdmin } from '@/shared/services/admin/productAdmin.service.ts'
import { useProductStore } from '@/stores/productStore.ts'
import type { ProductFormInterface, ProductInterface } from '@/shared/interfaces'

interface ProductAdminState {
  product: ProductInterface[],
  countProduct: number
}

export const useProductAdminStore = defineStore('productAdmin', {
  state: (): ProductAdminState => ({
    product: [],
    countProduct: 0
  }),
  actions: {
    async getAdminProducts(currentPage: number, itemPerPage: number): Promise<void> {
      try {
        const response = await axiosGetProductAdmin(currentPage, itemPerPage)
        if (response) {
          const products: ProductInterface[] = response.products
          this.product = products
          this.countProduct = response.total
        } else {
           console.log('La response est vide')
        }
      } catch(e) {
        console.error(e)
      }
    },
    async addAdminProduct(dataProduct: ProductFormInterface): Promise<void> {
      try {
        const { title, price, description, category, images } = dataProduct

        const formData = new FormData()

        formData.append('title', title)
        formData.append('price', price)
        formData.append('description', description)
        formData.append('category', category)

        if (images && images.length > 0) {
          images.forEach((image) => {
            formData.append('images[]', image)
          })
        }

        const productStore = useProductStore()

        const response = await axiosAddProductAdmin(formData)
        if (response) {
          productStore.product.push(response)
          this.product.push(response)
          return
        }
      } catch(e) {
        console.error(e)
      }
    },
    async deleteProduct(id: ProductInterface) {
      try {
        const response = await axiosdeleteProductAdmin(id)
        if (response) {
          this.product = this.product.filter((p) => p.id !== id)
          await this.getAdminProducts()
        }
      } catch(e) {
        console.error(e)
      }
    }
  }
})
