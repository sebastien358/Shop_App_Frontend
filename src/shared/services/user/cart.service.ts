import axios from 'axios'
import type { CartItemInterface, CartProductInterface } from '@/shared/interfaces'

const BASE_URL = 'http://localhost:8000'

export async function axiosGetProductToCart(): Promise<CartProductInterface[] | CartProductInterface> {
  try {
    const response = await axios.get(`${BASE_URL}/api/cart/items/list`)
    if (response.status >= 200 && response.status < 300) {
      return response.data
    }

    throw new Error(`Error cart to items: ${response.status}`)
  } catch(e) {
    console.error(e)
    throw e
  }
}

export async function axiosAddProductToCart(itemToCart: CartItemInterface): Promise<CartItemInterface> {
  try {
    const response = await axios.post(`${BASE_URL}/api/cart/to/items`, itemToCart)
    if (response.status >= 200 && response.status < 300) {
      return response.data
    }

    throw new Error(`Error add product to cart: ${response.status}`)
  } catch(e) {
    console.error(e)
    throw e
  }
}

export async function axiosAddItemToCart(id: number): Promise<CartProductInterface> {
  try {
    const response = await axios.post(`${BASE_URL}/api/cart/add/item/${id}`)
    if (response.status >= 200 && response.status < 300) {
      return response.data
    }

    throw new Error(`Error add item to cart: ${response.status}`)
  } catch(e) {
    console.error(e)
    throw e
  }
}

export async function axiosDeleteItemToCart(id: number): Promise<CartProductInterface> {
  try {
    const response = await axios.delete(`${BASE_URL}/api/cart/delete/item/${id}`)
    if (response.status === 200 || response.status === 204) {
      return response.data
    }

    throw new Error(`Error delete item to cart: ${response.status}`)
  } catch(e) {
    console.error(e)
    throw e
  }
}
