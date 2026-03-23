import axios from 'axios'
import { useAuthStore } from '@/stores/authStore.ts'
import { useRouter } from 'vue-router'

const BASE_URL = 'http://localhost:8000'

export async function axiosLogin(dataLogin) {
  try {
    const response = await axios.post(`${BASE_URL}/api/login_check`, {
      username: dataLogin.email,
      password: dataLogin.password
    })
    if (response.status >= 200 && response.status < 300) {
      return response.data
    }

    throw new Error(`Erreur registration user : ${response.status}`)
  } catch(e) {
    console.error(e)
    throw e
  }
}

export async function axiosEmailExistingLogin(dataLogin) {
  try {
    const response = await axios.post(`${BASE_URL}/api/user/email/existing`, {
      email: dataLogin.email
    })
    if (response.status >= 200 && response.status < 300) {
      return response.data
    }

    throw new Error(`Erreur email existing login user :  ${response.status}`)
  } catch(e) {
    console.error(e)
    throw e
  }
}

export async function axiosRegister(dataRegister) {
  try {
    const response = await axios.post(`${BASE_URL}/api/register`, {
      email: dataRegister.email,
      password: dataRegister.password,
    })
    if (response.status >= 200 && response.status < 300) {
      return response.data
    }

    throw new Error(`Erreur registration user : ${response.status}`)
  } catch (e) {
    console.error(e)
    throw e
  }
}

export async function axiosRequestPassword(email: string) {
  try {
    const response = await axios.post(`${BASE_URL}/api/user/request-password`, {
      email: email
    })
    if (response.status >= 200 && response.status < 300) {
      return response.data
    }

    throw new Error(`Erreur notification email reset password : ${response.status}`)
  } catch(e) {
    console.error(e)
    throw e
  }
}

export async function axiosResetPassword(dataResetPassword, token) {
  try {
    const response = await axios.post(`${BASE_URL}/api/user/reset-password/${token}`, {
      password: dataResetPassword.password
    })
    if (response.status >= 200 && response.status < 300) {
      return response.data
    }

    throw new Error(`Error reset password : ${response.status}`)
  } catch(e) {
    console.error(e)
    throw e
  }
}

// REQUEST
axios.interceptors.request.use((config) => {
    const authStore = useAuthStore()
    const token = authStore.token

    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      }
    }

    return config
  },
  (error) => Promise.reject(error),
)

const router = useRouter()

// RESPONSE
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const authStore = useAuthStore()

    const hasAuthHeader = Boolean(
      error.config?.headers?.Authorization ||
      error.config?.headers?.authorization
    )

    if (error.response?.status === 401 && hasAuthHeader) {
      authStore.logout()
      router.push({ path: '/boutique' })
    }

    return Promise.reject(error)
  }
)



