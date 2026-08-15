<script setup>
import { reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { registrarEstudiante } from '../services/api'

const formulario = reactive({
  carne: '',
  estudiante: '',
  correo: '',
  password: ''
})

const errores = reactive({
  carne: '',
  estudiante: '',
  correo: '',
  password: ''
})

const mensaje = ref('')
const tipoMensaje = ref('')
const enviando = ref(false)

function limpiarErrores() {
  errores.carne = ''
  errores.estudiante = ''
  errores.correo = ''
  errores.password = ''
  mensaje.value = ''
}

function validarFormulario() {
  limpiarErrores()

  let valido = true

  const regexCarne = /^\d{4}-\d{2}-\d{5}$/
  const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const regexPin = /^\d+$/

  if (!formulario.carne.trim()) {
    errores.carne = 'El carné es obligatorio.'
    valido = false
  } else if (!regexCarne.test(formulario.carne.trim())) {
    errores.carne = 'Debe utilizar el formato 0000-00-00000.'
    valido = false
  }

  if (!formulario.estudiante.trim()) {
    errores.estudiante = 'El nombre del estudiante es obligatorio.'
    valido = false
  }

  if (!formulario.correo.trim()) {
    errores.correo = 'El correo electrónico es obligatorio.'
    valido = false
  } else if (!regexCorreo.test(formulario.correo.trim())) {
    errores.correo = 'Ingresa un correo electrónico válido.'
    valido = false
  }

  if (!formulario.password) {
    errores.password = 'El PIN es obligatorio.'
    valido = false
  } else if (!regexPin.test(formulario.password)) {
    errores.password = 'El PIN debe contener únicamente números.'
    valido = false
  }

  return valido
}

async function registrar() {
  if (!validarFormulario()) {
    return
  }

  enviando.value = true

  try {
    const respuesta = await registrarEstudiante({
      carne: formulario.carne.trim(),
      estudiante: formulario.estudiante.trim(),
      correo: formulario.correo.trim(),
      password: formulario.password
    })

    tipoMensaje.value = 'exito'
    mensaje.value =
      respuesta?.mensaje || 'Estudiante registrado exitosamente.'

    formulario.carne = ''
    formulario.estudiante = ''
    formulario.correo = ''
    formulario.password = ''
  } catch (error) {
    tipoMensaje.value = 'error'

    if (error.status === 409) {
      mensaje.value = 'El carné o correo electrónico ya se encuentra registrado.'
    } else if (error.status === 400) {
      mensaje.value =
        error.message || 'Los datos enviados no son válidos.'
    } else {
      mensaje.value =
        error.message || 'No fue posible completar el registro.'
    }
  } finally {
    enviando.value = false
  }
}
</script>

<template>
  <section class="auth-page">
    <div class="auth-decoration auth-decoration-one"></div>
    <div class="auth-decoration auth-decoration-two"></div>

    <div class="auth-container">

      <div class="auth-info">
        <span class="auth-etiqueta">ÚNETE A EDUVIDEO</span>

        <h1>
          Crea tu cuenta
          <span>de estudiante.</span>
        </h1>

        <p>
          Regístrate para reaccionar a los videos, publicar comentarios
          y participar en las conversaciones de la comunidad.
        </p>

        <div class="auth-beneficios">
          <div>
            <span>✓</span>
            Acceso al catálogo educativo
          </div>

          <div>
            <span>✓</span>
            Reacciona a tus videos favoritos
          </div>

          <div>
            <span>✓</span>
            Publica y responde comentarios
          </div>
        </div>
      </div>

      <div class="auth-card">
        <div class="auth-card-header">
          <div class="auth-icono">+</div>

          <div>
            <h2>Crear cuenta</h2>
            <p>Completa tus datos de estudiante</p>
          </div>
        </div>

        <div
          v-if="mensaje"
          class="alerta"
          :class="tipoMensaje === 'exito' ? 'alerta-exito' : 'alerta-error'"
        >
          {{ mensaje }}
        </div>

        <form @submit.prevent="registrar" novalidate>

          <div class="campo">
            <label for="carne">Carné</label>

            <input
              id="carne"
              v-model="formulario.carne"
              type="text"
              placeholder="1890-20-11489"
              maxlength="13"
              autocomplete="off"
            >

            <small class="ayuda">
              Formato requerido: 0000-00-00000
            </small>

            <small v-if="errores.carne" class="campo-error">
              {{ errores.carne }}
            </small>
          </div>

          <div class="campo">
            <label for="estudiante">Nombre completo</label>

            <input
              id="estudiante"
              v-model="formulario.estudiante"
              type="text"
              placeholder="Ej. Juan Pérez"
              autocomplete="name"
            >

            <small v-if="errores.estudiante" class="campo-error">
              {{ errores.estudiante }}
            </small>
          </div>

          <div class="campo">
            <label for="correo">Correo electrónico</label>

            <input
              id="correo"
              v-model="formulario.correo"
              type="email"
              placeholder="usuario@correo.com"
              autocomplete="email"
            >

            <small v-if="errores.correo" class="campo-error">
              {{ errores.correo }}
            </small>
          </div>

          <div class="campo">
            <label for="password">PIN</label>

            <input
              id="password"
              v-model="formulario.password"
              type="password"
              inputmode="numeric"
              placeholder="••••"
              autocomplete="new-password"
            >

            <small class="ayuda">
              El PIN debe contener únicamente números.
            </small>

            <small v-if="errores.password" class="campo-error">
              {{ errores.password }}
            </small>
          </div>

          <button
            type="submit"
            class="auth-submit"
            :disabled="enviando"
          >
            {{ enviando ? 'Registrando...' : 'Crear mi cuenta' }}
          </button>
        </form>

        <div class="auth-login-link">
          ¿Ya tienes una cuenta?
          <RouterLink to="/login">
            Iniciar sesión
          </RouterLink>
        </div>
      </div>

    </div>
  </section>
</template>
