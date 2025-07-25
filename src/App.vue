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

const currentHeader = computed(() => {
  if (route.name === 'login') return AppHeaderLogin
  if (route.name === 'main') return AppHeaderMain
  return AppHeaderLogin // header por defecto para otras rutas
})
</script>
