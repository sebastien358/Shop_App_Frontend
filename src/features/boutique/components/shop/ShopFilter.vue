<script setup lang="ts">
import { useProductStore } from '@/stores/productStore.ts'

const productStore = useProductStore()

/* SEARCH TERM */

const inputSearchTerm = async () => {
  try {
    const term = productStore.searchTerm
    await productStore.searchProducts(term)
  } catch (e) {
    console.error(e)
  }
}

/* AFFICHER LES PRIX */

const displayPriceRange = (priceRange: number[]) => {
  return priceRange[0] === 0
    ? 'Tous les produits'
    : priceRange[0] === 2000
      ? 'Plus de 2000'
      : `${priceRange[0]} et ${priceRange[1]}`
}

/* SÉLÉCTIONNER LE PRIX */

const selectedPriceRange = async (priceRange: number[]) => {
  try {
    await productStore.filteredPrice(priceRange)
  } catch (e) {
    console.error(e)
  }
}

/* SÉLÉCTIONNER LA CATÉGORIE */

const selectedCategory = async (category: string) => {
  try {
    productStore.initCategory = category
    await productStore.filteredCategory(category)
  } catch (e) {
    console.error(e)
  }
}

/* RÉINITIALISATION */

const selectedReinitialisation = () => {
  productStore.initFilteredProducts()
}
</script>

<template>
  <div class="d-flex flex-column space-between shop-filter">
    <div class="d-flex flex-column flex-fill">
      <!-- Filtration search -->
      <div class="d-flex flex-column shop-filter_search">
        <h4>Rechercher</h4>
        <input
          @input="inputSearchTerm()"
          v-model="productStore.searchTerm"
          type="text"
          placeholder="Rechercher"
        />
      </div>
      <!-- Filtrer par prix -->
      <div class="d-flex flex-column shop-filter_price">
        <h4>Filtrer par prix</h4>
        <div
          v-for="(priceRange, index) in productStore.priceRange"
          @click="selectedPriceRange(priceRange)"
          class="price-range"
          :key="index"
        >
          <input
            v-model="productStore.initPriceRange"
            :value="priceRange"
            type="radio"
            name="priceRange"
          />
          <span>{{ displayPriceRange(priceRange) }}</span>
        </div>
      </div>
      <!-- Filtrer par catégories -->
      <div class="d-flex flex-column shop-filter_category">
        <h4>Filtrer par catégories</h4>
        <p
          v-for="(category, index) in productStore.category"
          @click="selectedCategory(category)"
          :key="index"
        >
          <span
            class="category"
            :class="{ active: productStore.initCategory.includes(category) }"
          >
            {{ category }}
          </span>
        </p>
      </div>
    </div>
    <!-- Réinitialisation -->
    <div class="d-flex flex-column shop-filter_reinitialisation">
      <p class="nbr-products">
        Nombre de produits: <span>{{ productStore.nbrProducts }}</span>
      </p>
      <button @click="selectedReinitialisation()" class="btn btn-danger">Réinitialser</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/scss/mixins' as m;

.shop-filter {
  background-color: black;
  border-right: 0;
  position: fixed;
  padding: 10px;
  width: 100%;
  max-width: 250px;
  height: 100%;
  @include m.lg {
    position: initial;
    background-color: var(--gray-1);
    border-right: var(--border);
    padding: 15px 10px 6px 10px;
    height: calc(100vh - 40px);
  }
}

.shop-filter {
  &_search {
    margin-bottom: 20px;
    h4 {
      font-size: 15px;
      margin-bottom: 3px;
      color: var(--text-primary-color);
      @include m.lg {
        color: var(--gray-3);
      }
    }
    input {
      border: 0;
      outline: none;
      padding: 9px;
      @include m.lg {
        border: var(--border);
      }
    }
  }
}

.shop-filter {
  &_price {
    h4 {
      font-size: 15px;
      margin-bottom: 10px;
      color: var(--text-primary-color);
      @include m.lg {
        color: var(--gray-3);
      }
    }
    .price-range {
      line-height: 30px;
      font-size: 15px;
      span {
        color: var(--text-primary-color);
        margin-left: 3px;
        @include m.lg {
          color: var(--gray-3);
        }
      }
    }
  }
}

.shop-filter {
  &_category {
    margin-top: 14px;
    cursor: pointer;
    line-height: 33px;
    h4 {
      font-size: 15px;
      color: var(--text-primary-color);
      @include m.lg {
        color: var(--gray-3);
      }
    }
    .category {
      font-size: 16px;
      color: var(--text-primary-color);
      @include m.lg {
        color: var(--gray-3);
      }
      &.active {
        color: var(--success-2);
      }
    }
  }
}

.shop-filter {
  &_reinitialisation {
    color: var(--text-primary-color);
    margin-top: 20px;
    @include m.lg {
      margin-top: 0;
    }
    .nbr-products {
      font-size: 14px;
      margin-bottom: 4px;
      color: var(--text-primary-color);
      @include m.lg {
        color: var(--gray-3);
      }
      span {
        color: var(--success-2);
      }
    }
  }
}
</style>
