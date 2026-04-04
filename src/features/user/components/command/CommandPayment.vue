<script setup lang="ts">
import CommandProgress from '@/templates/commandProgress/CommandProgress.vue'
import AlertMessage from '@/templates/alertMessage/AlertMessage.vue'
import { useCartStore } from '@/stores/cartStore.ts'
import { useCommandUserStore } from '@/stores/user/commandUserStore'
import { onMounted, reactive, ref } from 'vue'
import { loadStripe } from '@stripe/stripe-js'
import { useRoute } from 'vue-router'
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_APP_API_URL as string

const route = useRoute()

const cartStore = useCartStore()
const commandStore = useCommandUserStore()

const stripe = ref(null)
const cardStripe = ref(null)
const cardElement = ref(null)

// Paiment d'une commande depuis le profil user : ID

type Command = {
  id: number
}

const stateCommand = reactive<Command>({
  id: 0
})

onMounted(async () => {
  try {
    // Commande depuis le profil user
    const id = Number(route.params.id)
    if (id) {
      const command = await commandStore.getCurrentCommand(id)
      Object.assign(stateCommand, {
        id: command.id,
      })
    } else {
      // Commande depuis le panier
      await cartStore.getProductToCart()
    }
  } catch (e) {
    console.error(e)
  }
})

// Configuration de Strype

const strypePayment = async () => {
  try {
    stripe.value = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
    const elements = stripe.value.elements()
    cardStripe.value = elements.create('card', {
      style: {
        base: {
          fontSize: '14px',
          color: '#c0392b',
        },
      },
    })
    cardStripe.value.mount(cardElement.value)
  } catch (e) {
    console.error(e)
  }
}

onMounted(async () => {
  await strypePayment()
})

// Step

const currentStep = ref<number>(3)

// Validation du formulaire

const handleSubmit = async () => {
  try {
    if (!stripe.value || !cardStripe.value) {
      setErrorMessage('Stripe non chargé correctement')
      return
    }

    const { token, error } = await stripe.value.createToken(cardStripe.value)
    if (error || !token) {
      setErrorMessage(error?.message || 'Erreur création token')
      return
    }

    // 🔹 Condition selon le type de commande
    let payload: any = { token: token.id }

    if (stateCommand.id) {
      // Commande depuis le profil user
      payload.commandId = stateCommand.id
    } else {
      // Commande depuis le panier
      payload.items = cartStore.cart.map((item: any) => ({
        id: item.id,
      }))
    }

    // Envoi au back-end
    const response = await axios.post(`${BASE_URL}/api/payment`, payload)

    switch (response.data.type) {
      case 'SUCCESS_PAYMENT':
        setSuccessMessage(response.data.message)
        console.log('Payment ID :', response.data.paymentId)
        break
      case 'ERROR_PAYMENT':
        setErrorMessage(response.data.message)
        break
      default:
        setErrorMessage('Erreur inconnue')
    }
  } catch (e: any) {
    setErrorMessage('Erreur serveur, paiement non effectué')
  }
}

const successMessage = ref<string | null>(null)
const errorMessage = ref<string | null>(null)

const setSuccessMessage = (message: string) => {
  successMessage.value = message
}

const setErrorMessage = (message: string) => {
  errorMessage.value = message
}

const closeAlert = () => {
  successMessage.value = null
  errorMessage.value = null
}

const handleResetForm = () => {
  closeAlert()
}
</script>

<template>
  <CommandProgress :currentStep="currentStep" />
  <div class="d-flex align-items-center justify-content-center payment">
    <div class="container-form">
      <h2 class="text-center mb-15">Paiement sécurisé</h2>
      <p class="text-center mb-15">
        Entrez vos informations de carte de crédit pour effectuer le paiement
      </p>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="card-element"></label>
          <div id="card-element" ref="cardElement"></div>
        </div>
        <div class="text-center alert-message">
          <AlertMessage
            v-if="successMessage"
            :message="successMessage"
            type="success"
            redirectTo="/finish"
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
        <div class="d-flex flex-column">
          <button class="btn btn-primary" type="submit">Payer</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/scss/mixins' as m;

.payment {
  height: calc(100vh - 210px);
  padding: 10px;
  @media (max-width: 768.98px) {
    height: auto;
  }
}

.container-form {
  background-color: var(--text-primary-color);
  border-radius: var(--border-radius);
  border: var(--border);
  padding: 20px;
  width: 100%;
  max-width: 520px;
  @media (max-width: 768.98px) {
    margin-top: 80px;
  }
  h2 {
    font-size: 21px;
  }
  p {
    font-size: 13px;
  }
  .form-group {
    #card-element {
      border: var(--border);
      border-radius: var(--border-radius);
      padding: 12px;
    }
  }
  .btn-primary {
    padding: 11px;
  }
  .alert-message {
    margin: 10px 0;
  }
}
</style>
