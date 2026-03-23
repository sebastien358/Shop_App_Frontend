<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import AlertMessage from '@/templates/alertMessage/AlertMessage.vue'
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/authStore.ts'
import { useRoute } from 'vue-router'
import * as z from 'zod'

const authStore = useAuthStore()

const route = useRoute()

const schema = z
  .object({
    email: z.string({ message: 'Email requis' }).email({ message: "L'email n'est pas valide" }),
    password: z.string({ message: 'Mot de passe requis' }).nullable(),
    passwordConfirm: z.string({ message: 'Confirmation de mot de passe requise' }).nullable(),
  })
  .refine((value) => value.password === value.passwordConfirm, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['passwordConfirm'],
  })

const initialValues = {
  email: '',
  password: '',
  passwordConfirm: '',
}

onMounted(async () => {
  try {
    const id = Number(route.params.id)
    if (!id) return

    const data = await authStore.getCurrentUserId(id)
    if (!data) return

    setValues({
      email: data.email,
    })
  } catch (e) {
    console.log(e)
  }
})

const { handleSubmit, isSubmitting, setValues } = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues,
})

const MESSAGES = {
  SUCCESS_EDIT_USER: 'Modification réussie',
  ERROR_EDIT_USER: 'La modification a échouée',
}

const { value: email, errorMessage: errorEmail } = useField<string>('email')
const { value: password, errorMessage: errorPassword } = useField<string>('password')
const { value: passwordConfirm, errorMessage: errorPasswordConfirm } =
  useField<string>('passwordConfirm')

const onSubmit = handleSubmit(async (data) => {
  try {
    const dataAccountUser = {
      email: data.email,
    }

    if (data.password) {
      dataAccountUser.password = data.password
    }

    const response = await authStore.editAccountUser(dataAccountUser, route.params.id)
    if (!response) {
      setErrorMessage(MESSAGES.ERROR_EDIT_USER)
      return
    }
    setSuccessMessage(MESSAGES.SUCCESS_EDIT_USER, null)
  } catch (e) {
    const apiError = e?.response?.data
    if (apiError.type === 'ACCOUNT_EDIT_USER') {
      setErrorMessage(apiError.message)
      return
    }
    setErrorMessage('Une erreur est survenue')
  }
})

const successMessage = ref<string | null>(null)
const errorMessage = ref<string | null>(null)

let reset = () => {}

const setSuccessMessage = (msg: string, resetForm: () => void) => {
  successMessage.value = msg
  errorMessage.value = null
  reset = resetForm
}

const setErrorMessage = (msg: string) => {
  errorMessage.value = msg
  successMessage.value = null
}

const closeAlert = () => {
  successMessage.value = null
  errorMessage.value = null
}

const handleResetForm = () => {
  closeAlert()
  reset()
}

const fields = [
  { label: 'Email', type: 'text', value: email, errorMessage: errorEmail },
  { label: 'Mot de passe', type: 'password', value: password, errorMessage: errorPassword },
  {
    label: 'Confirmation de mot de passe',
    type: 'password',
    value: passwordConfirm,
    errorMessage: errorPasswordConfirm,
  },
]
</script>

<template>
  <!-- loading -->
  <section v-if="!authStore.isLoggedIn" class="spinner">
    <span class="loader"></span>
  </section>
  <!-- Formulaire de crétion d'un utlisateur -->
  <section v-else class="d-flex align-items-center justify-content-center register">
    <div class="container-form">
      <h3>Modifier mes données</h3>
      <form @submit.prevent="onSubmit">
        <div v-for="(field, index) in fields" :key="index">
          <div class="d-flex flex-column form-group">
            <label>{{ field.label }}</label>
            <input v-model="field.value.value" :type="field.type" />
          </div>
          <span v-if="field.errorMessage" class="error-field">
            {{ field.errorMessage }}
          </span>
        </div>
        <!-- Gestion messages de validations -->
        <div class="text-center">
          <AlertMessage
            v-if="successMessage"
            :message="successMessage"
            type="success"
            :redirectTo="null"
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
        <!-- Bouton de soumission formulaire -->
        <button class="btn btn-primary" :disabled="isSubmitting">
          <span v-if="isSubmitting">Chargement...</span>
          <span v-else>Soumettre</span>
        </button>
      </form>
    </div>
  </section>
</template>

<style scoped lang="scss">
/* SPINNER */

.spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  .loader {
    width: 35px;
    height: 35px;
    border: 5px solid black;
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
  }
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* register */

.register {
  height: calc(100vh - 96px);
  padding: 10px;
  .container-form {
    max-width: 440px;
    padding: 22px 15px 10px 15px;
    h3 {
      text-align: center;
    }
    .alert-message {
      margin: 10px 0 4px 0;
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
    button {
      margin-top: 6px;
    }
  }
  .container-button {
    margin-top: 6px;
    .router-login {
      font-size: 11px;
      text-decoration: underline;
      color: var(--gray-3);
      transition: all 150ms ease;
    }
    .router-login {
      &:hover {
        color: var(--success-2);
      }
    }
  }
}
</style>
