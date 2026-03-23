import axios from 'axios'

const BASE_URL = 'http://localhost:8000'

export async function axiosAdminCommandList() {
  try {
    const response = await axios.get(`${BASE_URL}/api/admin/command/list`)
    if (response.status >= 200 && response.status < 300) {
      return response.data
    }

    throw new Error(`Erreur de la récupération des commandes : ${response.status}`);
  } catch (e) {
    console.error(e)
    throw e
  }
}

export async function axiosAdminPreparationStatus(id: number, preparationStatus: string) {
  try {
    const response = await axios.get(`${BASE_URL}/api/admin/command/${id}/preparation/${preparationStatus}`)
    if (response.status >= 200 && response.status < 300) {
      return response.data
    }

    throw new Error(`Erreur status de la préparation : ${response.status}`)
  } catch(e) {
    console.error(e)
    throw e
  }
}
