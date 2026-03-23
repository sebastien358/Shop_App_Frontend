<script setup lang="ts">
import CartProductList from '@/features/boutique/components/cart/CartProductList.vue'
import { useAuthStore } from '@/stores/authStore.ts'
import Calc from '@/templates/calc/Calc.vue'
import type { CartProductInterface } from '@/shared/interfaces'
import { useRouter } from 'vue-router'
import { reactive } from 'vue'

const state = reactive<{
  open: boolean
}>({
  open: false,
})

const props = defineProps<{
  cart: CartProductInterface[]
  total: number
  itemToCart: string
}>()

// gestion des roles et redirection

const authStore = useAuthStore()
const router = useRouter()

const toGoCommand = () => {
  if (authStore.isLoggedIn && props.cart.length > 0) {
    router.push({ path: '/command-address' })
    return
  }
  router.push({ path: '/login' })
}
</script>

<template>
  <div class="cart-fixed">
    <transition mode="out-in">
      <div
        @click="state.open = true"
        v-if="!state.open"
        class="toggle-cart"
        :class="{ active: cart.length > 0 }"
      >
        <div class="nbr-products">
          <span>{{ cart.length }}</span>
        </div>
        <font-awesome-icon icon="fa-solid fa-basket-shopping" />
      </div>
      <div v-else class="d-flex flex-column cart">
        <h4>Panier</h4>
        <span :class="{ 'no-product': cart.length === 0 }">{{ itemToCart }}</span>
        <CartProductList :cart="cart" />
        <button @click="toGoCommand()" class="btn btn-success">Commander ({{ total }})€</button>
      </div>
    </transition>
    <Calc :open="state.open" @close="state.open = false" :transparent="false" />
  </div>
</template>

<style scoped lang="scss">
@mixin displayCenter {
  display: flex;
  align-items: center;
  justify-content: center;
}

.cart-fixed {
  z-index: 2;
  position: fixed;
  bottom: 15px;
  right: 20px;
  .toggle-cart {
    cursor: pointer;
    position: relative;
    height: 70px;
    width: 70px;
    background-color: var(--primary-1);
    border-radius: 50%;
    @include displayCenter();
    &.active {
      border: 3px solid #41b883;
      box-shadow: #41b883 0 4px 12px;
    }
    .nbr-products {
      position: absolute;
      height: 13px;
      width: 13px;
      border-radius: 50%;
      background-color: var(--danger-1);
      @include displayCenter();
      top: 0;
      right: 8px;
    }
    .nbr-products span {
      color: var(--text-primary-color);
      font-size: 9px;
    }
    .fa-basket-shopping {
      color: var(--text-primary-color);
      font-size: 17px;
    }
  }
  .cart {
    width: 530px;
    padding: 15px 8px 6px 8px;
    border: var(--border);
    background-color: var(--text-primary-color);
    h4 {
      margin-bottom: 10px;
    }
    button {
      margin-top: 6px;
      padding: 10px;
    }
    .no-product {
      margin-bottom: 10px;
      text-align: center;
      font-weight: 500;
      font-size: 13px;
      color: var(--danger-1);
    }
  }
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
