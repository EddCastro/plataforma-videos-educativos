<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { estudianteActual, cerrarSesion } from './services/auth'

const router = useRouter()

function salir() {
  cerrarSesion()
  router.push('/')
}
</script>

<template>
  <div class="app">

    <header class="header">
      <div class="container navbar">

        <RouterLink to="/" class="logo">
          <span class="logo-icon">▶</span>
          <span>EduVideo</span>
        </RouterLink>

        <nav class="nav-links">
          <RouterLink to="/">
            Inicio
          </RouterLink>

          <RouterLink to="/videos">
            Explorar
          </RouterLink>

          <template v-if="!estudianteActual">
            <RouterLink to="/login">
              Iniciar sesión
            </RouterLink>

            <RouterLink to="/registro" class="btn-registro">
              Crear cuenta
            </RouterLink>
          </template>

          <template v-else>
            <div class="usuario-menu">
              <div class="usuario-avatar">
                {{ estudianteActual.nombre?.charAt(0) || 'E' }}
              </div>

              <div class="usuario-datos">
                <strong>{{ estudianteActual.nombre }}</strong>
                <small>{{ estudianteActual.carne }}</small>
              </div>
            </div>

            <button
              type="button"
              class="btn-salir"
              @click="salir"
            >
              Cerrar sesión
            </button>
          </template>
        </nav>

      </div>
    </header>

    <main>
      <RouterView />
    </main>

    <footer class="footer">
      <div class="container footer-contenido">
        <div>
          <strong>EduVideo</strong>
          <p>Contenido educativo para aprender tecnología.</p>
        </div>

        <span>Plataforma de videos educativos</span>
      </div>
    </footer>

  </div>
</template>
