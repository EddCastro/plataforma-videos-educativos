const API_BASE_URL = 'https://backvideo-hpevgdenh7hygvfm.canadacentral-01.azurewebsites.net'

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  })

  const texto = await response.text()

  let data = null

  if (texto) {
    try {
      data = JSON.parse(texto)
    } catch {
      data = texto
    }
  }

  if (!response.ok) {
    const error = new Error(
      data?.mensaje ||
      data?.message ||
      `Error HTTP ${response.status}`
    )

    error.status = response.status
    error.data = data

    throw error
  }

  return data
}

export function registrarEstudiante(estudiante) {
  return request('/api/estudiantes/registrar', {
    method: 'POST',
    body: JSON.stringify(estudiante)
  })
}

export function iniciarSesion(credenciales) {
  return request('/api/login', {
    method: 'POST',
    body: JSON.stringify(credenciales)
  })
}

export function obtenerVideos() {
  return request('/api/videos')
}

export function obtenerVideo(id) {
  return request(`/api/videos/${id}`)
}

export function obtenerCategorias() {
  return request('/api/videos/categorias')
}

export function obtenerVideosPorCategoria(categoria) {
  return request(`/api/videos/categoria/${encodeURIComponent(categoria)}`)
}

export { API_BASE_URL }

export function toggleLike(videoId, carne) {
  return request(`/api/interaccionvideo/${videoId}/like`, {
    method: 'POST',
    body: JSON.stringify({
      carne
    })
  })
}

export function publicarComentario(videoId, carne, texto) {
  return request(`/api/interaccionvideo/${videoId}/comentario`, {
    method: 'POST',
    body: JSON.stringify({
      carne,
      texto
    })
  })
}

export function responderComentario(comentarioId, carne, texto) {
  return request(`/api/interaccionvideo/comentario/${comentarioId}/responder`, {
    method: 'POST',
    body: JSON.stringify({
      carne,
      texto
    })
  })
}

export function eliminarComentario(comentarioId, carne) {
  return request(
    `/api/interaccionvideo/comentario/${comentarioId}?carne=${encodeURIComponent(carne)}`,
    {
      method: 'DELETE'
    }
  )
}
