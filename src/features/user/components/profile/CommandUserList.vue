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

const isPaid = (command) => {
  return command.status === 'Payé'
}

const isPaidButton = (command) => {
  return command.status === 'Payé'
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
      <p :class="isPaid(command) ? 'status-paid' : 'status-failed'">
        Statut : {{ command.status }}
      </p>

      <!-- Bouton supprimer -->
      <button
        @click="removeCommand(command.id)"
        :class="isPaidButton(command) ? 'no-button' : 'active-button'"
      >
        Supprimer
      </button>
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
    .status-paid {
      color: green;
      font-weight: bold;
    }
    .status-failed {
      color: red;
      font-weight: bold;
    }
    button {
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-weight: bold;
      border: none;
      cursor: pointer;
      margin-top: 0.5rem;
      &.active-button {
        background-color: #e74c3c;
        color: white;
        &:hover {
          background-color: #c0392b;
        }
      }
      &.no-button {
        background-color: #ccc;
        color: #666;
        cursor: not-allowed;
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
