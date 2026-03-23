<script setup lang="ts">
import CommandProgress from '@/templates/commandProgress/CommandProgress.vue'
import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import AlertMessage from '@/templates/alertMessage/AlertMessage.vue'
import { onMounted, ref } from 'vue'
import { useCommandUserStore } from '@/stores/user/commandUserStore.ts'
import { useRouter } from 'vue-router'
import * as z from 'zod'

// Récupération de la commande de l'utilisateur connecté

const commandUserStore = useCommandUserStore()
const router = useRouter()

onMounted(async () => {
  try {
    await commandUserStore.getCommandUser()
  } catch (e) {
    console.error(e)
  }
})

// Form Command

const schema = z.object({
  firstName: z.string({ message: 'Le prénom est requis' }),
  lastName: z.string({ message: 'Le nom est requis' }),
  address: z.string({ message: "L'adresse est requise" }),
  zipCode: z.string({ message: 'Le code postal est requis' }).regex(/^\d{5}$/, {
    message: 'Le code postal doit être composé de 5 chiffres',
  }),
  addressComplement: z.string().optional(),
  city: z.string({ message: 'La ville est requise' }),
  phoneNumber: z.string({ message: 'Le numéro de téléphone est requis' }).regex(/^0\d{9}$/, {
    message: 'Le numéro de téléphone doit être composé de 10 chiffres et commencer par 0',
  }),
  country: z.string({ message: 'Le pays est requis' }),
})

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(schema),
})

const { value: firstName, errorMessage: errorFirstName } = useField('firstName')
const { value: lastName, errorMessage: errorLastName } = useField('lastName')
const { value: address, errorMessage: errorAddress } = useField('address')
const { value: zipCode, errorMessage: errorZipCode } = useField('zipCode')
const { value: addressComplement, errorMessage: errorAddressComplement } =
  useField('addressComplement')
const { value: city, errorMessage: errorCity } = useField('city')
const { value: phoneNumber, errorMessage: errorPhoneNumber } = useField('phoneNumber')
const { value: country, errorMessage: errorCountry } = useField('country')

// MESSAGE FORM

const MESSAGES = {
  SUCCESS_ADDRESS: 'Vos données ont bien été enregistrées',
  INVALID_CREDENTIALS: "Vos données n'ont pas pu être enregistrées",
}

// STEP : PROGRESSION DE LA COMMANDE

const currentStep = ref<number>(2)

// FORM SUBMIT

const onSubmit = handleSubmit(async (dataAddress, { resetForm }) => {
  try {
    const response = await commandUserStore.addCommandAddress(dataAddress)
    if (!response) {
      setErrorMessage(MESSAGES.INVALID_CREDENTIALS)
      return
    }

    setSuccessMessage(MESSAGES.SUCCESS_ADDRESS, resetForm)
    currentStep.value = 3
  } catch (e) {
    console.error(e)
  }
})

// GESTION FORM : REDIRECTION ET MESSAGES

const successMessage = ref<string>('')
const errorMessage = ref<string>('')

let reset = () => {}

const setSuccessMessage = (message: string, resetForm: () => void) => {
  successMessage.value = message
  reset = resetForm
}

const setErrorMessage = (message: string) => {
  errorMessage.value = message
}

const closeAlert = () => {
  successMessage.value = ''
  errorMessage.value = ''
}

const handleResetForm = () => {
  closeAlert()
  reset()
}

// INPUTS FORM

const fields = [
  {
    label: 'Prénom',
    css: 'label-firstname',
    type: 'text',
    name: 'firstName',
    value: firstName,
    errorMessage: errorFirstName,
  },
  {
    label: 'Nom',
    css: 'label-lastname',
    type: 'text',
    name: 'lastName',
    value: lastName,
    errorMessage: errorLastName,
  },
  {
    label: 'Adresse (numéro et rue)',
    css: 'label-address',
    type: 'text',
    name: 'address',
    value: address,
    errorMessage: errorAddress,
  },
  {
    label: "Complément d'adresse (facultatif)",
    css: 'label-complement-address',
    type: 'text',
    name: 'addressComplement',
    value: addressComplement,
    errorMessage: errorAddressComplement,
  },
  {
    label: 'Code postal',
    css: 'label-zip-code',
    type: 'text',
    name: 'zipCode',
    value: zipCode,
    errorMessage: errorZipCode,
  },
  {
    label: 'Ville',
    css: 'label-city',
    type: 'text',
    name: 'city',
    value: city,
    errorMessage: errorCity,
  },
  {
    label: 'Téléphone',
    css: 'label-tel',
    type: 'tel',
    name: 'phoneNumber',
    value: phoneNumber,
    errorMessage: errorPhoneNumber,
  },
  {
    label: 'Pays',
    css: 'label-country',
    type: 'select',
    name: 'country',
    value: country,
    errorMessage: errorCountry,
  },
]
</script>

<template>
  <!-- Command progress -->
  <CommandProgress :currentStep="currentStep" />
  <!-- Form address command -->
  <section class="d-flex align-items-center justify-content-center address">
    <div class="container-form">
      <h2>Entrer vos données</h2>
      <form @submit.prevent="onSubmit">
        <div class="form-column">
          <div v-for="(field, index) in fields" :key="index">
            <div class="d-flex flex-column form-group">
              <label :class="field.css">{{ field.label }}</label>
              <input
                v-if="field.type !== 'select'"
                v-model="field.value.value"
                :type="field.type"
                :name="field.name"
              />
              <select v-else v-model="field.value.value">
                <option value="">-- Veuillez sélectionner un pays --</option>
                <option value="germany">Allemagne</option>
                <option value="belgium">Belqique</option>
                <option value="french">France</option>
              </select>
            </div>
            <!-- Error message field -->
            <span v-if="field.errorMessage.value" class="error-field">{{
              field.errorMessage.value
            }}</span>
          </div>
        </div>
        <!-- Alert message -->
        <div class="text-center alert-message">
          <AlertMessage
            v-if="successMessage"
            :message="successMessage"
            type="success"
            redirectTo="/payment"
            @close="handleResetForm()"
          />
          <AlertMessage
            v-if="errorMessage"
            :message="errorMessage"
            type="error"
            :redirectTo="null"
            @close="closeAlert()"
          />
        </div>
        <!-- Button valdation form -->
        <div class="d-flex align-items-center flex-end">
          <button class="btn btn-black" :disabled="isSubmitting">
            <span v-if="isSubmitting">Chargement...</span>
            <span v-else>Enregister la commande</span>
          </button>
        </div>
      </form>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/assets/scss/mixins' as m;

// Address

@mixin labelElems {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  border: 1px solid black;
  border-bottom: none;
  height: 27px;
  white-space: nowrap;
}

.address {
  padding: 10px 10px 20px 10px;
  overflow-y: auto;
  margin-top: 40px;
  @include m.lg {
    margin-top: 60px;
    padding: 20px;
  }
  .container-form {
    padding: 30px 15px 10px 15px;
    border: var(--border);
    border-radius: var(--border-radius);
    background-color: var(--text-primary-color);
    width: 100%;
    @include m.lg {
      padding: 30px 30px 20px 30px;
    }
    @include m.xl {
      max-width: 1000px;
    }
    @include m.xxl {
      max-width: 1100px;
    }
    h2 {
      font-size: 21px;
      text-align: center;
      @include m.lg {
        text-align: left;
      }
    }
    .btn-black {
      margin-top: 10px;
    }
  }
}

.form-column {
  display: grid;
  grid-template-columns: 1fr;
  @include m.md {
    grid-template-columns: 1fr 1fr;
    column-gap: 17px;
  }
  .form-group {
    margin-top: 25px;
    input,
    select,
    textarea {
      border: 1px solid black;
      padding: 12px;
      outline: none;
      background-color: white;
      &:focus {
        border: 3px solid black;
        padding: 11px;
      }
    }
    label {
      @include labelElems;
      max-width: 45px;
    }
    .label-firstname {
      @include labelElems;
      max-width: 65px;
    }
    .label-address {
      @include labelElems;
      max-width: 140px;
    }
    .label-complement-address {
      @include labelElems;
      max-width: 185px;
    }
    .label-zip-code {
      @include labelElems;
      max-width: 80px;
    }
    .label-tel {
      @include labelElems;
      max-width: 80px;
    }
    &:focus-within label {
      background-color: black;
      color: var(--text-primary-color);
    }
  }
}
</style>
