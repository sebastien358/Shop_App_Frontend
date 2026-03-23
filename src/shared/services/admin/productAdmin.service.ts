import axios from 'axios'
import type { ProductFormInterface, ProductInterface } from '@/shared/interfaces'

const BASE_URL = 'http://localhost:8000'

export async function axiosGetProductAdmin(currentPage: number, itemPerPage: number): Promise<ProductInterface[] | ProductInterface> {
  try {
    const response = await axios.get(`${BASE_URL}/api/admin/product/list`, {
      params: {
        page: currentPage, 
        limit: itemPerPage
      }
    })
    return response.data
  } catch(e) {
    console.log(e)
    throw e
  }
}

export async function axiosAddProductAdmin(formData: ProductFormInterface): Promise<ProductFormInterface> {
  try {
    const response = await axios.post(`${BASE_URL}/api/admin/product/add`, formData)
    if (response.status >= 200 && response.status < 300) {
      return response.data
    } else {
      throw new Error(`error add product: ${response.status}`)
   }
  } catch(e) {
    console.log(e)
    throw e
  }
}

export async function axiosdeleteProductAdmin(id: ProductFormInterface): Promise<ProductFormInterface> {
  try {
    const response = await axios.delete(`${BASE_URL}/api/admin/product/delete/${id}`)
    if (response.status === 200 || response.status === 204) {
      return response.data
    } else {
      throw new Error(`error add product: ${response.status}`)
   }
  } catch(e) {
    console.log(e)
    throw e
  }
}

