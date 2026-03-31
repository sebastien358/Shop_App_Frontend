import { defineStore } from 'pinia'
import { axiosAddCommandUser, axiosGetCommandUserList, axiosGetCurrentUserId,
  axiosRemoveCommandUser
} from '@/shared/services/user/command.service.ts'

export const useCommandUserStore = defineStore('commandUser', {
  state: () => ({
    currentCommandId: 0,
    command: [],
    isLoading: true,
    total: 0,
    pages: 0,
  }),
  actions: {
    async getCommandUser(currentPage: number, itemPerPage: number) {
      try {
        this.isLoading = true

        const response = await axiosGetCommandUserList(currentPage, itemPerPage)

        const data = response || { commands: [], total: 0, pages: 0 }

        this.command = data.commands
        this.total = data.total
        this.pages = data.pages

        this.currentCommandId = data.commands.id

        return data
      } catch (e) {
        this.command = []
        this.total = 0
        this.pages = 0
        this.currentCommandId = 0
        console.error(e)
      } finally {
        this.isLoading = false
      }
    },
    async addCommandAddress(dataAddress) {
      try {
        const response = await axiosAddCommandUser(dataAddress)
        this.command.push(response)
        return response
      } catch (e) {
        console.error(e)
      }
    },
    async getCurrentCommand(id: number) {
      try {
        return await axiosGetCurrentUserId(id)
      } catch (e) {
        console.error(e)
        throw e
      }
    },
    async removeCommand(id: number) {
      try {
        const response = await axiosRemoveCommandUser(id)
        this.command = this.command.filter((command) => command.id !== id)
        return response
      } catch (e) {
        console.error(e)
        throw e
      }
    },
  },
})
