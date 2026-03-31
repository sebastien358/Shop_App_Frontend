import { defineStore } from 'pinia'
import {
  axiosAddProductAdmin,
  axiosDeleteProductAdmin,
  axiosGetProductAdmin,
} from '@/shared/services/admin/productAdmin.service.ts'
import { useProductStore } from '@/stores/productStore.ts'
import type { ProductFormInterface, ProductInterface } from '@/shared/interfaces'

interface ProductAdminState {
  product: ProductInterface[]
  countProduct: number
  pages: number
}

export const useProductAdminStore = defineStore('productAdmin', {
  state: (): ProductAdminState => ({
    product: [],
    countProduct: 0,
    pages: 0,
  }),
  actions: {
    async getAdminProducts(currentPage: number, itemPerPage: number): Promise<void> {
      try {
        const response = await axiosGetProductAdmin(currentPage, itemPerPage)
        if (response) {
          const products = response.products
          this.product = products
          this.countProduct = response.total
          this.pages = response.pages
        } else {
          console.log('La response est vide')
        }
      } catch (e) {
        console.error(e)
      }
    },
    async addAdminProduct(dataProduct: ProductFormInterface): Promise<ProductInterface> {
      try {
        const formData = new FormData()
        formData.append('title', dataProduct.title)
        formData.append('price', String(dataProduct.price)) // assure le type string
        formData.append('description', dataProduct.description)
        formData.append('category', dataProduct.category)

        dataProduct.images?.forEach((image) => formData.append('images[]', image))

        const response: ProductInterface = await axiosAddProductAdmin(formData)

        const productStore = useProductStore()
        productStore.product.push(response)
        this.product.push(response)

        await productStore.getProduct()

        return response
      } catch (e) {
        console.error('Erreur addAdminProduct:', e)
        throw e
      }
    },
    async deleteProduct(id: ProductInterface) {
      try {
        await axiosDeleteProductAdmin(id)
        this.product = this.product.filter((p) => p.id !== id)
        await this.getAdminProducts()
      } catch (e) {
        console.error(e)
        throw e
      }
    },
  },
})
