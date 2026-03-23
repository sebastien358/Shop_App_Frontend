import { defineStore } from 'pinia'
import {
  axiosAddItemToCart, axiosAddProductToCart,
  axiosDeleteItemToCart,
  axiosGetProductToCart,
} from '@/shared/services/user/cart.service.ts'
import type { CartProductInterface } from '@/shared/interfaces'
import { useProductStore } from '@/stores/productStore.ts'

interface CartProductState {
  cart: CartProductInterface[]
}

export const useCartStore = defineStore('cart', {
  state: (): CartProductState => ({
    cart: []
  }),
  getters: {
    itemsToCartExisting(state) {
      return state.cart.length > 0 ? '' : 'Le panier est vide...'
    },
    total(state) {
      return state.cart.reduce((acc, product) => (acc + product.price) * product.quantity, 0)
    }
  },
  actions: {
    saveCart() {
      localStorage.setItem('cart', JSON.stringify(this.cart))
    },
    async getProductToCart(): Promise<void> {
      try {
        const response = await axiosGetProductToCart()
        if (response) {
          this.cart = Array.isArray(response) ? response : [response]
        } else {
          console.log('La response est vide')
        }
      } catch(e) {
        console.error(e)
      }
    },
    async addProductToCart(id: number): Promise<void> {
      try {
        const productStore = useProductStore()
        const product = productStore.product.find((p) => p.id === id)
        if (product) {
          const itemToCart = {
            id: product.id,
            title: product.title,
            price: product.price,
            quantity: 1
          }
          await axiosAddProductToCart([itemToCart])
          await this.getProductToCart()
        }
      } catch(e) {
        console.error(e)
      }
    },
    async addItemToCart(id: number): Promise<void> {
      try {
        const product = this.cart.find((p) => p.id === id)
        if (product) {
          await axiosAddItemToCart(id)
          await this.getProductToCart()
        }
      } catch(e) {
        console.error(e)
      }
    },
    async deleteItemToCart(id: number): Promise<void> {
      try {
        const itemToCart = this.cart.find((p) => p.id === id)
        if (itemToCart) {
          await axiosDeleteItemToCart(id)
          await this.getProductToCart()
        }
      } catch(e) {
        console.error(e)
      }
    }
  },

  persist: {
    key: 'cart',
    storage: localStorage,
    paths: ['cart']
  }
})
