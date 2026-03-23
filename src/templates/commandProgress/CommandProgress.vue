<script setup lang="ts">
defineProps<{
  currentStep: number
}>()

const steps = [
  { label: 'Connexion', num: 1 },
  { label: 'Adresse', num: 2 },
  { label: 'Paiement', num: 3 },
  { label: "C'est fait !", num: 4 },
]
</script>

<template>
  <div class="d-flex align-items-center justify-content-center command-progress">
    <div class="d-flex align-items-center">
      <div
        v-for="(step, index) in steps"
        :key="index"
        class="d-flex align-items-center flex-column"
        :class="{ 'is-login-user': step.num <= currentStep }"
      >
        <div class="d-flex align-items-center">
          <div
            v-if="index > 0"
            class="separator"
            :class="{ 'separator-is-login-user': step.num <= currentStep }"
          ></div>
          <div class="d-flex align-items-center flex-column">
            <div
              class="d-flex align-items-center justify-content-center flex-column step"
              :class="{ 'step-is-login-user': step.num <= currentStep }"
            >
              {{ step.num }}
            </div>
            <span>
              {{ step.label }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/scss/mixins' as m;

.command-progress {
  margin: 40px 5px 0 5px;
  .separator {
    border: 1px dashed var(--gray-3);
    width: 100px;
    margin: 0 5px;
    &.separator-is-login-user {
      border: 1px solid var(--success-2);
    }
  }
  .step {
    border: var(--border);
    border-radius: 50%;
    height: 55px;
    width: 55px;
    font-size: 12px;
    color: var(--gray-3);
    background-color: var(--text-primary-color);
    &.step-is-login-user {
      background-color: #38ada9;
      color: var(--text-primary-color);
      font-weight: bold;
    }
  }
  span {
    font-size: 12px;
    color: var(--gray-3);
    position: relative;
    top: 10px;
  }
}
</style>
