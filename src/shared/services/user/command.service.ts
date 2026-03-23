import axios from 'axios'

const BASE_URL = 'http://localhost:8000'

// Affichage de la commande au paiment

export async function axiosGetCommandUser() {
  try {
    const response = await axios.get(`${BASE_URL}/api/command/user`)
    if (response.status >= 200 && response.status < 300) {
      return response.data
    } else {
      throw new Error(`Error recovery command payment : ${response.status}`)
    }
  } catch(e) {
    console.log(e)
    throw e
  }
}

// Affichage de la liste des commandes d'un utilisateur

export async function axiosGetCommandUserList() {
  try {
    const response = await axios.get(`${BASE_URL}/api/command/user/list`)
    if (response.status >= 200 && response.status < 300) {
      return response.data
    }

    throw new Error(`Erreur de pa récupération des commandes d'un client : ${response.status}`)
  } catch(e) {
    console.log(e)
    throw e
  }
}

// Récupération des données utilisateur d'une commande

export async function axiosGetCurrentUserId(id: number) {
  try {
    const response = await axios.get(`${BASE_URL}/api/command/user/${id}`)
    if (response.status >= 200 || response.status < 300) {
      return response.data
    } else {
      throw new Error(`Error recovery command payment : ${response.status}`)
    }
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
    } else {
      throw new Error(`Erreur de l'ajout d'une commande : ${response.status}`)
    }
  } catch(e) {
    console.log(e)
    throw e
  }
}

export async function axiosRemoveCommandUser(id: number) {
  try {
    const response = await axios.delete(`${BASE_URL}/api/command/remove/${id}`)
    if (response.status === 200 || response.status === 204) {
      return response.data ?? true
    }

    throw new Error(`Erreur de la suppression d'une commande : ${response.status}`)
  } catch (e) {
    console.log(e)
    throw e
  }
}
