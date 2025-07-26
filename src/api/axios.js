import axios from 'axios'
import router from '@/router'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

api.interceptors.response.use(
  response => response,
  error => {
    const status = error.response?.status
    const errorMsg = error.response?.data?.error

    const shouldLogout =
      (status === 401 || status === 403) &&
      (
        errorMsg === 'Session invalidated' ||
        errorMsg === 'Invalid or expired token' ||
        errorMsg === 'Token missing' ||
        errorMsg === 'Token expired'
      )

    if (shouldLogout) {
      localStorage.removeItem('token')  // Elimina solo el token
      setTimeout(() => {
        const currentRoute = router.currentRoute.value
        if (currentRoute.name !== 'login') {
          router.push({
            name: 'login',
            query: { error: 'session expired' }
          })
        }
      }, 0)
    }

    return Promise.reject(error)
  }
)

export default api
