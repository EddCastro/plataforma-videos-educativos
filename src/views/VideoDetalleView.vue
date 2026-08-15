<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import {
  obtenerVideo,
  toggleLike,
  publicarComentario,
  responderComentario,
  eliminarComentario
} from '../services/api'
import { estudianteActual } from '../services/auth'

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const video = ref(null)
const cargando = ref(true)
const error = ref('')

const procesandoLike = ref(false)
const mensajeInteraccion = ref('')
const tipoMensajeInteraccion = ref('')

const nuevoComentario = ref('')
const publicandoComentario = ref(false)
const errorComentario = ref('')
const mensajeComentario = ref('')

const comentarioRespondiendoId = ref(null)
const textoRespuesta = ref('')
const publicandoRespuesta = ref(false)
const mensajeRespuesta = ref('')
const errorRespuesta = ref('')

const comentarioEliminandoId = ref(null)
const mensajeEliminar = ref('')
const errorEliminar = ref('')

const usuarioDioLike = computed(() => {
  if (!video.value || !estudianteActual.value) {
    return false
  }

  const usuarios = Array.isArray(video.value.usuariosLikes)
    ? video.value.usuariosLikes
    : []

  return usuarios.some(
    carne => String(carne) === String(estudianteActual.value.carne)
  )
})

async function cargarVideo(mostrarCarga = true) {
  if (mostrarCarga) {
    cargando.value = true
  }

  error.value = ''

  try {
    video.value = await obtenerVideo(props.id)
  } catch {
    error.value = 'No fue posible cargar el video seleccionado.'
  } finally {
    if (mostrarCarga) {
      cargando.value = false
    }
  }
}

async function reaccionar() {
  if (!estudianteActual.value || procesandoLike.value) {
    return
  }

  procesandoLike.value = true
  mensajeInteraccion.value = ''

  const yaTeniaLike = usuarioDioLike.value

  try {
    const respuesta = await toggleLike(
      video.value.id,
      estudianteActual.value.carne
    )

    await cargarVideo(false)

    tipoMensajeInteraccion.value = 'exito'

    mensajeInteraccion.value =
      respuesta?.mensaje ||
      (yaTeniaLike
        ? 'Se quitó tu Me gusta.'
        : 'Marcaste este video con Me gusta.')
  } catch (err) {
    tipoMensajeInteraccion.value = 'error'
    mensajeInteraccion.value =
      err.message || 'No fue posible actualizar tu reacción.'
  } finally {
    procesandoLike.value = false
  }
}

async function comentar() {
  errorComentario.value = ''
  mensajeComentario.value = ''

  if (!estudianteActual.value) {
    errorComentario.value =
      'Debes iniciar sesión para publicar comentarios.'
    return
  }

  const texto = nuevoComentario.value.trim()

  if (!texto) {
    errorComentario.value =
      'Escribe un comentario antes de publicarlo.'
    return
  }

  publicandoComentario.value = true

  try {
    const respuesta = await publicarComentario(
      video.value.id,
      estudianteActual.value.carne,
      texto
    )

    nuevoComentario.value = ''

    await cargarVideo(false)

    mensajeComentario.value =
      respuesta?.mensaje || 'Comentario publicado exitosamente.'
  } catch (err) {
    errorComentario.value =
      err.message || 'No fue posible publicar el comentario.'
  } finally {
    publicandoComentario.value = false
  }
}

function abrirRespuesta(comentarioId) {
  if (comentarioRespondiendoId.value === comentarioId) {
    cancelarRespuesta()
    return
  }

  comentarioRespondiendoId.value = comentarioId
  textoRespuesta.value = ''
  mensajeRespuesta.value = ''
  errorRespuesta.value = ''
}

function cancelarRespuesta() {
  comentarioRespondiendoId.value = null
  textoRespuesta.value = ''
  mensajeRespuesta.value = ''
  errorRespuesta.value = ''
}

function esComentarioPropio(comentario) {
  if (!estudianteActual.value) {
    return false
  }

  return String(comentario.carne) === String(estudianteActual.value.carne)
}

async function borrarComentario(comentarioId) {
  if (!estudianteActual.value) {
    return
  }

  const confirmar = window.confirm(
    '¿Deseas eliminar este comentario? Esta acción no se puede deshacer.'
  )

  if (!confirmar) {
    return
  }

  comentarioEliminandoId.value = comentarioId
  mensajeEliminar.value = ''
  errorEliminar.value = ''

  try {
    const respuesta = await eliminarComentario(
      comentarioId,
      estudianteActual.value.carne
    )

    await cargarVideo(false)

    mensajeEliminar.value =
      respuesta?.mensaje || 'Comentario eliminado exitosamente.'
  } catch (err) {
    if (err.status === 403) {
      errorEliminar.value =
        'No puedes eliminar un comentario que pertenece a otro estudiante.'
    } else {
      errorEliminar.value =
        err.message || 'No fue posible eliminar el comentario.'
    }
  } finally {
    comentarioEliminandoId.value = null
  }
}

async function responder(comentarioId) {
  errorRespuesta.value = ''
  mensajeRespuesta.value = ''

  if (!estudianteActual.value) {
    errorRespuesta.value =
      'Debes iniciar sesión para responder comentarios.'
    return
  }

  const texto = textoRespuesta.value.trim()

  if (!texto) {
    errorRespuesta.value =
      'Escribe una respuesta antes de publicarla.'
    return
  }

  publicandoRespuesta.value = true

  try {
    const respuesta = await responderComentario(
      comentarioId,
      estudianteActual.value.carne,
      texto
    )

    await cargarVideo(false)

    textoRespuesta.value = ''

    mensajeRespuesta.value =
      respuesta?.mensaje || 'Respuesta publicada exitosamente.'

    setTimeout(() => {
      cancelarRespuesta()
    }, 1200)
  } catch (err) {
    errorRespuesta.value =
      err.message || 'No fue posible publicar la respuesta.'
  } finally {
    publicandoRespuesta.value = false
  }
}

onMounted(() => cargarVideo())
</script>

<template>
  <section class="detalle-page">
    <div class="container">

      <RouterLink to="/videos" class="volver-catalogo">
        ← Volver al catálogo
      </RouterLink>

      <div v-if="cargando" class="detalle-cargando">
        <div class="spinner"></div>
        <p>Cargando video...</p>
      </div>

      <div v-else-if="error" class="catalogo-error">
        {{ error }}
      </div>

      <template v-else-if="video">

        <div class="detalle-grid">

          <div class="detalle-principal">

            <div class="reproductor-contenedor">
              <video
                class="reproductor"
                :src="video.urlVideo"
                :poster="video.poster"
                controls
                preload="metadata"
              >
                Tu navegador no puede reproducir este video.
              </video>
            </div>

            <div class="detalle-info">

              <div class="detalle-meta-superior">
                <span class="detalle-categoria">
                  {{ video.categoria }}
                </span>

                <span class="detalle-duracion">
                  {{ video.duracion }}
                </span>
              </div>

              <h1>{{ video.titulo }}</h1>

              <p class="detalle-descripcion">
                {{ video.descripcion }}
              </p>

              <div class="detalle-estadisticas">
                <div>
                  <strong>{{ video.likes || 0 }}</strong>
                  <span>Me gusta</span>
                </div>

                <div>
                  <strong>{{ video.comentarios?.length || 0 }}</strong>
                  <span>
                    comentario{{ (video.comentarios?.length || 0) === 1 ? '' : 's' }}
                  </span>
                </div>
              </div>

            </div>
          </div>

          <aside class="detalle-sidebar">

            <div class="interaccion-card">
              <span class="interaccion-etiqueta">
                PARTICIPA
              </span>

              <h2>¿Te gustó este contenido?</h2>

              <p v-if="estudianteActual">
                Puedes reaccionar al video y participar en la conversación.
              </p>

              <p v-else>
                Inicia sesión para dar Me gusta y publicar comentarios.
              </p>

              <button
                v-if="estudianteActual"
                type="button"
                class="like-button"
                :class="{ 'like-activo': usuarioDioLike }"
                :disabled="procesandoLike"
                @click="reaccionar"
              >
                <template v-if="procesandoLike">
                  Actualizando...
                </template>

                <template v-else-if="usuarioDioLike">
                  ♥ Quitar Me gusta
                </template>

                <template v-else>
                  ♥ Me gusta
                </template>
              </button>

              <RouterLink
                v-else
                to="/login"
                class="iniciar-interaccion"
              >
                Iniciar sesión
              </RouterLink>

              <div
                v-if="mensajeInteraccion"
                class="mensaje-interaccion"
                :class="tipoMensajeInteraccion === 'exito'
                  ? 'mensaje-interaccion-exito'
                  : 'mensaje-interaccion-error'"
              >
                {{ mensajeInteraccion }}
              </div>
            </div>

            <div class="detalle-resumen-card">
              <h3>Información del video</h3>

              <div class="resumen-fila">
                <span>Categoría</span>
                <strong>{{ video.categoria }}</strong>
              </div>

              <div class="resumen-fila">
                <span>Duración</span>
                <strong>{{ video.duracion }}</strong>
              </div>

              <div class="resumen-fila">
                <span>Video</span>
                <strong>#{{ video.id }}</strong>
              </div>
            </div>

          </aside>

        </div>

        <section class="comentarios-preview">

          <div class="comentarios-titulo">
            <div>
              <span>COMUNIDAD</span>
              <h2>Comentarios</h2>
            </div>

            <strong>
              {{ video.comentarios?.length || 0 }}
            </strong>
          </div>

          <div
            v-if="estudianteActual"
            class="nuevo-comentario"
          >
            <div class="nuevo-comentario-avatar">
              {{ estudianteActual.nombre?.charAt(0) || 'E' }}
            </div>

            <form
              class="nuevo-comentario-form"
              @submit.prevent="comentar"
            >
              <label for="comentario">
                Publicar como
                <strong>{{ estudianteActual.nombre }}</strong>
              </label>

              <textarea
                id="comentario"
                v-model="nuevoComentario"
                rows="4"
                placeholder="Escribe tu comentario..."
                maxlength="500"
              ></textarea>

              <div class="comentario-form-footer">
                <span>{{ nuevoComentario.length }}/500</span>

                <button
                  type="submit"
                  :disabled="publicandoComentario"
                >
                  {{
                    publicandoComentario
                      ? 'Publicando...'
                      : 'Publicar comentario'
                  }}
                </button>
              </div>

              <div
                v-if="errorComentario"
                class="comentario-mensaje comentario-error"
              >
                {{ errorComentario }}
              </div>

              <div
                v-if="mensajeComentario"
                class="comentario-mensaje comentario-exito"
              >
                {{ mensajeComentario }}
              </div>
            </form>
          </div>

          <div
            v-if="mensajeEliminar"
            class="comentario-mensaje comentario-exito"
          >
            {{ mensajeEliminar }}
          </div>

          <div
            v-if="errorEliminar"
            class="comentario-mensaje comentario-error"
          >
            {{ errorEliminar }}
          </div>

          <div
            v-if="!video.comentarios?.length"
            class="sin-comentarios"
          >
            <div>💬</div>
            <h3>Aún no hay comentarios</h3>
            <p>Sé el primero en participar en la conversación.</p>
          </div>

          <div
            v-else
            class="comentarios-lista"
          >
            <article
              v-for="comentario in video.comentarios"
              :key="comentario.id"
              class="comentario-preview"
            >

              <div class="comentario-avatar">
                {{ comentario.estudiante?.charAt(0) || 'E' }}
              </div>

              <div class="comentario-contenido">

                <div class="comentario-autor">
                  <strong>{{ comentario.estudiante }}</strong>
                  <span>{{ comentario.carne }}</span>
                </div>

                <p>{{ comentario.texto }}</p>

                <div class="comentario-acciones">
                  <small>{{ comentario.fecha }}</small>

                  <button
                    v-if="estudianteActual"
                    type="button"
                    class="btn-responder"
                    @click="abrirRespuesta(comentario.id)"
                  >
                    {{
                      comentarioRespondiendoId === comentario.id
                        ? 'Cancelar'
                        : 'Responder'
                    }}
                  </button>

                  <button
                    v-if="esComentarioPropio(comentario)"
                    type="button"
                    class="btn-eliminar"
                    :disabled="comentarioEliminandoId === comentario.id"
                    @click="borrarComentario(comentario.id)"
                  >
                    {{
                      comentarioEliminandoId === comentario.id
                        ? 'Eliminando...'
                        : 'Eliminar'
                    }}
                  </button>
                </div>

                <form
                  v-if="comentarioRespondiendoId === comentario.id"
                  class="respuesta-form"
                  @submit.prevent="responder(comentario.id)"
                >
                  <textarea
                    v-model="textoRespuesta"
                    rows="3"
                    maxlength="500"
                    placeholder="Escribe tu respuesta..."
                  ></textarea>

                  <div class="respuesta-form-footer">
                    <span>{{ textoRespuesta.length }}/500</span>

                    <button
                      type="submit"
                      :disabled="publicandoRespuesta"
                    >
                      {{
                        publicandoRespuesta
                          ? 'Respondiendo...'
                          : 'Publicar respuesta'
                      }}
                    </button>
                  </div>

                  <div
                    v-if="errorRespuesta"
                    class="comentario-mensaje comentario-error"
                  >
                    {{ errorRespuesta }}
                  </div>

                  <div
                    v-if="mensajeRespuesta"
                    class="comentario-mensaje comentario-exito"
                  >
                    {{ mensajeRespuesta }}
                  </div>
                </form>

                <div
                  v-if="comentario.respuestas?.length"
                  class="respuestas-preview"
                >
                  <article
                    v-for="respuesta in comentario.respuestas"
                    :key="respuesta.id"
                    class="respuesta-preview"
                  >
                    <div class="respuesta-avatar">
                      {{ respuesta.estudiante?.charAt(0) || 'E' }}
                    </div>

                    <div>
                      <div class="comentario-autor">
                        <strong>{{ respuesta.estudiante }}</strong>
                        <span>{{ respuesta.carne }}</span>
                      </div>

                      <p>{{ respuesta.texto }}</p>

                      <small>{{ respuesta.fecha }}</small>
                    </div>
                  </article>
                </div>

              </div>
            </article>
          </div>

        </section>

      </template>

    </div>
  </section>
</template>





