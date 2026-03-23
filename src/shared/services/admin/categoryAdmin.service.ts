import axios from 'axios'
import type { CategoryInterface } from '@/shared/interfaces'

export async function axiosGetCategoryAdmin(): Promise<CategoryInterface[] | CategoryInterface> {
  try {
    const response = await axios.get('http://localhost:8000/api/admin/categories/list')
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
