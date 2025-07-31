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
        background: '#F8FAFC',         // gris muy claro azulado
        surface: '#FFFFFF',            // blanco puro
        primary: '#2563EB',            // azul intenso y moderno (Tailwind blue-600)
        secondary: '#38BDF8',          // azul celeste (Tailwind sky-400)
        error: '#EF4444',              // rojo suave (Tailwind red-500)
        info: '#0EA5E9',               // info celeste (Tailwind sky-500)
        success: '#22C55E',            // verde brillante (Tailwind green-500)
        warning: '#FACC15'             // amarillo dorado (Tailwind yellow-400)
      }
    },
    dark: {
      dark: true,
      colors: {
        background: '#121212',         // negro suave
        surface: '#1E1E1E',            // gris oscuro puro
        primary: '#3B82F6',            // azul brillante (Tailwind blue-500)
        secondary: '#06B6D4',          // cian claro (Tailwind cyan-400)
        error: '#F87171',              // rojo claro (Tailwind red-400)
        info: '#60A5FA',               // azul claro (Tailwind blue-400)
        success: '#4ADE80',            // verde claro (Tailwind green-400)
        warning: '#FBBF24'             // amarillo suave (Tailwind yellow-400)
      }
    },
    blueNight: {
      dark: true,
      colors: {
        background: '#0F172A',         // azul marino profundo
        surface: '#1E293B',            // gris azulado oscuro
        primary: '#3B82F6',            // azul fuerte
        secondary: '#64748B',          // gris azulado claro
        error: '#F87171',
        info: '#38BDF8',
        success: '#34D399',
        warning: '#FACC15'
      }
    },
    softLight: {
      dark: false,
      colors: {
        background: '#F1F5F9',         // gris pálido (Tailwind slate-100)
        surface: '#FFFFFF',
        primary: '#64748B',            // gris azulado (Tailwind slate-500)
        secondary: '#A1A1AA',          // gris suave (Tailwind zinc-400)
        error: '#EF4444',
        info: '#3B82F6',
        success: '#10B981',
        warning: '#EAB308'
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


