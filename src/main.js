import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { createI18n } from 'vue-i18n'
import es from './locales/es.json'
import en from './locales/en.json'

import '@mdi/font/css/materialdesignicons.css'

// Lee el modo oscuro guardado o usa false por defecto
const savedDark = localStorage.getItem('dark') === 'true'

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
  },
  theme: {
    defaultTheme: savedDark ? 'dark' : 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          background: '#FFFFFF',
          surface: '#FFFFFF',
          primary: '#1867C0',
          secondary: '#48A9A6',
          error: '#B00020',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00'
        }
      },
      dark: {
        dark: true,
        colors: {
          background: '#121212',
          surface: '#2c2c2cff',
          primary: '#2196F3',
          secondary: '#03DAC6',
          error: '#B00020',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00'
        }
      }
    },
  },
})

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('locale') || 'es',
  fallbackLocale: 'es',
  messages: { es, en },
})

createApp(App).use(router).use(vuetify).use(i18n).mount('#app')


