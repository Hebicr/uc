<template>
  <div class="text-center pa-12">
    <h1 class="text-h2 mb-4">404</h1>
    <p class="text-subtitle-1 mb-6">
      {{ $t('errors.page_not_found') }}
    </p>
    <v-btn color="primary" @click="goHome">
      {{ $t('errors.go_home') }}
    </v-btn>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goHome() {
  const token = localStorage.getItem('token')
  if (token) {
    router.push({ name: 'main' })
  } else {
    router.push({ name: 'login' })
  }
}
</script>
