<template>
  <v-dialog v-model="modelValue" persistent max-width="700">
    <v-card
      class="rounded-xl pa-6"
      :style="{
        backgroundColor: '',
        color: 'var(--v-theme-on-surface)'
      }"
    >
      <v-card-title class="text-h5 font-weight-bold mb-4">{{ t('config_account.preferences') }}</v-card-title>

      <v-row>
        <!-- Lista lateral -->
        <v-col cols="4">
          <v-list dense nav>
            <v-list-item
              v-for="item in secciones"
              :key="item.key"
              :value="item.key"
              @click="seccionActiva = item.key"
              :style="seccionActiva === item.key
                ? { backgroundColor: 'var(--v-theme-primary)', color: 'var(--v-theme-on-primary)' }
                : { cursor: 'pointer' }"
              @mouseenter="hoveredItem = item.key"
              @mouseleave="hoveredItem = null"
              :class="['rounded-lg mb-2']"
            >
              <template #prepend>
                <v-icon
                  :style="seccionActiva === item.key
                    ? { color: 'var(--v-theme-on-primary)' }
                    : { color: 'var(--v-theme-on-surface-variant)' }"
                >
                  {{ item.icon }}
                </v-icon>
              </template>
              <v-list-item-title>{{ item.label }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-col>

        <!-- Contenido sección activa -->
        <v-col cols="8">
          <div v-if="seccionActiva === 'language'">
             <LanguageSelector />
          </div>

          <div v-else-if="seccionActiva === 'sounds'">
            <p :style="{ color: 'var(--v-theme-on-surface-variant)' }">Configuraciones de sonido próximamente...</p>
          </div>

          <div v-else-if="seccionActiva === 'appearance'">
            <DarkModeToggle />
          </div>
        </v-col>
      </v-row>

      <v-card-actions class="justify-end mt-6">
        <v-btn
        color="error"
        variant="elevated"
        @click="modelValue = false"
      >
      {{ t('config_account.close') }}
      </v-btn>

      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, onMounted, watch  } from 'vue'
import { useI18n } from 'vue-i18n'
import DarkModeToggle from '@/components/DarkModeToggle.vue'
import LanguageSelector from '@/components/LanguageSelector.vue'
//import { t } from 'i18next'
const { t, locale } = useI18n()

const props = defineProps({ show: Boolean })
const emit = defineEmits(['update:show'])

const modelValue = computed({
  get: () => props.show,
  set: (val) => emit('update:show', val),
})

const seccionActiva = ref('')
const hoveredItem = ref(null)
const idiomaSeleccionado = ref('es')

const secciones = computed(() => [
  //{ key: 'sounds', label: t('config_account.sounds'), icon: 'mdi-music' },
  { key: 'appearance', label: t('config_account.appearance'), icon: 'mdi-palette' },
  { key: 'language', label: t('config_account.language'), icon: 'mdi-translate' },
])


watch(modelValue, (nuevoValor) => {
  if (!nuevoValor) {
    seccionActiva.value = ''
  }
})

</script>
