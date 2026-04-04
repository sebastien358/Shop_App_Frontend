<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import Pagination from '@/templates/pagination/Pagination.vue'
import { useCommandUserStore } from '@/stores/user/commandUserStore.ts'

const commandUserStore = useCommandUserStore()

const currentPage = ref<number>(1)
const itemPerPage = ref<number>(5)

const loadUserCommands = async () => {
  try {
    await commandUserStore.getCommandUser(currentPage.value, itemPerPage.value)
  } catch (e) {
    console.error(e)
  }
}

const commands = computed(() => commandUserStore.command)

// Pagination

const previousPage = async () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
  try {
    await commandUserStore.getCommandUser(currentPage.value, itemPerPage.value)
  } catch (e) {
    console.error(e)
  }
}

const nextPage = async () => {
  currentPage.value++
  try {
    await commandUserStore.getCommandUser(currentPage.value, itemPerPage.value)
  } catch (e) {
    console.error(e)
  }
}

const removeCommand = async (id: number) => {
  try {
    await commandUserStore.removeCommand(id)
    await commandUserStore.getCommandUser(currentPage.value, itemPerPage.value)

    if (commandUserStore.command.length === 0 && currentPage.value > 1) {
      currentPage.value--
    }

    await loadUserCommands()
  } catch (e) {
    console.error(e)
    throw e
  }
}

// Couleurs des différents status de la commande

const paymentStatus = (command) => {
  switch (command.status) {
    case 'En attente':
      return 'status-pending'
    case 'Payé':
      return 'status-paid'
    case 'Échouée':
      return 'status-failed'
    case 'Annulée':
      return 'status-cancelled'
    default:
      return ''
  }
}

// Gstion des couleurs status de la préparation de la commande

const selectedPreparationStatus = (command) => {
  switch (command.preparationStatus) {
    case 'En cours':
      return 'status-pending'
    case 'Expédié':
      return 'status-shipped'
    case 'Livré':
      return 'status-delivered'
    default:
      return ''
  }
}

// Si la commande est payé, le boutton de redirection vers le formulaire de paiement disparait

const statusCommandPaid = (command) => {
  if (command.status === 'Payé') {
    return 'no-button-payment'
  }
}

// Récupération de la date

const formatedDate = (date: Date) => {
  if (!date) return ""
  const d = new Date(date)
  return new Intl.DateTimeFormat('fr-Fr').format(d)
}

onMounted(async () => {
  await loadUserCommands()
})
</script>

<template>
  <!-- loading -->
  <section v-if="commandUserStore.isLoading" class="spinner">
    <span class="loader"></span>
  </section>

  <!-- commandes client -->
  <section v-else-if="commandUserStore.command.length > 0" class="command-user">
    <div v-for="command in commands" :key="command.id" class="command-user__card">
      <!-- Items de la commande -->
      <div v-for="item in command.commandItems" :key="item.id" class="command-user__item">
        <div class="command-user__image">
          <img
            v-if="item.product.pictures.length"
            :src="item.product.pictures[0].filename"
            class="product-image"
            alt="Produit"
          />
          <img
            v-else
            src="@/assets/images/not-found.webp"
            class="product-image"
            alt="Produit manquant"
          />
        </div>

        <div class="item-info">
          <h3>{{ item.title }}</h3>
          <p>Prix : {{ item.price }} €</p>
          <p>Quantité : {{ item.quantity }}</p>
          <p>Date : {{ formatedDate(command.createdAt) }}</p>
        </div>
      </div>

      <!-- Statut commande -->
      <div class="command-user__status">
        <p>
          Paiment :
          <span :class="paymentStatus(command)">
            {{ command.status }}
          </span>
        </p>
        <p>
          Préparation commande :
          <span :class="selectedPreparationStatus(command)">
            {{ command.preparationStatus }}
          </span>
        </p>
      </div>

      <!-- Bouton : passer une commande, supprimer une commade -->
      <div class="command-user__buttons">
        <router-link
          :to="{ name: 'payment-command', params: { id: command.id } }"
          class="btn btn-command-paid"
          :class="statusCommandPaid(command)"
          >Payé</router-link
        >
        <button
          @click="removeCommand(command.id)"
          class="btn btn-delete"
          :class="statusCommandPaid(command)"
        >
          Supprimer
        </button>
      </div>
    </div>

    <Pagination
      :currentPage="currentPage"
      :pages="commandUserStore.pages"
      @previous-page="previousPage()"
      @next-Page="nextPage()"
    />
  </section>

  <!-- aucun produit -->
  <section v-else class="no-product">
    <p>Aucun produit pour le moment.</p>
  </section>
</template>
>

<style scoped lang="scss">
// Variables globales

$primary: #4f46e5;
$success: #10b981;
$error: #ef4444;
$light-bg: #f9fafb;
$card-bg: #ffffff;
$text-dark: #111827;
$text-muted: #6b7280;
$radius: 12px;
$shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

/* SPINNER */

.spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
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

.command-user__status {
  display: flex;
  flex-direction: column;
  gap: 6px;
  p,
  span {
    font-size: 13px;
  }
  .status-pending {
    color: orange;
    font-weight: bold;
  }
  .status-shipped {
    color: #3498db;
    font-weight: bold;
  }
  .status-paid {
    color: #2ecc71;
    font-weight: bold;
  }
  .status-delivered {
    color: #2ecc71;
    font-weight: bold;
  }
  .status-failed {
    color: red;
    font-weight: bold;
  }
  .status-cancelled {
    color: red;
    font-weight: bold;
  }
}

.command-user {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: calc(100vh - 96px);
  overflow: auto;
  @media (max-width: 767.98px) {
    padding: 10px;
    height: 100%;
  }
  &__card {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 1rem;
    background: #f9f9f9;
    @media (max-width: 767.98px) {
      padding: 10px;
    }
  }
  &__image {
    .product-image {
      width: 100%;
      height: 77px;
    }
  }
  &__item {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    margin-bottom: 1rem;
    .item-info h3 {
      font-size: 14px;
      margin: 0 0 0.3rem 0;
    }
    .item-info p {
      margin: 0.2rem 0;
      font-size: 13px;
    }
  }
  &__buttons {
    display: flex;
    align-items: center;
    gap: 5px;
    .no-button-payment {
      display: none;
    }
    .btn {
      padding: 0.6rem 1rem;
      border-radius: 6px;
      font-weight: bold;
      border: none;
      cursor: pointer;
      margin-top: 0.5rem;
      font-size: 11px;
      &-command-paid {
        width: auto;
        color: white;
        background: green;
        padding: 0.6rem 1rem;
        border-radius: 6px;
        font-weight: bold;
        border: none;
        cursor: pointer;
      }
      &-delete {
        background: red;
        &.no-button {
          display: none;
        }
        &.active-button {
          display: block;
        }
      }
    }
  }
}

/* NO PRODUCT */

.no-product {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 150px;
  p {
    font-size: 15px;
  }
}
</style>
