import { defineStore } from 'pinia'
import {
  axiosAddProductAdmin,
  axiosAdminCurrentProduct,
  axiosDeleteProductAdmin,
  axiosDeleteProductImage,
  axiosEditProductAdmin,
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
    async currentProduct(id: number) {
      try {
        return await axiosAdminCurrentProduct(id)
      } catch (e) {
        console.error(e)
        throw e
      }
    },
    async editProduct(dataProduct, id: number) {
      try {
        const formData = new FormData()
        formData.append('title', dataProduct.title)
        formData.append('price', String(dataProduct.price))
        formData.append('description', dataProduct.description)
        formData.append('category', dataProduct.category)
        dataProduct.images?.map((image) => formData.append('images[]', image))
        const product = await axiosEditProductAdmin(formData, id)
        // Met à jour le produit dans le store
        const index = this.product.findIndex((p) => p.id === id)
        if (index !== -1) {
          this.product[index] = { ...this.product[index], ...product }
        }
        await this.getAdminProducts() // Optionnel, si tu veux rafraîchir tout
        return product
      } catch (e) {
        console.error(e)
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
    async deleteProductImage(productId: number, imageId: number) {
      try {
        const response = await axiosDeleteProductImage(productId, imageId)
        await this.getAdminProducts()

        return response
      } catch (e) {
        console.error(e)
        throw e
      }
    },
  },
})
