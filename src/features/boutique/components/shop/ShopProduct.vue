<script setup lang="ts">
import { useCartStore } from '@/stores/cartStore.ts'
import { useAuthStore } from '@/stores/authStore.ts'
import type { ProductInterface } from '@/shared/interfaces'
import { useRouter } from 'vue-router'

const cartStore = useCartStore()
const authStore = useAuthStore()

const router = useRouter()

defineProps<{
  product: ProductInterface
}>()

const addProductToCart = async (id: number) => {
  try {
    if (!authStore.isLoggedIn) {
      await router.push({ path: '/login' })
      return
    }
    await cartStore.addProductToCart(id)
  } catch (e) {
    console.error(e)
  }
}
</script>

<template>
  <div class="d-flex flex-column shop-product">
    <div class="shop-product_image">
      <div v-if="product.pictures.length > 0">
        <img :src="product.pictures[0].filename" class="img-product" />
      </div>
      <div v-else>
        <img src="@/assets/images/not-found.webp" class="img-product" />
      </div>
      <div class="shop-product_content">
        <h3>{{ product.title }}</h3>
        <p>{{ product.description }}</p>
        <div class="d-flex align-items-center space-between">
          <p>Prix : {{ product.price }}€</p>
          <button @click="addProductToCart(product.id)" class="btn btn-primary">
            Ajouter au panier
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.shop-product {
  border: var(--border);
  border-radius: var(--border-radius);
  background-color: var(--text-primary-color);
  &_image .img-product {
    border-bottom: var(--border);
    border-top-right-radius: var(--border-radius);
    border-top-left-radius: var(--border-radius);
    height: 350px;
    object-fit: cover;
    @media (max-width: 1600px) {
      height: 350px;
      width: 100%;
    }
    @media (max-width: 768.98px) {
      height: 250px;
      width: 100%;
    }
  }
  &_content {
    padding: 10px;
    h3 {
      font-size: 15px;
      margin-bottom: 10px;
    }
    p {
      font-size: 14px;
      margin-bottom: 10px;
    }
  }
}
</style>
