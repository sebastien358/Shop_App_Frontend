<script setup lang="ts">
import CommandProgress from '@/templates/commandProgress/CommandProgress.vue'
import { useRouter } from 'vue-router'
import { ref } from "vue";

const router = useRouter()
const currentStep = ref<number>(4)

const goToHome = () => {
  router.push({ path: '/' })
}
</script>

<template>
  <CommandProgress :currentStep="currentStep" />
  <div class="finish-container">
    <h1>Merci pour votre commande !</h1>
    <p>Votre paiement a été effectué avec succès.</p>
    <p>Vous allez recevoir un email de confirmation de commande sous peu.</p>
    <button @click="goToHome" class="btn btn-finish">Retour à l'accueil</button>
  </div>
</template>

<style scoped lang="scss">
.finish-container {
  text-align: center;
  margin-top: 150px;
  h1 {
    font-size: 24px;
    margin-bottom: 20px;
  }
  p {
    font-size: 18px;
    margin-bottom: 20px;
  }
}
</style>
