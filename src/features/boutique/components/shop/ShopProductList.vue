<script setup lang="ts">
import ShopProduct from '@/features/boutique/components/shop/ShopProduct.vue'
import { useProductStore } from '@/stores/productStore.ts'
import type { ProductInterface } from '@/shared/interfaces'

const productStore = useProductStore()

const props = defineProps<{
  products: ProductInterface[]
  isLoading: boolean
}>()

const loadProducts = async () => {
  try {
    await productStore.loadProducts()
  } catch (e) {
    console.error(e)
  }
}
</script>

<template>
  <!-- loading -->
  <section v-if="props.isLoading" class="spinner">
    <span class="loader"></span>
  </section>
  <!-- products -->
  <div v-else-if="products.length > 0" class="d-flex flex-column">
    <div class="shop-list">
      <ShopProduct
        v-for="product in products"
        :product="product"
        :isLoading="isLoading"
        :key="product.id"
      />
    </div>
    <div v-if="products.length > 0" class="d-flex align-items-center justify-content-center mt-10">
      <button @click="loadProducts()" class="btn btn-primary">Charger plus...</button>
    </div>
  </div>
  <!-- no product -->
  <section v-else class="no-product">
    <p>Aucun produit pour le moment.</p>
  </section>
</template>

<style scoped lang="scss">
@use '@/assets/scss/mixins' as m;

/* SPINNER */

.spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  .loader {
    width: 37px;
    height: 37px;
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

/* PRODUCTS */

.shop-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  align-items: stretch;
  gap: 10px;
  @media (max-width: 1600px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
  @media (max-width: 991.98px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
  @media (max-width: 768.98px) {
    grid-template-columns: repeat(1, 1fr);
    gap: 10px;
  }
}

/* NO PRODUCT */

.no-product {
  display: flex;
  align-items: center;
  justify-content: center;
  p {
    font-size: 15px;
  }
}
</style>
