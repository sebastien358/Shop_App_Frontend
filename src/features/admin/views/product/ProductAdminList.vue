<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useProductAdminStore } from '@/stores/admin/productAdminStore.ts'
import Pagination from '../../../../templates/pagination/Pagination.vue'
import { ref } from 'vue'

const productAdminStore = useProductAdminStore()

const products = computed(() => productAdminStore.product)

const currentPage = ref<number>(1)
const itemPerPage = ref<number>(20)

const loadAdminProduct = async () => {
  try {
    await productAdminStore.getAdminProducts(currentPage.value, itemPerPage.value)
  } catch (e) {
    console.error(e)
  }
}

const previousPage = async () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
  try {
    await productAdminStore.getAdminProducts(currentPage.value, itemPerPage.value)
  } catch (e) {
    console.error(e)
  }
}

const nextPage = async () => {
  currentPage.value++
  try {
    await productAdminStore.getAdminProducts(currentPage.value, itemPerPage.value)
  } catch (e) {
    console.error(e)
  }
}

onMounted(async () => {
  try {
    await loadAdminProduct()
  } catch (e) {
    console.error(e)
  }
})

// Supression d'un produit

const deleteProduct = async (id: number) => {
  try {
    await productAdminStore.deleteProduct(id)
    await productAdminStore.getAdminProducts(currentPage.value, itemPerPage.value)

    if (productAdminStore.product.length === 0 && currentPage.value > 1) {
      currentPage.value--
    }

    await loadAdminProduct()
  } catch (e) {
    console.error(e)
  }
}
</script>

<template>
  <div v-if="products.length && products.length > 0" class="product">
    <div v-for="product in products" :key="product.id">
      <div class="product__list">
        <div class="d-flex align-items-center">
          <img
            v-if="product.pictures && product.pictures.length > 0"
            :src="product.pictures[0].filename"
            class="img-product"
          />

          <img v-else src="@/assets/images/not-found.webp" class="img-no-product" />

          <h4>{{ product.title }}</h4>
        </div>
        <div class="product__buttons">
          <router-link
            :to="{ name: 'product-edit', params: { id: product.id } }"
            class="btn btn-success"
            >Modifier</router-link
          >
          <button @click="deleteProduct(product.id)" class="btn btn-danger">Supprimer</button>
        </div>
      </div>
    </div>
    <Pagination
      :currentPage="currentPage"
      :pages="productAdminStore.pages"
      @previous-page="previousPage()"
      @next-Page="nextPage()"
    />
  </div>
</template>

<style scoped lang="scss">
.product {
  padding: 20px 20px 10px 20px;
  overflow-y: auto;
  height: calc(100vh - 96px);
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  @media (max-width: 768.98px) {
    padding: 10px;
    row-gap: 6px;
  }
  &__list {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: var(--border);
    padding: 10px;
    background-color: var(--text-primary-color);
    .img-product {
      height: 55px;
      width: 65px;
      margin-right: 10px;
      @media (max-width: 768.98px) {
        margin-right: 10px;
      }
    }
    .img-no-product {
      height: 55px;
      width: 65px;
      margin-right: 15px;
      @media (max-width: 768.98px) {
        margin-right: 10px;
      }
    }
    h4 {
      font-size: 15px;
      @media (max-width: 768.98px) {
        font-size: 13px;
      }
    }
  }
}

.product__buttons {
  display: flex;
  align-items: center;
  gap: 6px;
  .btn-danger,
  .btn-success {
    border: 0;
    width: 75px;
    text-align: center;
    font-size: 11px;
    padding: 12px 0;
    @media (max-width: 768.98px) {
      padding: 11px 0;
      font-size: 10px;
      width: 65px;
    }
  }
}
</style>
