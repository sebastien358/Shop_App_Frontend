<script setup lang="ts">
defineProps<{
  open: boolean
  transparent: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <Teleport v-if="open" to="body">
    <div @click="emit('close')" class="calc" :class="{transparent}"></div>
  </Teleport>
</template>

<style scoped lang="scss">
.calc {
  z-index: 1;
  background-color: rgba(0, 0, 0, 0.56);
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
}

.transparent {
  background-color: transparent;
}
</style>
