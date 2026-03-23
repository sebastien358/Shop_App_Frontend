import axios from 'axios'

const BASE_URL = 'http://localhost:8000'

export async function axiosMeInfo() {
  try {
    const response = await axios.get(`${BASE_URL}/api/user/account/me`)
    if (response.status >= 200 && response.status < 300) {
      return response.data
    }

    throw new Error(`Error recovery user info : ${response.status}`)
  } catch (e) {
    console.error(e)
    throw e
  }
}

export async function axiosGetCurrentUserId(id: number) {
  try {
    const response = await axios.get(`${BASE_URL}/api/user/account/${id}`)
    if (response.status >= 200 && response.status < 300) {
      return response.data
    } else {
      throw new Error('Error recovery user info')
    }
  } catch (e) {
    console.error(e)
    throw e
  }
}

export async function axiosEditUser(dataAccountUser, id: number) {
  try {
    const response = await axios.patch(`${BASE_URL}/api/user/account/edit/${id}`, {
      email: dataAccountUser.email,
      password: dataAccountUser.password,
    })

    if (response.status >= 200 && response.status < 300) {
      return response.data
    }

    throw new Error(`Erreur modification données utilisateur : ${response.status}`)
  } catch (e) {
    console.error(e)
    throw e
  }
}
