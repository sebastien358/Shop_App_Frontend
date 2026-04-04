<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore.ts'
import { useRouter } from 'vue-router'
import { onMounted, reactive } from 'vue'
import Calc from '@/templates/calc/Calc.vue'

const authStore = useAuthStore()

const router = useRouter()

// Menu déroulant

const state = reactive<{
  activeDropdown: string | null
  open: boolean
}>({
  activeDropdown: '',
  open: false,
})

const openDropdown = (DropType: string | null) => {
  state.activeDropdown = DropType
}

const closeDropdown = () => {
  state.activeDropdown = null
}

const toggleMenuMobile = () => {
  state.open = !state.open
}

// Gestion de connexion

const isLoggedIn = () => {
  return authStore.isLoggedIn
}

// Gestion des roles

const isAdmin = () => {
  return authStore.isAdmin
}

const isUser = () => {
  return authStore.isUser
}

// Déconnexion

const logout = () => {
  authStore.logout()
  router.push({ path: '/login' })
}

// Récupération de l'ID utlisateur, puis redirection et modification des données

onMounted(async () => {
  try {
    await authStore.infoMe()
  } catch (e) {
    console.error(e)
  }
})
</script>

<template>
  <header class="header">
    <div class="header__content">
      <!-- Logo -->
      <router-link to="/" class="header__logo">
        <img src="@/assets/images/3030285.webp" />
        <h1>Dyma</h1>
      </router-link>
      <!-- Menu  Desktop -->
      <section class="header__menu">
        <div class="mr-10">
          <router-link to="/">Boutique</router-link>
        </div>
        <!-- admin -->
        <div
          v-if="isAdmin()"
          class="dropdown"
          @mouseover="openDropdown('admin')"
          @mouseout="closeDropdown()"
        >
          <a href="#">Espace pro</a>
          <div class="dropdown__menu" :class="{ show: state.activeDropdown === 'admin' }">
            <div class="dropdown__menu__link">
              <router-link to="/command/list">Les commandes</router-link>
              <router-link to="/product-list">Les produits</router-link>
              <router-link to="/product-form">Ajouter un Produit</router-link>
              <router-link :to="{ name: 'account-user-edit', params: { id: authStore.userId } }"
                >Modifier mon compte</router-link
              >
            </div>
            <div class="dropdown-divider"></div>
          </div>
        </div>
        <!-- user -->
        <div
          v-if="isUser()"
          class="dropdown"
          @mouseover="openDropdown('user')"
          @mouseout="closeDropdown()"
          :class="[isAdmin() ? 'no-profile-user' : null]"
        >
          <a href="#">Profil</a>
          <div class="dropdown__menu" :class="{ show: state.activeDropdown === 'user' }">
            <div class="dropdown__menu__link">
              <router-link to="/command/user/list">Mes commandes</router-link>
              <router-link :to="{ name: 'account-user-edit', params: { id: authStore.userId } }"
                >Modifier mon compte</router-link
              >
            </div>
            <div class="dropdown-divider"></div>
          </div>
        </div>
      </section>
    </div>
    <!-- Authentification -->
    <section class="hide-menu">
      <div v-if="!isLoggedIn()" class="d-flex align-items-center">
        <div class="mr-10">
          <router-link :to="{ path: '/register' }">Inscription</router-link>
        </div>
        <div>
          <router-link :to="{ path: '/login' }">Connexion</router-link>
        </div>
      </div>
      <div v-else>
        <div>
          <a @click="logout()" href="#">Déconnexion</a>
        </div>
      </div>
    </section>
  </header>

  <!-- MENU TABLET -->

  <header class="tablet">
    <!-- Logo -->
    <router-link to="/" class="tablet__logo">
      <img src="@/assets/images/3030285.webp" />
      <h1>Dyma</h1>
    </router-link>
    <font-awesome-icon @click="toggleMenuMobile()" icon="fa-solid fa-bars" />
    <div v-if="state.open" class="tablet__menu">
      <div>
        <router-link to="/">Boutique</router-link>
      </div>
      <!-- admin -->
      <section v-if="isAdmin()" class="dropdown-tablet">
        <div class="dropdown-tablet__menu" :class="{ show: state.activeDropdown === 'admin' }">
          <div class="dropdown-tablet__menu__link">
            <router-link to="/command/list">Les commandes</router-link>
            <router-link to="/product-list">Les produits</router-link>
            <router-link to="/product-form">Ajouter un Produit</router-link>
            <router-link :to="{ name: 'account-user-edit', params: { id: authStore.userId } }"
              >Modifier mon compte</router-link
            >
          </div>
          <div class="dropdown-divider"></div>
        </div>
      </section>
      <!-- user -->
      <section
        v-if="isUser()"
        class="dropdown-tablet"
        :class="[isAdmin() ? 'no-profile-user' : true]"
      >
        <div class="dropdown-tablet__menu">
          <div class="dropdown-tablet__menu__link">
            <router-link to="/command/user/list">Mes commandes</router-link>
            <router-link :to="{ name: 'account-user-edit', params: { id: authStore.userId } }"
              >Modifier mon compte</router-link
            >
          </div>
          <div class="dropdown-divider"></div>
        </div>
      </section>
      <!-- Authentification -->
      <section v-if="!isLoggedIn()">
        <div>
          <router-link :to="{ path: '/register' }">Inscription</router-link>
        </div>
        <div>
          <router-link :to="{ path: '/login' }">Connexion</router-link>
        </div>
      </section>
      <section v-else>
        <div>
          <a @click="logout()" href="#">Déconnexion</a>
        </div>
      </section>
    </div>
  </header>
  <!-- Calc -->
  <Calc :open="state.open" @close="state.open = false" :transparent="true" />
</template>

<style scoped lang="scss">
@use '@/assets/scss/mixins' as m;

/*=========================
  Header
======================== */

a {
  text-decoration: none;
  color: white;
  font-size: 14px;
}

.router-link-active {
  text-decoration: underline;
}

.header {
  padding: 0 10px 0 5px;
  background-color: var(--primary-1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  @media (max-width: 991.98px) {
    display: none;
  }
  &__content {
    display: flex;
    align-items: center;
    color: var(--text-primary-color);
  }
  &__logo {
    display: flex;
    align-items: center;
    img {
      height: 28px;
      width: auto;
      margin-right: 3px;
    }
    h1 {
      font-size: 16px;
      color: var(--text-primary-color);
      margin-right: 20px;
    }
  }
  &__menu {
    display: flex;
    align-items: center;
  }
}

/*=========================
  Menu desktop
======================== */

.dropdown {
  z-index: 2;
  position: relative;
  &.no-profile-user {
    display: none;
  }
  &__menu {
    position: absolute;
    box-shadow:
      var(--gray-2) 0px 6px 12px -2px,
      var(--gray-2) 0px 3px 7px -3px;
    padding: 10px 12px;
    background-color: var(--text-primary-color);
    top: 35px;
    left: 0;
    visibility: hidden;
    opacity: 0.5;
    transition: all 500ms ease;
    width: 290px;
    @media (max-width: 991.98px) {
      width: 150px;
      position: initial;
      box-shadow: none;
      padding: 0;
    }
    &.show {
      opacity: 1;
      visibility: visible;
    }
  }
  &__menu__link {
    line-height: 26px;
    display: flex;
    flex-direction: column;
    color: var(--gray-3);
  }
  &__menu__link a {
    font-size: 13px;
    color: var(--gray-3);
  }
  .dropdown-divider {
    border-bottom: var(--border);
    margin-top: 10px;
  }
}

/*=========================
  Tablet
======================== */

.tablet {
  display: none;
  z-index: 2;
  position: relative;
  padding: 0 10px 0 5px;
  background-color: var(--primary-1);
  @media (max-width: 991.98px) {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  &__logo {
    display: flex;
    align-items: center;
    img {
      height: 28px;
      width: auto;
      margin-right: 3px;
    }
    h1 {
      font-size: 16px;
      color: var(--text-primary-color);
      margin-right: 20px;
    }
  }
  .fa-bars {
    cursor: pointer;
    color: var(--text-primary-color);
    font-size: 20px;
  }
  &__menu {
    position: absolute;
    background-color: var(--text-primary-color);
    border: var(--border);
    padding: 20px 20px;
    top: 52px;
    right: 5px;
    line-height: 30px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    a {
      font-size: 14px;
      color: var(--gray-3);
    }
    .dropdown-menu-link a {
      font-size: 14px;
      color: var(--gray-3);
    }
  }
}

/*=========================
  Menu tablet
======================== */

.dropdown-tablet {
  z-index: 2;
  position: relative;
  &.no-profile-user {
    display: none;
  }
  &__menu {
    position: absolute;
    box-shadow:
      var(--gray-2) 0px 6px 12px -2px,
      var(--gray-2) 0px 3px 7px -3px;
    padding: 10px 12px;
    background-color: var(--text-primary-color);
    transition: all 500ms ease;
    width: 290px;
    @media (max-width: 991.98px) {
      width: 150px;
      position: inherit;
      box-shadow: none;
      padding: 0;
    }
  }
  &__menu__link {
    line-height: 26px;
    display: flex;
    flex-direction: column;
    color: var(--gray-3);
  }
  &__menu__link a {
    font-size: 13px;
    color: var(--gray-3);
  }
  .dropdown-divider {
    border-bottom: var(--border);
    margin-top: 10px;
  }
}
</style>
