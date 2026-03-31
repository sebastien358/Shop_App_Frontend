import { defineStore } from 'pinia'
import { axiosAdminCommandList, axiosAdminPreparationStatus, axiosAdminRemoveCommand } from '@/shared/services/admin/commandAdmin.service.ts'

export const useCommandAdminStore = defineStore('commandAdmin', {
  state: () => ({
    commands: [],
    isLoading: true,
  }),
  actions: {
    async commandAdminList() {
      try {
        this.isLoading = true

        const response = await axiosAdminCommandList()

        const commands = Array.isArray(response) ? response : []
        this.commands = commands
      } catch (e) {
        this.commands = []
        console.error(e)
        throw e
      } finally {
        this.isLoading = false
      }
    },
    async preparationStatus(id: number, preparationStatus: string) {
      try {
        const command = this.commands.find((c) => c.id === id)
        command.preparationStatus = preparationStatus
        await axiosAdminPreparationStatus(id, preparationStatus)
      } catch (e) {
        console.error(e)
      }
    },
    async removeCommand(id: number) {
      try {
        const response = await axiosAdminRemoveCommand(id)
        this.commands = this.commands.filter((c) => c.id !== id)
        return response
      } catch(e) {
        console.error(e)
        throw e
      }
    }
  }
})
