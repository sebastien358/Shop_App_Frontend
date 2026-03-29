<script setup lang="ts">
defineProps<{
  currentPage: number
  pages: number
}>()

const emit = defineEmits<{
  (e: 'previousPage'): void
  (e: 'nextPage'): void
}>()
</script>

<template>
  <div class="pagination" :class="{'active-pagination': pages >= 1}">
    <button
      @click="emit('previousPage')"
      class="btn btn-pagination"
      :class="{ disabled: currentPage === 1 }"
      :disabled="currentPage === 1"
      aria-label="Page précédente"
    >
      Précédent
    </button>
    <span>{{ currentPage }} - {{ pages }}</span>
    <button
      @click="emit('nextPage')"
      class="btn btn-pagination"
      :class="{ disabled: currentPage === pages }"
      :disabled="currentPage === pages"
      aria-label="Page suivante"
    >
      Suivant
    </button>
  </div>
</template>

<style scoped lang="scss">
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-family: 'Segoe UI', Tahoma, sans-serif;
  visibility: hidden;
  &.active-pagination {
    visibility: visible;
  }
  span {
    font-size: 14px;
    font-weight: 500;
    color: #333;
  }
  .btn-pagination {
    padding: 10px 14px;
    border: none;
    border-radius: 6px;
    background-color: #007bff;
    color: white;
    cursor: pointer;
    font-size: 11px;
    font-weight: 500;
    transition: all 0.2s ease;
    outline: none;
    width: 80px;
    &:hover:not(.disabled) {
      background-color: #0056b3;
    }
    &.disabled {
      background-color: #ccc;
      color: #666;
      cursor: not-allowed;
    }
    &:focus {
      outline: 2px solid #0056b3;
      outline-offset: 2px;
    }
  }
}
</style>
