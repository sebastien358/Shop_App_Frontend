<script setup lang="ts">
import { useCommandUserStore } from '@/stores/user/commandUserStore.ts'
import { computed, onMounted } from 'vue'

const commandUserStore = useCommandUserStore()

const commands = computed(() => commandUserStore.command)

onMounted(async () => {
  try {
    await commandUserStore.getCommandUserList()
  } catch (e) {
    console.error(e)
  }
})

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

// Couleurs des différents status de la commande

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

const removeCommand = async (id: number) => {
  try {
    await commandUserStore.removeCommand(id)
  } catch (e) {
    console.error(e)
  }
}
</script>

<template>
  <!-- loading -->
  <section v-if="commandUserStore.isLoading" class="spinner">
    <span class="loader"></span>
  </section>

  <!-- commandes client -->
  <div v-else-if="commandUserStore.command.length > 0" class="command-user">
    <div v-for="command in commands" :key="command.id" class="command-card">
      <!-- Items de la commande -->
      <div v-for="item in command.commandItems" :key="item.id" class="command-item">
        <div class="item-image">
          <img
            v-if="item.product.pictures.length"
            :src="item.product.pictures[0].filename"
            alt="Produit"
          />
          <img v-else src="@/assets/images/not-found.webp" alt="Produit manquant" />
        </div>

        <div class="item-info">
          <h3>{{ item.title }}</h3>
          <p>Prix : {{ item.price }} €</p>
          <p>Quantité : {{ item.quantity }}</p>
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
          Préparation de la commande :
          <span :class="selectedPreparationStatus(command)">
            {{ command.preparationStatus }}
          </span>
        </p>
      </div>

      <!-- Bouton : passer une commande, supprimer une commade -->
      <div class="command-user__buttons">
        <router-link :to="{ name: 'payment-command', params: { id: command.id } }" class="btn btn-command-paid">Payé</router-link>
        <button
          @click="removeCommand(command.id)"
          class="btn btn-delete"
        >
          Supprimer
        </button>
      </div>
    </div>
  </div>

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
  gap: 1.5rem;
  .command-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 1rem;
    background: #f9f9f9;
    .command-item {
      display: flex;
      gap: 1rem;
      align-items: center;
      margin-bottom: 1rem;
      .item-image {
        width: 80px;
        height: 80px;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 6px;
        }
      }
      .item-info {
        flex: 1;
        h3 {
          font-size: 15px;
          margin: 0 0 0.3rem 0;
        }
        p {
          margin: 0.2rem 0;
          font-size: 14px;
        }
      }
    }
  }
}

.command-user__buttons {
  display: flex;
  align-items: center;
  gap: 5px;
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
