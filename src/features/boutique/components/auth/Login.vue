<script setup lang="ts">
import AlertMessage from '@/templates/alertMessage/AlertMessage.vue'
import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useAuthStore } from '@/stores/authStore.ts'
import * as z from 'zod'
import { ref } from 'vue'

const authStore = useAuthStore()

const schema = z.object({
  email: z
    .string({ message: 'Email requis' }).email({message: 'L\'email n\'est pas valide'}),
  password: z.string({ message: 'Mot de passe requis' }),
})

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(schema),
})

const { value: email, errorMessage: errorEmail } = useField('email')
const { value: password, errorMessage: errorPassword } = useField('password')

const MESSAGES = {
  SUCCESS_LOGIN: 'Vos êtes connecté',
  INVALID_CREDENTIALS: 'Identifiant ou mot de passe invalid',
  EMAIL_NOT_FOUND: "Aucun compte n'existe avec cet email"
}

const onSubmit = handleSubmit(async (dataLogin, { resetForm }) => {
  try {
    const response = await authStore.emailExistingLogin(dataLogin)
    if (response.exists) {
      await authStore.login(dataLogin)
      const isLoggedIn = authStore.isLoggedIn
      if (isLoggedIn) {
        setSuccessMessage(MESSAGES.SUCCESS_LOGIN, resetForm)
      } else {
        setErrorMessage(MESSAGES.INVALID_CREDENTIALS)
      }
    } else {
      setErrorMessage(MESSAGES.EMAIL_NOT_FOUND)
    }
  } catch (e) {
    console.error(e)
  }
})

// Messages validation form

const successMessage = ref<string>('')
const errorMessage = ref<string>('')

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

// Fields form

const fields = [
  { label: 'Email', for:'email', type: 'text', name: 'email', value: email, errorMessage: errorEmail },
  { label: 'Mot de passe', for: 'password', type: 'password',name: 'password', value: password, errorMessage: errorPassword },
]
</script>

<template>
  <div class="d-flex align-items-center justify-content-center login">
    <!-- Formulaire de connexion d'un utlisateur -->
    <div class="container-form">
      <h3>Se Connecter</h3>
      <form @submit.prevent="onSubmit">
        <div v-for="(field, index) in fields" :key="index">
          <div class="d-flex flex-column form-group">
            <label :for="field.for">{{ field.label }}</label>
            <input v-model="field.value.value" :type="fields.type" :name="field.name" />
          </div>
          <span v-if="field.errorMessage" class="error-field">
            {{ field.errorMessage }}
          </span>
        </div>
        <!-- Gestion messages de la validations -->
        <div class="text-center">
          <AlertMessage v-if="successMessage" :message="successMessage" type="success" redirectTo="/boutique" @close="handleResetForm()" class="alert-message" />
          <AlertMessage v-if="errorMessage" :message="errorMessage" type="error" redirectTo="" @close="closeAlert()" class="alert-message" />
        </div>
        <div class="d-flex align-items-center space-between container-button">
          <button class="btn btn-primary" :disabled="isSubmitting">Soumettre</button>
          <router-link to="/request-password" class="router-request-password">Mot de passe oublié?</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login {
  height: 100%;
  padding: 10px;
  .container-form {
    max-width: 440px;
    padding: 22px 15px 10px 15px;
    h3 {
      text-align: center
    }
    .form-group {
      margin-top: 15px;
    }
    label {
      margin-bottom: 3px;
      font-size: 12px;
    }
    input {
      padding: 9px;
      border: var(--border);
      border-radius: var(--border-radius);
    }
    .alert-message {
      margin: 10px 0 4px 0;
    }
    .container-button {
      margin-top: 6px;
      .router-request-password {
        font-size: 11px;
        text-decoration: underline;
        color: var(--gray-3);
        transition: all 150ms ease;
      }
      .router-request-password {
        &:hover {
          color: var(--success-2);
        }
      }
    }
  }
}
</style>
