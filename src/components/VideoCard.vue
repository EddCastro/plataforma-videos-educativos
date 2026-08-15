<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  video: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <article class="video-card">

    <RouterLink
      :to="`/video/${video.id}`"
      class="video-card-imagen"
    >
      <img
        :src="video.poster"
        :alt="video.titulo"
        loading="lazy"
      >

      <div class="video-card-overlay">
        <span class="video-play">▶</span>
      </div>

      <span class="video-duracion">
        {{ video.duracion }}
      </span>
    </RouterLink>

    <div class="video-card-contenido">

      <div class="video-card-superior">
        <span class="video-categoria">
          {{ video.categoria }}
        </span>

        <span class="video-likes">
          ♥ {{ video.likes }}
        </span>
      </div>

      <RouterLink :to="`/video/${video.id}`">
        <h3>{{ video.titulo }}</h3>
      </RouterLink>

      <p>
        {{ video.descripcion }}
      </p>

      <div class="video-card-footer">
        <span>
          {{ video.comentarios?.length || 0 }}
          comentario{{ (video.comentarios?.length || 0) === 1 ? '' : 's' }}
        </span>

        <RouterLink
          :to="`/video/${video.id}`"
          class="ver-video"
        >
          Ver video →
        </RouterLink>
      </div>

    </div>
  </article>
</template>
