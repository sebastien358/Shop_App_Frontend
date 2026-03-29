import axios from 'axios'

const BASE_URL = import.meta.env.VITE_APP_API_URL as string

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

export async function axiosAdminRemoveCommand(id: number) {
  try {
    const response = await axios.delete(`${BASE_URL}/api/admin/command/delete/${id}`)
    if (response.status === 200 || response.status === 204) {
      return response.data ?? true
    }
    throw new Error(`Erreur de la suppression de la commande : ${response.status}`)
  } catch(e) {
    console.error(e)
    throw e
  }
}
