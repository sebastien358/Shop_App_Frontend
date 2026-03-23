import { defineStore } from 'pinia'
import { axiosAdminCommandList, axiosAdminPreparationStatus } from '@/shared/services/admin/commandAdmin.service.ts'

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
      const command = this.commands.find((c) => c.id === id)

      if (command) {
        const oldStatus = command.preparationStatus
        command.preparationStatus = preparationStatus

        try {
          await axiosAdminPreparationStatus(id, preparationStatus)
        } catch (e) {
          command.preparationStatus = oldStatus // rollback si erreur
        }
      }
    },
  },
})
