<template>
  <div class="text-center pa-12">
    <h1 class="text-h2 mb-4">404</h1>
    <p class="text-subtitle-1 mb-6">
      {{ $t('errors.page_not_found') || 'Página no encontrada' }}
    </p>
    <router-link to="/login">
      <v-btn color="primary">{{ $t('errors.go_home') || 'Volver al inicio' }}</v-btn>
    </router-link>
  </div>
</template>
