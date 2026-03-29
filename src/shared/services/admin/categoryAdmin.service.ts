import axios from 'axios'
import type { CategoryInterface } from '@/shared/interfaces'

const BASE_URL = import.meta.env.VITE_APP_API_URL as string

export async function axiosGetCategoryAdmin(): Promise<CategoryInterface[] | CategoryInterface> {
  try {
    const response = await axios.get(`${BASE_URL}/api/admin/categories/list`)
    if (response.status >= 200 && response.status < 300) {
      return response.data
    } else {
      throw new Error('error recovery products')
    }
  } catch(e) {
    console.log(e)
    throw e
  }
}
