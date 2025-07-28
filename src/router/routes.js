import LoginView from '@/views/Login.vue'
import MainView from '@/views/Main.vue'
import NotFound from '@/views/NotFound.vue'
import UsersView from '@/views/Users.vue'


export default [
  { path: '/login', name: 'login', component: LoginView },
  { path: '/main', name: 'main', component: MainView, meta: { requiresAuth: true } },
  { path: '/', redirect: '/login' },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
  { path: '/users', name: 'users', component: UsersView, meta: { requiresAuth: true } },
]
