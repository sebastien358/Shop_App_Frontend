<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps<{
  message: string
  type: string
  redirectTo: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

let timeoutId

const alertMessage = () => {
  if (props.type === 'success') {
    timeoutId = setTimeout(() => {
      router.push({path: props.redirectTo})
      emit('close')
    }, 2000)
  } else {
    timeoutId = setTimeout(() => {
      emit('close')
    }, 3000)
  }
}

onMounted(() => {
  alertMessage()
})

onUnmounted(() => {
  clearTimeout(timeoutId)
})
</script>

<template>
  <div v-if="props.message" :class="props.type === 'success' ? 'alert-success' : 'alert-error'">
    {{ message }}
  </div>
</template>

<style scoped lang="scss">
.alert-success,
.alert-error {
  font-size: 12px;
}

.alert-success {
  color: green;
}

.alert-error {
  color: red;
}
</style>
