<template>
  <div style="display: flex; justify-content: center; align-items: center; height: 80vh;">
    <v-card class="mx-auto pa-8 pb-6" elevation="8" max-width="600" width="100%" rounded="lg">
        <v-img
        class="mx-auto my-6"
        max-width="228"
        src="https://cdn.vuetifyjs.com/docs/images/logos/vuetify-logo-v3-slim-text-light.svg"
      />
      <v-form ref="form" @submit.prevent="login">
        <div class="text-subtitle-1 text-medium-emphasis">
          {{ $t('login.email') }}
        </div>

        <v-text-field
          v-model="email"
          density="compact"
          :placeholder="$t('login.email')"
          prepend-inner-icon="mdi-email-outline"
          variant="outlined"
          :error="errors.email !== ''"
          :error-messages="errors.email"
          autocomplete="email"
        />

        <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
          {{ $t('login.password') }}

          <a class="text-caption text-decoration-none text-blue" href="#">
            {{ $t('login.forgot_password') }}
          </a>
        </div>

        <v-text-field
          v-model="password"
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visible ? 'text' : 'password'"
          density="compact"
          :placeholder="$t('login.password')"
          prepend-inner-icon="mdi-lock-outline"
          variant="outlined"
          @click:append-inner="visible = !visible"
          :error="errors.password !== ''"
          :error-messages="errors.password"
          autocomplete="current-password"
        />

        <v-alert
          v-if="errorMessage"
          type="error"
          class="my-4"
          density="compact"
          border="start"
        >
          {{ errorMessage }}
        </v-alert>
        
        <v-btn
        class="mb-8"
        color="success"
        size="large"
        variant="elevated"
        block
        :loading="loading"
        type="submit"
      >
        <v-icon start>mdi-login</v-icon>
        {{ $t('login.login_button') }}
</v-btn>

      </v-form>
    </v-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import api from '@/api/axios.js'

const { t } = useI18n()
const router = useRouter()
const errorMessage = ref(null)
//const errorMessage = ref('')

const demoMode = true

const email = ref(demoMode ? 'admin@test.com' : '')
const password = ref(demoMode ? '123456' : '')
const visible = ref(false)
const loading = ref(false)

const errors = ref({
  email: '',
  password: '',
})

const validateFields = () => {
  errors.value.email = ''
  errors.value.password = ''

  // Validar email obligatorio y formato
  if (!email.value) {
    errors.value.email = t('validation.required')
  } else if (!/.+@.+\..+/.test(email.value)) {
    errors.value.email = t('validation.invalid_email')
  }

  // Validar password requerido
  if (!password.value) {
    errors.value.password = t('validation.required')
  }

  // Retorna true si no hay errores
  return !errors.value.email && !errors.value.password
}

const login = async () => {
  errorMessage.value = ''
  loading.value = true

  if (!validateFields()) {
    loading.value = false
    return
  }

  try {
  const locale = localStorage.getItem('locale') || 'es'

  const response = await api.post('/api/login', {
    email: email.value,
    password: password.value,
  }, {
    headers: {
      'Accept-Language': locale
    }
  })

  const { token } = response.data
  localStorage.setItem('token', token)
  router.push({ name: 'main' })
} catch (error) {
  // ⛔️ Aquí mejoras la captura
  // console.log('Login error:', error)
  const serverMsg = error?.response?.data?.error ?? error?.message
  errorMessage.value = serverMsg || t('login.operation_error')
  password.value = ''
}
  loading.value = false
}

onMounted(() => {
  const queryError = router.currentRoute.value.query.error
  if (queryError === 'session expired') {
    errorMessage.value = t('login.session_expired')
  }
})

</script>
