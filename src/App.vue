<!-- App.vue -->
<template>
  <v-app>
    <component :is="currentHeader" />
    <v-main>
      <v-container class="pa-4">
        <router-view />
      </v-container>
    </v-main>
    <AppFooter />
  </v-app>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import AppFooter from '@/components/AppFooter.vue'
import AppHeaderLogin from '@/components/AppHeaderLogin.vue'
import AppHeaderMain from '@/components/AppHeaderMain.vue'

const route = useRoute()

const mainLayoutRoutes = new Set(['main', 'users', 'settings', 'dashboard'])
const noHeaderRoutes = new Set(['login']) // Puedes agregar más aquí

const currentHeader = computed(() => {
  if (noHeaderRoutes.has(route.name)) return null
  if (mainLayoutRoutes.has(route.name)) return AppHeaderMain
  return AppHeaderLogin
})


</script>

<style scoped>
body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}
</style>
