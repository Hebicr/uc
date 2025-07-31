<template>
  <v-container class="mt-12">
    <v-card>
      <v-card-title>Bienvenido al Dashboard</v-card-title>
      <v-card-text>
        Esta es una vista protegida. Solo se puede ver si estás autenticado.
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>

import { useRouter } from 'vue-router'

const router = useRouter()

const logout = () => {
  localStorage.removeItem('token')
  router.push('/')
}
</script>
