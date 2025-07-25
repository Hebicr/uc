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
    <v-navigation-drawer v-model:modelValue="drawer" app color="surface" width="256">
      <v-list nav dense>
        <v-list-item>
          <div>
            <div class="text-h6">My Application</div>
            <div class="text-subtitle-1">Vuetify</div>
          </div>
        </v-list-item>
        <v-divider class="my-2" />
        <v-list-item link>
          <v-list-item-title>List Item 1</v-list-item-title>
        </v-list-item>
        <v-list-item link>
          <v-list-item-title>List Item 2</v-list-item-title>
        </v-list-item>
        <v-list-item link>
          <v-list-item-title>List Item 3</v-list-item-title>
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

const router = useRouter()
const menu = ref(false)
const drawer = ref(false)
const theme = useTheme()

const surfaceColor = computed(() => theme.current.value.colors.surface)

function toggleDrawer() {
  drawer.value = !drawer.value
}

function goMain() {
  router.push({ name: 'main' })
}

const logout = () => {
  localStorage.removeItem('token')
  router.push({ name: 'login' })
  menu.value = false
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
