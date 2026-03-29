<script setup lang="ts">
import ShopProductList from '@/features/boutique/components/shop/ShopProductList.vue'
import ShopFilter from '@/features/boutique/components/shop/ShopFilter.vue'
import type { ProductInterface } from '@/shared/interfaces'
import { reactive } from 'vue'

defineProps<{
  products: ProductInterface[]
  isLoading: boolean
}>()

// Menu de filtration

const state = reactive<{
  isOpen: boolean
}>({
  isOpen: !window.matchMedia('(max-width: 767.98px)').matches,
})

const toggleFiltered = () => {
  state.isOpen = !state.isOpen
}
</script>

<template>
  <div class="shop">
    <Transition>
      <ShopFilter v-if="state.isOpen" class="shop-filter" />
    </Transition>
    <div class="d-flex flex-column shop-content">
      <button @click="toggleFiltered()" class="btn btn-primary">Filtrer les produits</button>
      <ShopProductList :products="products" :isLoading="isLoading" class="shop-product-list" />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/scss/mixins' as m;

.shop {
  display: grid;
  grid-template-columns: 1fr;
  @include m.lg {
    grid-template-columns: 240px auto;
  }
  .shop-filter {
    height: auto;
    @include m.lg {
      height: 100%;
    }
  }
  .shop-product-list {
    overflow-y: auto;
    height: calc(100vh - 96px);
    padding: 0 10px 10px 10px;
    @include m.sm {
      padding: 0 10px 10px 10px;
    }
    @include m.md {
      padding: 0 10px 10px 10px;
    }
    @include m.lg {
      padding: 0 15px 10px 15px;
    }
    @include m.xl {
      padding: 13px 13px 10px 13px;
    }
    @include m.xxl {
      padding: 15px 15px 10px 15px;
    }
  }
  .shop-content {
    button {
      margin: 10px 10px;
      @include m.lg {
        display: none;
      }
    }
  }
}

/* we will explain what these classes do next! */

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
