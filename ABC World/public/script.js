let vocales = [];
let vocalActual = null;

async function cargarVocales() {
  const res = await fetch('/api/vocales');
  vocales = await res.json();
  nuevaRonda();
}

function nuevaRonda() {
  // Elegir una vocal aleatoria
  vocalActual = vocales[Math.floor(Math.random() * vocales.length)];

  // Mostrar imagen
  const imagenContainer = document.getElementById('imagen-container');
  imagenContainer.innerHTML = `<img src="${vocalActual.imagen}" alt="Vocal" />`;

  // Mostrar opciones (todas las vocales)
  const opcionesContainer = document.getElementById('opciones-container');
  opcionesContainer.innerHTML = '';

  vocales.forEach(vocal => {
    const btn = document.createElement('button');
    btn.textContent = vocal.letra;
    btn.style.fontSize = '2em';
    btn.style.margin = '5px';
    btn.onclick = () => validarRespuesta(vocal.letra);
    opcionesContainer.appendChild(btn);
  });

  document.getElementById('mensaje').textContent = '';
}

async function validarRespuesta(letraSeleccionada) {
  const res = await fetch('/api/validar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      letraSeleccionada,
      letraCorrecta: vocalActual.letra,
    }),
  });

  const data = await res.json();

  const mensaje = document.getElementById('mensaje');
  if (data.correcto) {
    mensaje.textContent = '¡Correcto! 🎉';
    mensaje.style.color = 'green';
  } else {
    mensaje.textContent = `Incorrecto. La respuesta correcta es ${vocalActual.letra}`;
    mensaje.style.color = 'red';
  }

  // Esperar 2 segundos y comenzar nueva ronda
  setTimeout(nuevaRonda, 2000);
}

window.onload = cargarVocales;