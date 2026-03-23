<script setup lang="ts">
import { useCommandAdminStore } from '@/stores/admin/commandAdminStore.ts'
import { computed, onMounted, ref } from 'vue'

const commandAdminStore = useCommandAdminStore()

onMounted(async () => {
  try {
    await commandAdminStore.commandAdminList()
  } catch (e) {
    console.error(e)
    throw e
  }
})

const commands = computed(() => commandAdminStore.commands)

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

const commandDelivered = (command) => {
  return command.preparationStatus === 'Livré'
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

const statusPreparation = ref<string | null>(null)

const selectedPreparation = async (id: number, e: Event) => {
  try {
    const preparationStatus = e?.target?.value
    statusPreparation.value = preparationStatus
    await commandAdminStore.preparationStatus(id, preparationStatus)
  } catch (e) {
    console.error(e)
  }
}
</script>

<template>
  <!-- loading -->
  <section v-if="commandAdminStore.isLoading" class="spinner">
    <span class="loader"></span>
  </section>

  <!-- commandes client -->
  <section v-else-if="commandAdminStore.commands.length > 0" class="command-user">
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

      <!-- Bouton préparation de la commande -->

      <div class="command-user__preparation__status">
        <select
          @click="selectedPreparation(command.id, $event)"
          name="preparation-status"
          id="preparation-status"
        >
          <option value="">
            -- {{ statusPreparation ? statusPreparation : 'Status de la commande' }} --
          </option>
          <option value="En cours">En cours</option>
          <option value="Expédié">Expédié</option>
          <option value="Livré">Livré</option>
        </select>
      </div>

      <!-- Bouton supprimer commande -->
      <button :class="commandDelivered(command) ? 'active-button' : 'no-button'">Supprimer</button>
    </div>
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
    position: relative;
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
          font-size: 14px;
          margin: 0 0 0.3rem 0;
        }
        p {
          margin: 0.3rem 0;
          font-size: 13px;
        }
      }
    }
    button {
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-weight: bold;
      border: none;
      cursor: pointer;
      margin-top: 0.5rem;
      &.active-button {
        position: absolute;
        top: 0;
        right: 7px;
        background-color: #e74c3c;
        color: white;
        font-size: 10px;
        &:hover {
          background-color: #c0392b;
        }
      }
      &.no-button {
        display: none;
        background-color: #ccc;
        color: #666;
        cursor: not-allowed;
      }
    }
  }
}

.command-user__preparation__status {
  display: flex;
  flex-direction: column;
  margin-top: 12px;
  label {
    font-size: 14px;
  }
  select {
    width: 250px;
    text-align: center;
    padding: 6px;
    cursor: pointer;
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
