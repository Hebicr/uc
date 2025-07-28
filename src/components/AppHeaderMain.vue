<!-- AppHeaderMain.vue -->
<template>
  <div>
    <v-app-bar app color="primary" dark>
      <!-- botón menú -->
      <v-app-bar-nav-icon @click="toggleDrawer" />
      <!-- título -->
      <div class="clickable app-bar-title-text" @click="goMain">
        {{ $t('main.title') }}
      </div>
      <!-- menú usuario -->
      <v-menu app color="primary" dark v-model="menu" :close-on-content-click="false" location="end" offset-y min-width="auto">
        <template #activator="{ props }">
          <v-btn v-bind="props" icon rounded="full">
            <v-icon size="30">mdi-account-circle</v-icon>
          </v-btn>
        </template>
        <v-sheet elevation="2" rounded="lg" class="pa-4" :color="surfaceColor">
          <v-list density="comfortable" nav>
            <v-list-item class="clickable" prepend-icon="mdi-account-circle" :title="$t('menu_account.account')" />
            <v-divider class="my-2" />
            <v-list-item
              class="clickable"
              prepend-icon="mdi-cog-outline"
              :title="$t('menu_account.preferences')"
              @click="openConfigModal"
            />
            <v-divider class="my-2" />
            <v-list-item @click="logout" class="clickable" style="color: red;">
              <v-icon left>mdi-logout</v-icon> {{ $t('menu_account.logoff') }}
            </v-list-item>
          </v-list>
        </v-sheet>
      </v-menu>
    </v-app-bar>

    <!-- drawer controlado -->
    <v-navigation-drawer permanent v-model:modelValue="drawer" app color="surface" width="256">
      <v-list nav dense>
        <v-list-item>
          <div>
            <div class="text-h6">{{ $t('drawerLeft.title') }}</div>
          </div>
        </v-list-item>
        <v-divider class="my-2" />
        <v-list-item :to="{ name: 'users' }" link>
          <v-icon left>mdi-account-circle</v-icon> {{ $t('drawerLeft.users') }}
        </v-list-item>
        <v-list-item link>
          <v-icon left>mdi-cog-outline</v-icon> {{ $t('drawerLeft.config') }}
        </v-list-item>
        <v-divider class="my-2" />
        <v-list-item @click="logout" class="clickable" style="color: red;">
          <v-icon left>mdi-logout</v-icon> {{ $t('menu_account.logoff') }}
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- modal configuración cuenta -->
    <ModalAppConfigAccount v-model:show="ModalAppConfigAccountShow" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTheme } from 'vuetify'
import ModalAppConfigAccount from '@/components/AppModalConfigAccount.vue'
import api from '@/api/axios'

const router = useRouter()
const menu = ref(false)
const drawer = ref(false)
const theme = useTheme()

const surfaceColor = computed(() => theme.current.value.colors.surface)

function toggleDrawer() {
  drawer.value = !drawer.value
}

async function goMain() {
  const token = localStorage.getItem('token')
  if (!token) {
    return router.push({ name: 'login' })
  }

  try {
    await api.post('/api/validate-token', {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
    router.push({ name: 'main' })
  } catch (error) {
    localStorage.removeItem('token')
    router.push({ name: 'login', query: { error: 'session expired' } })
  }
}

const logout = async () => {
  try {
    await api.post('/api/logout', {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
  } catch (err) {
    console.warn('Error al cerrar sesión (posiblemente token inválido):', err)
    // No hace falta mostrar error si falla, ya estamos cerrando sesión
  } finally {
    localStorage.removeItem('token')
    menu.value = false
    router.push({ name: 'login' })
  }
}

const ModalAppConfigAccountShow = ref(false)

function openConfigModal() {
  menu.value = false
  ModalAppConfigAccountShow.value = true
}
</script>

<style scoped>
.clickable {
  cursor: pointer;
}

.app-bar-title-text {
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  text-align: left;
  margin-right: auto;
  font-size: 1.25rem;
  font-weight: 500;
  color: white;
}
</style>
