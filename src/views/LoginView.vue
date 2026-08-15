<script setup>
import { reactive, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { iniciarSesion } from '../services/api'
import { guardarSesion } from '../services/auth'

const router = useRouter()

const formulario = reactive({
  usuario: '',
  password: ''
})

const errores = reactive({
  usuario: '',
  password: ''
})

const mensaje = ref('')
const enviando = ref(false)

function validarFormulario() {
  errores.usuario = ''
  errores.password = ''
  mensaje.value = ''

  let valido = true

  if (!formulario.usuario.trim()) {
    errores.usuario = 'Ingresa tu carné o correo electrónico.'
    valido = false
  }

  if (!formulario.password) {
    errores.password = 'El PIN es obligatorio.'
    valido = false
  } else if (!/^\d+$/.test(formulario.password)) {
    errores.password = 'El PIN debe contener únicamente números.'
    valido = false
  }

  return valido
}

async function login() {
  if (!validarFormulario()) {
    return
  }

  enviando.value = true
  mensaje.value = ''

  try {
    const respuesta = await iniciarSesion({
      usuario: formulario.usuario.trim(),
      password: formulario.password
    })

    if (!respuesta?.estudiante) {
      throw new Error('La respuesta del servidor no contiene los datos del estudiante.')
    }

    guardarSesion(respuesta.estudiante)

    router.push('/videos')
  } catch (error) {
    if (error.status === 401) {
      mensaje.value = 'Carné, correo o PIN incorrectos.'
    } else {
      mensaje.value =
        error.message || 'No fue posible iniciar sesión.'
    }
  } finally {
    enviando.value = false
  }
}
</script>

<template>
  <section class="auth-page login-page">
    <div class="auth-container">

      <div class="auth-info">
        <span class="auth-etiqueta">BIENVENIDO DE NUEVO</span>

        <h1>
          Continúa
          <span>aprendiendo.</span>
        </h1>

        <p>
          Inicia sesión con tu carné o correo electrónico para participar
          en la comunidad de EduVideo.
        </p>

        <div class="auth-beneficios">
          <div>
            <span>✓</span>
            Acceso mediante carné o correo
          </div>

          <div>
            <span>✓</span>
            Reacciona a los videos
          </div>

          <div>
            <span>✓</span>
            Comenta y participa
          </div>
        </div>
      </div>

      <div class="auth-card login-card">

        <div class="auth-card-header">
          <div class="auth-icono">→</div>

          <div>
            <h2>Iniciar sesión</h2>
            <p>Ingresa tus credenciales</p>
          </div>
        </div>

        <div
          v-if="mensaje"
          class="alerta alerta-error"
        >
          {{ mensaje }}
        </div>

        <form @submit.prevent="login" novalidate>

          <div class="campo">
            <label for="usuario">
              Carné o correo electrónico
            </label>

            <input
              id="usuario"
              v-model="formulario.usuario"
              type="text"
              placeholder="1890-20-11489 o usuario@correo.com"
              autocomplete="username"
            >

            <small class="ayuda">
              Puedes iniciar sesión utilizando cualquiera de los dos.
            </small>

            <small v-if="errores.usuario" class="campo-error">
              {{ errores.usuario }}
            </small>
          </div>

          <div class="campo">
            <label for="loginPassword">PIN</label>

            <input
              id="loginPassword"
              v-model="formulario.password"
              type="password"
              inputmode="numeric"
              placeholder="••••"
              autocomplete="current-password"
            >

            <small v-if="errores.password" class="campo-error">
              {{ errores.password }}
            </small>
          </div>

          <button
            type="submit"
            class="auth-submit"
            :disabled="enviando"
          >
            {{ enviando ? 'Ingresando...' : 'Iniciar sesión' }}
          </button>
        </form>

        <div class="auth-login-link">
          ¿Aún no tienes una cuenta?
          <RouterLink to="/registro">
            Crear cuenta
          </RouterLink>
        </div>

      </div>
    </div>
  </section>
</template>
