<script setup lang="ts">
import AlertMessage from '@/templates/alertMessage/AlertMessage.vue'
import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useAuthStore } from '@/stores/authStore.ts'
import { ref } from 'vue'
import * as z from 'zod'

const authStore = useAuthStore()

const schema = z.object({
  email: z
    .string({ message: 'Veuillez renseigner votre adresse e-mail' })
    .email({ message: "L'email n'est pas valide" }),
})

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(schema),
})

const { value: email, errorMessage: errorEmail } = useField('email')

const MESSAGES = {
  SUCCESS_RESET_PASSWORD: 'Le mot de passe a été modifié',
  ERROR_RESET_PASSWORD: 'Une erreur est survenue',
}

const onSubmit = handleSubmit(async (dataRequestPassword, { resetForm }) => {
  try {
    const response = await authStore.requestPassword(dataRequestPassword)
    if (!response) {
      setErrorMessage(MESSAGES.ERROR_RESET_PASSWORD)
      return
    }

    setSuccessMessage(MESSAGES.SUCCESS_RESET_PASSWORD, resetForm)
  } catch (e: any) {
    const apiError = e?.response?.data

    if (apiError?.type === 'REQUEST-PASSWORD') {
      setErrorMessage(apiError.message)
      return
    }

    setErrorMessage(MESSAGES.ERROR_RESET_PASSWORD)
  }
})
const successMessage = ref<string | null>(null)
const errorMessage = ref<string | null>(null)

let reset = () => {}

function setSuccessMessage(message: string, resetForm: () => void) {
  successMessage.value = message
  reset = resetForm
}

function setErrorMessage(message: string) {
  errorMessage.value = message
}

function closeAlert() {
  successMessage.value = ''
  errorMessage.value = ''
}

function handleResetForm() {
  closeAlert()
  reset()
}
</script>

<template>
  <div class="d-flex align-items-center justify-content-center request-password">
    <!-- Form request password -->
    <div class="container-form">
      <form @submit.prevent="onSubmit">
        <div class="d-flex flex-column form-group">
          <label for="email">Email</label>
          <input v-model="email" type="text" name="email" />
          <span v-if="errorEmail" class="error-field">{{ errorEmail }}</span>
        </div>
        <!-- Gestion messages de la validations -->
        <div class="text-center">
          <AlertMessage
            v-if="successMessage"
            :message="successMessage"
            type="success"
            redirectTo=""
            @close="handleResetForm()"
            class="alert-message"
          />
          <AlertMessage
            v-if="errorMessage"
            :message="errorMessage"
            type="error"
            redirectTo=""
            @close="closeAlert()"
            class="alert-message"
          />
        </div>
        <button class="btn btn-primary" :disabled="isSubmitting">
          <span v-if="isSubmitting">Chargement...</span>
          <span v-else>Réinitialiser le mot de passe</span>
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped lang="scss">
.request-password {
  height: 100%;
  padding: 10px;
}

.container-form {
  width: 100%;
  max-width: 500px;
  padding: 15px 10px 10px 10px;
  button {
    margin-top: 5px;
    font-size: 10px;
  }
  .form-group {
    input {
      border: var(--border);
      border-radius: var(--border-radius);
      outline: none;
    }
    label {
      margin-bottom: 4px;
    }
  }
  .alert-message {
    margin-top: 10px;
    margin-bottom: 5px;
  }
}
</style>
