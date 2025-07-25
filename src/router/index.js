import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'  // el array que ya tienes definido

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Función para obtener el token (puede ser localStorage, cookies, Vuex, etc)
function getToken() {
  return localStorage.getItem('token')  // asumiendo que lo guardas en localStorage
}

// Navigation guard global
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const token = getToken()

    if (!token) {
      // No hay token: redirigir a login
      next({ name: 'login' })
    } else {
      // Aquí opcional: podrías validar el token con una función que verifique la expiración
      next()
    }
  } else {
    next() // la ruta no requiere autenticación
  }
})

export default router
