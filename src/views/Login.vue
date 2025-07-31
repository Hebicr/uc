<template>
  <div class="login-container">
    <v-card
      class="login-card"
      elevation="10"
      rounded="2x1"
    >
      <v-img
        class="logo-img"
        src="https://cdn.vuetifyjs.com/docs/images/logos/vuetify-logo-v3-slim-text-light.svg"
        width="180"
        cover
      />

      <v-form ref="form" @submit.prevent="login" class="login-form">
        <v-text-field
          v-model="email"
          :label="$t('login.email')"
          density="comfortable"
          variant="outlined"
          prepend-inner-icon="mdi-email-outline"
          :error="errors.email !== ''"
          :error-messages="errors.email"
          autocomplete="email"
        />

        <v-text-field
          v-model="password"
          :label="$t('login.password')"
          :type="visible ? 'text' : 'password'"
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="visible = !visible"
          density="comfortable"
          variant="outlined"
          prepend-inner-icon="mdi-lock-outline"
          :error="errors.password !== ''"
          :error-messages="errors.password"
          autocomplete="current-password"
        />

        <div class="forgot-password">
          <a class="text-caption text-decoration-none text-primary" href="#">
            {{ $t('login.forgot_password') }}
          </a>
        </div>

        <v-alert
          v-if="errorMessage"
          type="error"
          class="my-4"
          density="comfortable"
          border="start"
        >
          {{ errorMessage }}
        </v-alert>

        <v-btn
          color="primary"
          size="large"
          variant="elevated"
          block
          :loading="loading"
          type="submit"
          class="mt-4"
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
  localStorage.setItem('user', JSON.stringify(response.data.user))
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

<style scoped>

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80dvh;
  padding: 1rem;
  overflow: hidden;
  position: relative;

  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-primary-rgb), 0.85),
    rgba(var(--v-theme-secondary-rgb), 0.85)
  );
}

.login-card {
  width: 100%;
  max-width: 420px;
  padding: 2rem;
  border-radius: 1.5rem;
  position: relative;
  z-index: 2;

  background-color: rgba(var(--v-theme-surface-rgb), 0.5);
  border: 1px solid rgba(var(--v-theme-on-surface-rgb), 0.15);
  box-shadow: 0 10px 30px rgba(var(--v-theme-on-surface-rgb), 0.25);

  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transition: all 0.3s ease;
}



.logo-img {
  display: block;
  margin: 0 auto 1.5rem auto;
  filter: drop-shadow(0 2px 2px rgba(0,0,0,0.1));
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.forgot-password {
  text-align: right;
  margin-top: -0.5rem;
}
</style>
