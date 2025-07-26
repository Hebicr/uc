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

const savedTheme = localStorage.getItem('theme') || 'light'

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
  },
  theme: {
    defaultTheme: savedTheme,
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
      },
      blueNight: {
        dark: true,
        colors: {
          background: '#0D1B2A',
          surface: '#1B263B',
          primary: '#415A77',
          secondary: '#778DA9',
          error: '#E63946',
          info: '#00B4D8',
          success: '#06D6A0',
          warning: '#FFD166'
        }
      },
      softLight: {
        dark: false,
        colors: {
          background: '#F5F5F5',
          surface: '#FFFFFF',
          primary: '#8EACBB',
          secondary: '#B0BEC5',
          error: '#D32F2F',
          info: '#1976D2',
          success: '#388E3C',
          warning: '#FBC02D'
        }
      }
    }
  }
})

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('locale') || 'es',
  fallbackLocale: 'es',
  messages: { es, en },
})

createApp(App).use(router).use(vuetify).use(i18n).mount('#app')


