import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import api from '@/api/axios'

function getToken() {
  return localStorage.getItem('token')
}

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const token = getToken()

  if (to.meta.requiresAuth) {
    if (!token) {
      return next({ name: 'login' })
    }

    try {
      await api.post('/api/validate-token', {}, {
        headers: { Authorization: `Bearer ${token}` },
      })
      return next()
    } catch (error) {
      return next({ name: 'login', query: { error: 'session expired' } })
    }
  } else if (to.name === 'login' && token) {
    try {
      await api.post('/api/validate-token', {}, {
        headers: { Authorization: `Bearer ${token}` },
      })
      return next({ name: 'main' })
    } catch {
      return next()
    }
  } else {
    return next()
  }
})

export default router
