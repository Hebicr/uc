import LoginView from '@/views/Login.vue'
import MainView from '@/views/Main.vue'
import NotFound from '@/views/NotFound.vue'


export default [
  { path: '/login', name: 'login', component: LoginView },
  { path: '/main', name: 'main', component: MainView, meta: { requiresAuth: true } },
  { path: '/', redirect: '/login' },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }

]
