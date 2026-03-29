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
  <section class="command-progress">
    <div
      v-for="(step, index) in steps"
      :key="index"
      class="{ 'is-login-user': step.num <= currentStep }"
    >
      <div class="command-progress__step">
        <div
          v-if="index > 0"
          class="separator"
          :class="{ 'separator-is-login-user': step.num <= currentStep }"
        ></div>
        <div class="#">
          <div class="step" :class="{ 'step-is-login-user': step.num <= currentStep }">
            {{ step.num }}
          </div>
          <span>
            {{ step.label }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/assets/scss/mixins' as m;

.command-progress {
  margin: 40px 5px 0 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  &__step {
    display: flex;
    align-items: center;
    .separator {
      border: 1px dashed var(--gray-3);
      width: 100px;
      margin-right: 5px;
      margin-left: 5px;
      position: relative;
      bottom: 5px;
      &.separator-is-login-user {
        border: 1px solid var(--success-2);
      }
    }
    .step {
      display: flex;
      justify-content: center;
      align-items: center;
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
}

@media (max-width: 991.98px) {
  .command-progress {
    .separator {
      width: 50px;
      margin-right: 3px;
      margin-left: 3px;
    }
    .step {
      font-size: 12px;
    }
  }
}

@media (max-width: 767.98px) {
  .command-progress {
    .separator {
      width: 25px;
      margin-right: 3px;
      margin-left: 3px;
    }
  }
}
</style>
