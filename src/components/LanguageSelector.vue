<template>
  <div class="d-flex justify-center" style="gap: 24px; width: 100%;">
    <v-card
      v-for="lang in languages"
      :key="lang.code"
      class="language-card d-flex flex-column align-center justify-center"
      :class="{ 'language-card--selected': lang.code === currentLocale }"
      @click="changeLocale(lang.code)"
    >
      <img :src="lang.flag" :alt="`Bandera de ${lang.label}`" width="64" height="42" />
      <span class="text-h5 mt-3">{{ lang.label }}</span>
    </v-card>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import flagEs from '@/assets/flags/cr2.png'
import flagGb from '@/assets/flags/us2.png'

const { locale } = useI18n()

const languages = [
  { code: 'es', label: 'Español', flag: flagEs },
  { code: 'en', label: 'English', flag: flagGb },
]

const currentLocale = computed(() => locale.value)

function changeLocale(code) {
  locale.value = code
  localStorage.setItem('locale', code)
}
</script>

<style scoped>
.language-card {
  cursor: pointer;
  border: 3px solid transparent;
  border-radius: 16px;
  transition: all 0.3s ease;
  flex-grow: 1;
  max-width: 200px; /* límite máximo para que no sea demasiado ancho */
  height: 140px;
  text-align: center;
  padding: 16px;
  user-select: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.language-card--selected {
  border: 5px solid #2979ff;
  background-color: var(--v-theme-primary);
  color: var(--v-theme-on-primary);
  box-shadow: 0 0 15px #2979ffaa;
}
</style>
