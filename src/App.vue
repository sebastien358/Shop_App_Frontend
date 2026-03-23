<script setup lang="ts">
import Header from '@/templates/header/Header.vue'
import Footer from '@/templates/footer/Footer.vue'
import { useCartStore } from '@/stores/cartStore.ts'
import { subscribe } from 'diagnostics_channel'

const cartStore = useCartStore()

cartStore.$subscribe(() => {
  cartStore.saveCart()
})
</script>

<template>
  <div class="app-content">
    <Header class="header" />
    <div class="views">
    <router-view v-slot="{Component}">
      <template v-if="Component">
        <Component :is="Component" />
      </template>
    </router-view>
    </div>
    <Footer class="footer" />
  </div>
</template>

<style scoped lang="scss">
.app-content {
  display: grid;
  grid-template-areas: 'header' 'views' 'footer';
  grid-template-rows: 48px 1fr 48px;
  min-height: 100vh;
}

.header {
  grid-area: header;
}

.views {
  grid-area: views;
  min-height: 100%;
}

.footer {
  grid-area: footer;
}
</style>
