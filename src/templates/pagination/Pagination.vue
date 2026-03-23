<script setup lang="ts">

defineProps<{
  currentPage: number
  totalPages: number
}>()

const emit = defineEmits<{
  (e: 'previousPage'): void
  (e: 'nextPage'): void
}>()
</script>

<template>
  <div class="d-flex align-items-center justify-content-center pagination">
    <button @click="emit('previousPage')" class="btn btn-pagination" :class="{'disabled': currentPage === 1}" aria-label="Page précédente">
      Précédent
    </button>
    <span>{{ currentPage }} - {{ totalPages }}</span>
    <button @click="emit('nextPage')" class="btn btn-pagination" :class="{'disabled': currentPage === totalPages}"  aria-label="Page suivante">
      Suivant
    </button>
  </div>
</template>

<style scoped lang="scss">
.pagination {
  span {
    margin: 0 6px;
    font-size: 14px;
  }
  .disabled {
  background-color: gray;
  }
}
</style>