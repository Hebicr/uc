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

const mainLayoutRoutes = ['main', 'users', 'settings', 'dashboard']

const currentHeader = computed(() => {
  if (route.name === 'login') return AppHeaderLogin
  if (mainLayoutRoutes.includes(route.name)) return AppHeaderMain
  return AppHeaderLogin
})
</script>
