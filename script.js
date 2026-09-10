// Precoz — interacciones básicas de la home
// Esto es solo el punto de partida. Más adelante esto se conectará
// a un backend real (Fase 2 del proyecto).

document.querySelector('.direccion-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const input = e.target.querySelector('input');
  if (input.value.trim() === '') {
    input.focus();
    return;
  }
  alert(`Buscando restaurantes cerca de: "${input.value}"\n\n(Esto todavía es un prototipo — en la Fase 2 esto va a buscar de verdad)`);
});

document.querySelectorAll('.chip').forEach((chip) => {
  chip.addEventListener('click', () => {
    chip.classList.toggle('chip-activo');
  });
});
