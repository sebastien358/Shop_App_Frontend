import axios from 'axios'

const BASE_URL = import.meta.env.VITE_APP_API_URL as string

// Affichage de la liste des commandes d'un utilisateur

export async function axiosGetCommandUserList(currentPage: number, itemPerPage: number) {
  try {
    const response = await axios.get(`${BASE_URL}/api/command/user/list`, {
      params: {
        page: currentPage,
        limit: itemPerPage
      }
    })
    return response.data
  } catch (e) {
    console.error(e)
    throw e
  }
}

// Récupération des données utilisateur d'une commande

export async function axiosGetCurrentUserId(id: number) {
  try {
    const response = await axios.get(`${BASE_URL}/api/command/user/${id}`)
    if (response.status >= 200 || response.status < 300) {
      return response.data
    }
    throw new Error(`Error recovery command payment : ${response.status}`)
  } catch(e) {
    console.log(e)
    throw e
  }
}

// Passer une commande utilidateur

export async function axiosAddCommandUser(dataAddress) {
  try {
    const response = await axios.post(`${BASE_URL}/api/command/add`, dataAddress)
    if (response.status >= 200 && response.status < 300) {
      return response.data
    }
    throw new Error(`Erreur de l'ajout d'une commande : ${response.status}`)
  } catch(e) {
    console.log(e)
    throw e
  }
}

// Suppression de la commande

export async function axiosRemoveCommandUser(id: number) {
  try {
    const response = await axios.delete(`${BASE_URL}/api/command/delete/${id}`)
    if (response.status === 200 || response.status === 204) {
      return response.data ?? true
    }
    throw new Error(`Erreur de la suppression d'une commande : ${response.status}`)
  } catch (e) {
    console.log(e)
    throw e
  }
}
