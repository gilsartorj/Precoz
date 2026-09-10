// Precoz — conexión con Supabase (login y registro de usuarios)

const SUPABASE_URL = 'https://wvdbtunatskdxspgwffu.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_yoIi1udQyPO5ZK-k5G-Cjw_FYlwYCl3';

const db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- Elementos del modal ---
const modal = document.getElementById('modal-login');
const btnCuenta = document.getElementById('btn-cuenta');
const btnCerrarModal = document.getElementById('btn-cerrar-modal');
const formAuth = document.getElementById('form-auth');
const modalTitulo = document.getElementById('modal-titulo');
const modalMensaje = document.getElementById('modal-mensaje');
const linkCambiarModo = document.getElementById('link-cambiar-modo');
const textoCambiar = document.getElementById('texto-cambiar');

let modoRegistro = false;

function abrirModal() {
  modal.classList.remove('oculto');
}
function cerrarModal() {
  modal.classList.add('oculto');
  modalMensaje.textContent = '';
  formAuth.reset();
}

function actualizarTextosModal() {
  if (modoRegistro) {
    modalTitulo.textContent = 'Crear cuenta';
    formAuth.querySelector('button[type="submit"]').textContent = 'Crear cuenta';
    textoCambiar.textContent = '¿Ya tenés cuenta?';
    linkCambiarModo.textContent = 'Iniciá sesión';
  } else {
    modalTitulo.textContent = 'Iniciar sesión';
    formAuth.querySelector('button[type="submit"]').textContent = 'Iniciar sesión';
    textoCambiar.textContent = '¿No tenés cuenta?';
    linkCambiarModo.textContent = 'Creá una';
  }
}

btnCerrarModal.addEventListener('click', cerrarModal);
modal.addEventListener('click', (e) => {
  if (e.target === modal) cerrarModal();
});

linkCambiarModo.addEventListener('click', (e) => {
  e.preventDefault();
  modoRegistro = !modoRegistro;
  actualizarTextosModal();
  modalMensaje.textContent = '';
});

formAuth.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('input-email').value;
  const password = document.getElementById('input-password').value;

  modalMensaje.textContent = 'Un momento...';

  let resultado;
  if (modoRegistro) {
    resultado = await db.auth.signUp({ email, password });
  } else {
    resultado = await db.auth.signInWithPassword({ email, password });
  }

  if (resultado.error) {
    modalMensaje.textContent = 'Error: ' + resultado.error.message;
    return;
  }

  if (modoRegistro) {
    modalMensaje.textContent = '¡Cuenta creada! Revisá tu email para confirmar.';
  } else {
    cerrarModal();
  }
});

// --- Mostrar si ya hay una sesión activa ---
async function actualizarBotonCuenta() {
  const { data } = await db.auth.getSession();
  if (data.session) {
    btnCuenta.textContent = 'Cerrar sesión (' + data.session.user.email + ')';
  } else {
    btnCuenta.textContent = 'Iniciar sesión';
  }
}

btnCuenta.addEventListener('click', async () => {
  const { data } = await db.auth.getSession();
  if (data.session) {
    await db.auth.signOut();
    actualizarBotonCuenta();
  } else {
    abrirModal();
  }
});

db.auth.onAuthStateChange(() => {
  actualizarBotonCuenta();
});

actualizarBotonCuenta();
