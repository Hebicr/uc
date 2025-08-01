<!-- src/views/UsersView.vue -->
<template>
  <v-card>
    <v-card-title>
      <v-row class="align-center" style="width: 100%">
        <v-col cols="6">
          {{ $t('usersView.users') }}
        </v-col>
        <v-col cols="6" class="d-flex justify-end">
          <v-btn color="primary" @click="fetchUsers" prepend-icon="mdi-refresh" class="me-2">
            {{ $t('usersView.refresh') }}
          </v-btn>
          <v-btn color="success" @click="openAddUserDialog" prepend-icon="mdi-account-plus">
            {{ $t('usersView.addUser') }}
          </v-btn>
        </v-col>
      </v-row>
    </v-card-title>

    <v-data-table v-if="translatedHeaders.length" :headers="translatedHeaders" :items="users" :loading="loading" class="elevation-1" item-value="id" show-headers>
      <template #item.actions="{ item }">
        <v-btn variant="elevated" color="primary" class="me-2" size="small" @click="editUser(item)">
          <v-icon start>mdi-pencil</v-icon>
          {{ $t('buttons.edit') }}
        </v-btn>

        <v-btn variant="elevated" color="error" size="small" @click="deleteUser(item)">
          <v-icon start>mdi-delete</v-icon>
          {{ $t('buttons.delete') }}
        </v-btn>
      </template>

      <template #no-data>
        {{ $t('messages.noData') }}
      </template>
    </v-data-table>
  </v-card>

  <v-dialog v-model="dialog" max-width="500px" transition="dialog-bottom-transition" persistent>
    <v-card elevation="3" class="rounded-x0">
      <v-card-title class="text-h6 font-weight-bold">
        <v-icon start class="me-2">mdi-account-plus</v-icon>
        {{ $t('usersView.addUser') }}
      </v-card-title>

      <v-card-text class="pt-2">
        <v-form ref="formNewUser">
          <v-text-field
            v-model="newEmail"
            :label="$t('usersView.email')"
            :rules="emailRules"
            type="email"
            autocomplete="off"
            density="comfortable"
            prepend-inner-icon="mdi-email-outline"
            required
          />
          <v-text-field
            v-model="newPassword"
            :label="$t('usersView.password')"
            :rules="passwordRules"
            type="password"
            autocomplete="off"
            density="comfortable"
            prepend-inner-icon="mdi-lock-outline"
            required
          />
          <v-text-field
            v-model="confirmPassword"
            :label="$t('usersView.confirmPassword')"
            :rules="confirmPasswordRules"
            type="password"
            autocomplete="off"
            density="comfortable"
            prepend-inner-icon="mdi-lock-check"
            required
          />
          <v-combobox
            v-model="selectedRole"
            :label="t('usersView.role')"
            :rules="roleRules"
            density="compact"
            :items="roleItems"
            item-title="title"
            item-value="value"
            required
            clearable
            :editable="false"
          />

        </v-form>
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn variant="elevated" color="error" class="me-2" size="small" @click="closeAddUserDialog">
          <v-icon start>mdi-close</v-icon>
          {{ $t('buttons.cancel') }}
        </v-btn>
        <v-btn variant="elevated" color="success" size="small" @click="addUser">
          <v-icon start>mdi-content-save-all-outline</v-icon>
          {{ $t('buttons.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, onMounted, computed, watch  } from 'vue'
import { useI18n } from 'vue-i18n'

const users = ref([])
const loading = ref(false)
const dialog = ref(false)
const newEmail = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const selectedRole = ref('')
const formNewUser = ref(null)
const BASE_URL = import.meta.env.VITE_API_URL
const { t ,locale} = useI18n()
const translatedHeaders = ref([])



const headers = ref([
  { textKey: 'usersView.id', value: 'id' },
  { textKey: 'usersView.email', value: 'email' },
  { textKey: 'usersView.role', value: 'role' },
  { textKey: 'usersView.actions', value: 'actions', sortable: false },
])
const roleValues = ['admin', 'user', 'supervisor']

const roleItems = computed(() =>
  roleValues.map(role => ({
    value: role,
    title: t(`roles.${role}`)
  }))
)

onMounted(() => {
  updateHeaders()
})

watch(locale, () => {
  updateHeaders()
})

function updateHeaders() {
  translatedHeaders.value = headers.value.map(h => ({
    ...h,
    title: t(h.textKey),
  }))
}

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
  confirmPassword.value = ''
  selectedRole.value = ''
  dialog.value = true
}

const closeAddUserDialog = () => {
  dialog.value = false
}

const emailRules = [
  (v) => !!v || t('newUser.required'),
  (v) => /.+@.+\..+/.test(v) || t('newUser.invalidEmail'),
]

const passwordRules = [
  (v) => !!v || t('newUser.required'),
  (v) => v.length >= 6 || t('newUser.passwordTooShort'),
]

const confirmPasswordRules = [
  (v) => !!v || t('newUser.required'),
  (v) => v === newPassword.value || t('newUser.passwordMismatch'),
]

const roleRules = [
   (v) => !!v || t('newUser.required')
]

const addUser = async () => {
  if (!formNewUser.value) {
    console.warn('Formulario no encontrado')
    return
  }

  const validationResult = await formNewUser.value.validate()
    console.log('Valid?', validationResult)
  if (!validationResult.valid) return
  console.log(selectedRole.value.value);
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
        role : selectedRole.value.value,
      }),
    })

    if (!response.ok) {
      const errData = await response.json()
      throw new Error(errData.error || 'Error al crear usuario')
    }

    const createdUser = await response.json()
    users.value.push(createdUser)
    closeAddUserDialog()
    await fetchUsers()  // recarga usuarios luego de agregar uno nuevo
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
