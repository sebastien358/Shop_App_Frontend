<script setup lang="ts">
import Shop from '@/features/boutique/components/shop/Shop.vue'
import Cart from '@/features/boutique/components/cart/Cart.vue'
import { computed, onMounted } from 'vue'
import { useProductStore } from '@/stores/productStore.ts'
import { useCartStore } from '@/stores/cartStore.ts'

const productStore = useProductStore()

const products = computed(() => productStore.product)

onMounted(async () => {
  try {
    await productStore.getProduct()
  } catch (e) {
    console.error(e)
  }
})

// Récupératiopn du panier

const cartStore = useCartStore()

const cart = computed(() => cartStore.cart)

onMounted(async () => {
  try {
    await cartStore.getProductToCart()
  } catch (e) {
    console.error(e)
  }
})
</script>

<template>
  <div class="boutique">
    <Shop :products="products" :isLoading="productStore.isLoading" />
    <Cart :cart="cart" :total="cartStore.total" :itemToCart="cartStore.itemsToCartExisting" />
  </div>
</template>

<style scoped lang="scss"></style>
