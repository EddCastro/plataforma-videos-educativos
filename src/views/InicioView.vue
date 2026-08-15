<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="inicio">
    <div class="fondo-decoracion fondo-1"></div>
    <div class="fondo-decoracion fondo-2"></div>

    <div class="container hero-grid">

      <div class="hero-contenido">
        <div class="badge">
          <span class="badge-punto"></span>
          Plataforma educativa
        </div>

        <h1>
          Aprende tecnología
          <span>viendo y practicando.</span>
        </h1>

        <p class="hero-descripcion">
          Descubre contenido sobre desarrollo web, bases de datos,
          programación, arquitectura, seguridad, DevOps y más.
        </p>

        <div class="hero-acciones">
          <RouterLink to="/videos" class="boton boton-principal">
            <span class="play-pequeno">▶</span>
            Explorar videos
          </RouterLink>

          <RouterLink to="/registro" class="boton boton-secundario">
            Crear cuenta gratis
          </RouterLink>
        </div>

        <div class="hero-datos">
          <div class="dato">
            <strong>10+</strong>
            <span>Videos</span>
          </div>

          <div class="separador"></div>

          <div class="dato">
            <strong>10</strong>
            <span>Categorías</span>
          </div>

          <div class="separador"></div>

          <div class="dato">
            <strong>100%</strong>
            <span>Educativo</span>
          </div>
        </div>
      </div>

      <div class="hero-visual">
        <div class="resplandor"></div>

        <div class="panel-video">
          <div class="panel-imagen">
            <div class="codigo-decorativo">
              <span>&lt; / &gt;</span>
            </div>

            <button class="play-grande" aria-label="Reproducir">
              ▶
            </button>

            <span class="duracion">06:00</span>
          </div>

          <div class="panel-info">
            <span class="categoria">DESARROLLO WEB</span>

            <h3>Introducción a Fetch API y JavaScript Asíncrono</h3>

            <p>
              Aprende a conectar aplicaciones web con servicios RESTful.
            </p>

            <div class="panel-footer">
              <span>Curso destacado</span>

              <div class="likes">
                ♥ 1
              </div>
            </div>
          </div>
        </div>

        <div class="tarjeta-flotante tarjeta-categorias">
          <span class="icono-flotante">#</span>
          <div>
            <strong>10 categorías</strong>
            <small>Contenido disponible</small>
          </div>
        </div>

        <div class="tarjeta-flotante tarjeta-aprendizaje">
          <span class="icono-flotante">✓</span>
          <div>
            <strong>Aprende a tu ritmo</strong>
            <small>Desde cualquier lugar</small>
          </div>
        </div>
      </div>

    </div>
  </section>

  <section class="seccion-beneficios">
    <div class="container">
      <div class="encabezado-seccion">
        <span>TODO EN UN SOLO LUGAR</span>
        <h2>Una plataforma creada para aprender</h2>
        <p>
          Navega por el catálogo, encuentra el contenido que necesitas
          e interactúa con otros estudiantes.
        </p>
      </div>

      <div class="beneficios-grid">
        <article class="beneficio">
          <div class="beneficio-icono">▶</div>
          <h3>Contenido en video</h3>
          <p>
            Accede a un catálogo organizado de videos educativos
            sobre diferentes áreas de tecnología.
          </p>
        </article>

        <article class="beneficio">
          <div class="beneficio-icono">⌕</div>
          <h3>Encuentra lo que buscas</h3>
          <p>
            Utiliza categorías y búsqueda en tiempo real para localizar
            rápidamente el contenido.
          </p>
        </article>

        <article class="beneficio">
          <div class="beneficio-icono">♥</div>
          <h3>Participa</h3>
          <p>
            Inicia sesión para reaccionar a los videos, comentar
            y participar en conversaciones.
          </p>
        </article>
      </div>
    </div>
  </section>
</template>
