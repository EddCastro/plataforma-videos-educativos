import { ref } from 'vue'

const CLAVE_SESION = 'eduvideo_estudiante'

function cargarSesion() {
  try {
    const datos = localStorage.getItem(CLAVE_SESION)
    return datos ? JSON.parse(datos) : null
  } catch {
    return null
  }
}

export const estudianteActual = ref(cargarSesion())

export function guardarSesion(estudiante) {
  estudianteActual.value = estudiante
  localStorage.setItem(CLAVE_SESION, JSON.stringify(estudiante))
}

export function cerrarSesion() {
  estudianteActual.value = null
  localStorage.removeItem(CLAVE_SESION)
}

export function estaAutenticado() {
  return estudianteActual.value !== null
}
