import { createRouter, createWebHistory } from 'vue-router'

import InicioView from '../views/InicioView.vue'
import LoginView from '../views/LoginView.vue'
import RegistroView from '../views/RegistroView.vue'
import VideosView from '../views/VideosView.vue'
import VideoDetalleView from '../views/VideoDetalleView.vue'

const routes = [
  {
    path: '/',
    name: 'inicio',
    component: InicioView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/registro',
    name: 'registro',
    component: RegistroView
  },
  {
    path: '/videos',
    name: 'videos',
    component: VideosView
  },
  {
    path: '/video/:id',
    name: 'video-detalle',
    component: VideoDetalleView,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
