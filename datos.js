/* =====================================================================
   DATOS.JS — funciones compartidas por catalogo.html, usuarios.html,
   prestamos.html y reservas.html (y también las usa biblioteca.html
   para la barra de sesión).

   Esta versión es 100% frontend: NO llama a ms-usuarios, ms-libros,
   ms-prestamos ni ms-reservas. Todo se guarda y lee de localStorage.
   ===================================================================== */

const CLAVE_USUARIOS = "biblioteca_usuarios";
const CLAVE_LIBROS = "biblioteca_libros";
const CLAVE_PRESTAMOS = "biblioteca_prestamos";
const CLAVE_RESERVAS = "biblioteca_reservas";

function obtenerLista(clave) {
  const data = localStorage.getItem(clave);
  return data ? JSON.parse(data) : null;
}

function guardarLista(clave, lista) {
  localStorage.setItem(clave, JSON.stringify(lista));
}

function mostrarError(input, mensaje) {
  input.classList.add("is-invalid");
  const msgEl = input.parentElement.querySelector(".mensaje-error");
  if (msgEl) { msgEl.textContent = mensaje; msgEl.style.display = "block"; }
}

function limpiarError(input) {
  input.classList.remove("is-invalid");
  const msgEl = input.parentElement.querySelector(".mensaje-error");
  if (msgEl) msgEl.style.display = "none";
}

/**
 * Siembra datos de ejemplo la primera vez que se abre el sitio
 * (si aún no existen en localStorage). Se llama una sola vez, en
 * cualquier página, para asegurar que el catálogo/préstamos/reservas
 * no aparezcan vacíos en la primera visita.
 */
function sembrarDatosDemo() {
  if (obtenerLista(CLAVE_LIBROS) === null) {
    guardarLista(CLAVE_LIBROS, [
      { titulo: "Cien años de soledad", autor: "Gabriel García Márquez", categoria: "Novela", anio: 1967 },
      { titulo: "1984", autor: "George Orwell", categoria: "Ciencia ficción", anio: 1949 },
      { titulo: "El principito", autor: "Antoine de Saint-Exupéry", categoria: "Infantil", anio: 1943 },
    ]);
  }
  if (obtenerLista(CLAVE_PRESTAMOS) === null) {
    guardarLista(CLAVE_PRESTAMOS, [
      { usuario: "Ejemplo demo", libro: "Cien años de soledad", estado: "Activo", fechaVencimiento: "2026-09-15" },
    ]);
  }
  if (obtenerLista(CLAVE_RESERVAS) === null) {
    guardarLista(CLAVE_RESERVAS, [
      { usuario: "Ejemplo demo", libro: "1984", estado: "Pendiente", fechaVigencia: "2026-09-30" },
    ]);
  }
}

/**
 * Pinta la barra de sesión activa (arriba del navbar) si hay un usuario
 * logueado, y oculta los links de "Iniciar sesión"/"Crear cuenta".
 * Se llama igual en todas las páginas del sitio.
 */
function pintarBarraSesion() {
  const sesion = JSON.parse(sessionStorage.getItem('biblioteca_sesion') || 'null');
  if (!sesion) return;

  const barra = document.getElementById('barraSesion');
  if (barra) {
    barra.classList.remove('d-none');
    barra.innerHTML = `Sesión iniciada como <strong>${sesion.nombreCompleto}</strong> (${sesion.tipoUsuario}) · <a href="#" id="cerrarSesion">Cerrar sesión</a>`;
  }

  const navIngreso = document.getElementById('navIngreso');
  const navCrearCuenta = document.getElementById('navCrearCuenta');
  if (navIngreso) navIngreso.classList.add('d-none');
  if (navCrearCuenta) navCrearCuenta.classList.add('d-none');

  const btnCerrar = document.getElementById('cerrarSesion');
  if (btnCerrar) {
    btnCerrar.addEventListener('click', function (e) {
      e.preventDefault();
      sessionStorage.removeItem('biblioteca_sesion');
      window.location.reload();
    });
  }
}