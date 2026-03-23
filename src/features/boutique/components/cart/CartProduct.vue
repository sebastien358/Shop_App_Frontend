<script setup lang="ts">
import { useCartStore } from '@/stores/cartStore.ts'
import type { CartProductInterface } from '@/shared/interfaces'
import { useAuthStore } from '@/stores/authStore.ts'
import { useRouter } from 'vue-router'

defineProps<{
  item: CartProductInterface
}>()

const authStore = useAuthStore()
const cartStore = useCartStore()

const router = useRouter()

/* Ajouter un article depuis le panier */

async function addItemToCart(id: number) {
  try {
    if (!authStore.isLoggedIn) {
      await router.push({ path: '/login' })
      return
    }
    await cartStore.addItemToCart(id)
  } catch (e) {
    console.error(e)
  }
}

/* Retirer un article depuis le panier */

async function deleteItemToCart(id: number) {
  try {
    if (!authStore.isLoggedIn) {
      await router.push({ path: '/login' })
      return
    }
    await cartStore.deleteItemToCart(id)
  } catch (e) {
    console.error(e)
  }
}
</script>

<template>
  <div class="d-flex align-items-center space-between cart-product">
    <div class="cart-product_image">
      <img
        v-if="item.product.pictures.length > 0"
        :src="item.product.pictures[0].filename"
        class="img-cart"
      />
      <img v-else src="@/assets/images/not-found.webp" class="no-img-cart" />
      <h4>{{ item.title }}</h4>
    </div>
    <div class="d-flex align-items-center">
      <font-awesome-icon @click="deleteItemToCart(item.id)" icon="fa-solid fa-minus" />
      <p class="quantity">{{ item.quantity }}</p>
      <font-awesome-icon @click="addItemToCart(item.id)" icon="fa-solid fa-plus" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.cart-product {
  border: var(--border);
  padding: 10px 6px;
  border-radius: var(--border-radius);
  background-color: var(--text-primary-color);
  &_image {
    display: flex;
    align-items: center;
    column-gap: 10px;
    .img-cart {
      height: 45px;
      width: auto;
    }
    .no-img-cart {
      height: 45px;
      width: 57px;
    }
  }
  h4 {
    font-size: 13px;
  }
  .fa-minus {
    cursor: pointer;
    font-size: 15px;
    color: green;
  }
  .quantity {
    font-size: 14px;
    margin: 0 7px;
  }
  .fa-plus {
    cursor: pointer;
    font-size: 15px;
    color: red;
  }
}
</style>
