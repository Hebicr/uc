<template>
  <v-app-bar app color="primary" dark>
    <v-container class="d-flex align-center justify-space-between" fluid>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
      <v-app-bar-title>Application Bar</v-app-bar-title>

      <v-menu app color="primary" dark
        v-model="menu"
        :close-on-content-click="false"
        location="end"
        offset-y
        min-width="auto"
      >
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            icon
            rounded="full"
          >
            <v-icon size="30">mdi-account-circle</v-icon>
          </v-btn>
        </template>

        <v-sheet
        elevation="2"
        rounded="lg"
        class="pa-4"
        :color="surfaceColor"
        >
        <v-list density="comfortable" nav>

            <v-list-item class="clickable"prepend-icon="mdi-account-circle":title="$t('menu_account.account')"/>


            <v-divider class="my-2" />

            <v-list-item class="clickable" prepend-icon="mdi-cog-outline":title="$t('menu_account.preferences')" @click="openConfigModal"/>

            <v-divider class="my-2" />

            <!-- Cerrar sesión -->
            <v-list-item @click="logout" class="clickable" style="color: red;">
                <v-icon left>mdi-logout</v-icon> {{ $t('menu_account.logoff') }}
            </v-list-item>

        </v-list>
        </v-sheet>


        
      </v-menu>
    </v-container>
  </v-app-bar>
  <ModalAppConfigAccount v-model:show="ModalAppConfigAccountShow" />
  
</template>

<style scoped>
.clickable {
  cursor: pointer;
}
</style>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTheme } from 'vuetify'
import ModalAppConfigAccount from '@/components/AppModalConfigAccount.vue'

const router = useRouter()
const menu = ref(false)
const theme = useTheme()

// ✅ Computar el color de fondo actual
const surfaceColor = computed(() => theme.current.value.colors.surface)

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

