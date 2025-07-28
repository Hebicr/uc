<!-- src/views/UsersView.vue -->
<template>
  <v-card>
    <v-card-title>
    <v-row class="align-center" style="width: 100%">
        <v-col cols="6">
        {{ $t('usersView.users') }}
        </v-col>
        <v-col cols="6" class="d-flex justify-end" >
        <v-btn color="primary" @click="fetchUsers" prepend-icon="mdi-refresh" class="me-2">
            {{ $t('usersView.refresh') }}
        </v-btn>
        <v-btn color="success" @click="openAddUserDialog" prepend-icon="mdi-plus">
            {{ $t('usersView.addUser') }}
        </v-btn>
        </v-col>
    </v-row>
    </v-card-title>


    <v-data-table
    :headers="headers"
    :items="users"
    :loading="loading"
    class="elevation-1"
    item-value="id"
    show-headers
    >
      <template #item.actions="{ item }">
        <v-btn icon size="small" color="primary" @click="editUser(item)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon size="small" color="error" @click="deleteUser(item)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>

      <template #no-data>
        {{ $t('messages.noData') }}
      </template>
    </v-data-table>
  </v-card>

  <<v-dialog v-model="dialog" max-width="400px" persistent>
  <v-card>
    <v-card-title>{{ $t('usersView.addUser') }}</v-card-title>
    <v-card-text>
      <v-text-field v-model="newEmail" :label="$t('usersView.email')" required />
      <v-text-field
        v-model="newPassword"
        :label="$t('usersView.password')"
        type="password"
        required
      />
      <v-text-field
        v-model="confirmPassword"
        :label="$t('usersView.confirmPassword')"
        type="password"
        required
        :error="passwordsDoNotMatch"
        :error-messages="passwordsDoNotMatch ? $t('usersView.passwordMismatch') : ''"
      />
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn text color="error" @click="closeAddUserDialog">{{ $t('buttons.cancel') }}</v-btn>
      <v-btn color="success" @click="addUser">{{ $t('buttons.save') }}</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const users = ref([])
const loading = ref(false)
const dialog = ref(false)
const newEmail = ref('')
const newPassword = ref('')
const BASE_URL = import.meta.env.VITE_API_URL
const { t } = useI18n()

const headers = computed(() => [
  { text: t('usersView.id'), value: 'id' },
  { text: t('usersView.email'), value: 'email' },
  { text: t('usersView.actions'), value: 'actions', sortable: false },
])

const fetchUsers = async () => {
  loading.value = true
  try {
    const token = localStorage.getItem('token')

    const response = await fetch(`${BASE_URL}/api/users`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!response.ok) throw new Error('Acceso no autorizado')

    users.value = await response.json()
  } catch (error) {
    console.error('Error al obtener usuarios:', error)
  } finally {
    loading.value = false
  }
}

const openAddUserDialog = () => {
  newEmail.value = ''
  newPassword.value = ''
  dialog.value = true
}

const closeAddUserDialog = () => {
  dialog.value = false
}

const addUser = async () => {
  try {
    const token = localStorage.getItem('token')

    const response = await fetch(`${BASE_URL}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email: newEmail.value,
        password: newPassword.value,
      }),
    })

    if (!response.ok) {
      const errData = await response.json()
      throw new Error(errData.error || 'Error al crear usuario')
    }

    const createdUser = await response.json()
    users.value.push(createdUser)
    closeAddUserDialog()
  } catch (error) {
    console.error('Error al agregar usuario:', error)
  }
}

const editUser = (user) => {
  console.log('Editar usuario:', user)
}

const deleteUser = (user) => {
  console.log('Eliminar usuario:', user)
}

onMounted(fetchUsers)
</script>

