import { defineStore } from 'pinia'
import { axiosAddCommandUser, axiosGetCommandUser, axiosGetCommandUserList, axiosGetCurrentUserId,
  axiosRemoveCommandUser
} from '@/shared/services/user/command.service.ts'

export const useCommandUserStore = defineStore('commandUser', {
  state: () => ({
    currentCommand: [],
    currentCommandId: 0,
    command: [],
    isLoading: true,
  }),
  actions: {
    async getCommandUser() {
      try {
        this.isLoading = true

        const response = await axiosGetCommandUser()
        const command = Array.isArray(response) ? response : [response]
        this.currentCommand = command
        this.currentCommandId = this.currentCommand[0].id

        return command
      } catch (e) {
        this.currentCommand = []
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
    async getCommandUserList() {
      try {
        this.isLoading = true
        const response = await axiosGetCommandUserList()
        const commands = Array.isArray(response) ? response : []
        this.command = commands
        return response
      } catch (e) {
        this.command = []
        console.error(e)
      } finally {
        this.isLoading = false
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
    }
  }
})
