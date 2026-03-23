import { defineStore } from 'pinia'
import {
  axiosEmailExistingLogin,
  axiosLogin,
  axiosRegister,
  axiosRequestPassword,
  axiosResetPassword,
} from '@/shared/services/auth.service.ts'
import {
  axiosEditUser,
  axiosGetCurrentUserId,
  axiosMeInfo,
} from '@/shared/services/user/user.service.ts'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: '',
    isLoggedIn: false,
    roles: '',
    user: '',
    userId: 0,
  }),
  getters: {
    isAdmin: (state) => (state.roles || '').includes('ROLE_ADMIN'),
    isUser: (state) => (state.roles || '').includes('ROLE_USER'),
  },
  actions: {
    async login(dataLogin: Object) {
      try {
        const response = await axiosLogin(dataLogin)
        if (!response || !response.token) {
          this.token = ''
          this.isLoggedIn = false
          return
        }
        this.token = response.token
        this.isLoggedIn = true
        await this.infoMe()
      } catch (e) {
        this.token = ''
        this.isLoggedIn = false
        console.error(e)
      }
    },
    async infoMe() {
      try {
        const response = await axiosMeInfo()
        if (!response || !response.roles) {
          this.roles = ''
          this.user = ''
          this.userId = 0
        }
        this.roles = response.roles
        this.user = response
        this.userId = this.user.id
      } catch (e) {
        this.roles = ''
        this.user = ''
        this.userId = 0
        console.error(e)
      }
    },
    async getCurrentUserId(id: number) {
      try {
        return await axiosGetCurrentUserId(id)
      } catch (e) {
        console.error(e)
      }
    },
    async register(dataRegister) {
      try {
        return await axiosRegister(dataRegister)
      } catch (e) {
        console.error(e)
        throw e
      }
    },
    async editAccountUser(dataAccountUser, id: number) {
      try {
        return await axiosEditUser(dataAccountUser, id)
      } catch (e) {
        console.error(e)
        throw e
      }
    },
    async emailExistingLogin(dataLogin) {
      try {
        return await axiosEmailExistingLogin(dataLogin)
      } catch (e) {
        console.error(e)
        throw e
      }
    },
    async requestPassword(dataRequestPassword) {
      try {
        return await axiosRequestPassword(dataRequestPassword)
      } catch (e) {
        console.error(e)
        throw e
      }
    },
    async resetPassword(dataResetPassword, token) {
      try {
        return await axiosResetPassword(dataResetPassword, token)
      } catch (e) {
        console.error(e)
        throw e
      }
    },
    logout() {
      this.token = ''
      this.isLoggedIn = false
      this.roles = ''
      this.user = ''
    },
  },

  persist: {
    key: 'auth',
    storage: localStorage,
    paths: ['token', 'roles', 'isLoggedIn', 'user', 'userId'],
  },
})
