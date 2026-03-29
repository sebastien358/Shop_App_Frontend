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

async function deleteProduct(id: number) {
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
      <div class="d-flex align-items-center space-between product_list">
        <div class="d-flex align-items-center">
          <div v-if="product.pictures.length > 0">
            <img :src="product.pictures[0].filename" class="img-product" />
          </div>
          <div v-else>
            <img src="@/assets/images/not-found.webp" class="img-no-product" />
          </div>
          <h4>{{ product.title }}</h4>
        </div>
        <div class="d-flex align-items-center">
          <button class="btn btn-success">Modifier</button>
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
  &_list {
    border: var(--border);
    padding: 10px;
    background-color: var(--text-primary-color);
    button {
      margin: 0 3px;
      width: 78px;
    }
    .img-product {
      height: 55px;
      width: 65px;
      margin-right: 10px;
    }
    .img-no-product {
      height: 55px;
      width: 65px;
      margin-right: 15px;
    }
  }
}
</style>
