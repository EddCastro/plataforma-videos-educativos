<script setup>
import { computed, onMounted, ref } from 'vue'
import VideoCard from '../components/VideoCard.vue'
import {
  obtenerVideos,
  obtenerCategorias,
  obtenerVideosPorCategoria
} from '../services/api'

const videos = ref([])
const categorias = ref([])
const categoriaSeleccionada = ref('')
const busqueda = ref('')
const cargando = ref(true)
const mensajeError = ref('')

const videosFiltrados = computed(() => {
  const termino = busqueda.value.trim().toLowerCase()

  if (!termino) {
    return videos.value
  }

  return videos.value.filter(video =>
    video.titulo?.toLowerCase().includes(termino)
  )
})

async function cargarCatalogo() {
  cargando.value = true
  mensajeError.value = ''

  try {
    const [listaVideos, listaCategorias] = await Promise.all([
      obtenerVideos(),
      obtenerCategorias()
    ])

    videos.value = Array.isArray(listaVideos)
      ? listaVideos
      : []

    categorias.value = Array.isArray(listaCategorias)
      ? listaCategorias
      : []
  } catch (error) {
    mensajeError.value =
      'No fue posible cargar el catálogo de videos.'
  } finally {
    cargando.value = false
  }
}

async function cambiarCategoria() {
  cargando.value = true
  mensajeError.value = ''

  try {
    if (!categoriaSeleccionada.value) {
      videos.value = await obtenerVideos()
    } else {
      const resultado = await obtenerVideosPorCategoria(
        categoriaSeleccionada.value
      )

      videos.value = Array.isArray(resultado)
        ? resultado
        : []
    }
  } catch (error) {
    mensajeError.value =
      'No fue posible cargar los videos de esta categoría.'
    videos.value = []
  } finally {
    cargando.value = false
  }
}

onMounted(cargarCatalogo)
</script>

<template>
  <section class="catalogo-page">

    <div class="container">

      <div class="catalogo-header">
        <div>
          <span class="catalogo-etiqueta">
            CATÁLOGO EDUCATIVO
          </span>

          <h1>Explora nuestros videos</h1>

          <p>
            Encuentra contenido sobre desarrollo web, programación,
            bases de datos, arquitectura, seguridad y otras áreas
            de tecnología.
          </p>
        </div>

        <div class="catalogo-contador">
          <strong>{{ videosFiltrados.length }}</strong>
          <span>
            video{{ videosFiltrados.length === 1 ? '' : 's' }}
          </span>
        </div>
      </div>

      <div class="catalogo-herramientas">

        <div class="buscador">
          <span class="buscador-icono">⌕</span>

          <input
            v-model="busqueda"
            type="search"
            placeholder="Buscar videos por título..."
          >
        </div>

        <div class="filtro-categoria">
          <select
            v-model="categoriaSeleccionada"
            @change="cambiarCategoria"
          >
            <option value="">
              Todas las categorías
            </option>

            <option
              v-for="categoria in categorias"
              :key="categoria"
              :value="categoria"
            >
              {{ categoria }}
            </option>
          </select>
        </div>

      </div>

      <div
        v-if="mensajeError"
        class="catalogo-error"
      >
        {{ mensajeError }}
      </div>

      <div
        v-else-if="cargando"
        class="catalogo-cargando"
      >
        <div class="spinner"></div>
        <p>Cargando catálogo...</p>
      </div>

      <div
        v-else-if="videosFiltrados.length === 0"
        class="catalogo-vacio"
      >
        <div>⌕</div>

        <h2>No encontramos resultados</h2>

        <p>
          Intenta utilizar otro título o seleccionar una categoría diferente.
        </p>
      </div>

      <div
        v-else
        class="videos-grid"
      >
        <VideoCard
          v-for="video in videosFiltrados"
          :key="video.id"
          :video="video"
        />
      </div>

    </div>

  </section>
</template>
