<template>
  <v-row class="justify-center" style="gap: 16px;">
    <v-col
      v-for="themeOption in themes"
      :key="themeOption.key"
      cols="5"
    >
      <v-card
        class="d-flex align-center justify-between px-4 py-6"
        :elevation="currentTheme === themeOption.key ? 8 : 2"
        :style="{
          cursor: 'pointer',
          backgroundColor: currentTheme === themeOption.key ? 'var(--v-theme-primary)' : 'var(--v-theme-surface)',
          color: currentTheme === themeOption.key ? 'var(--v-theme-on-primary)' : 'var(--v-theme-on-surface-variant)',
          border: currentTheme === themeOption.key ? '4px solid #2979ff' : '3px solid transparent',
          borderRadius: '12px',
          boxShadow: currentTheme === themeOption.key ? '0 0 10px #2979ffaa' : 'none'
        }"
        @click="changeTheme(themeOption.key)"
      >
        <div class="d-flex align-center" style="gap: 12px;">
          <v-icon size="32">{{ themeOption.icon }}</v-icon>
          <span class="text-h6">{{ themeOption.label }}</span>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useTheme } from 'vuetify'
import { useI18n } from 'vue-i18n'

const theme = useTheme()
const { t } = useI18n()

const themes = [
  { key: 'light', label: computed(() => t('config_account.themes.light')) , icon: 'mdi-white-balance-sunny' },
  { key: 'dark', label: computed(() => t('config_account.themes.dark')), icon: 'mdi-weather-night' },
  { key: 'blueNight', label: computed(() => t('config_account.themes.blueNight')), icon: 'mdi-snowflake' },
  { key: 'softLight', label: computed(() => t('config_account.themes.softLight')), icon: 'mdi-weather-sunny' },
]

const currentTheme = computed(() => theme.global.name.value || 'light')

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme && themes.some(t => t.key === savedTheme)) {
    theme.global.name.value = savedTheme
  }
})

function changeTheme(key) {
  if (themes.some(t => t.key === key)) {
    theme.global.name.value = key
    localStorage.setItem('theme', key)
  }
}
</script>
