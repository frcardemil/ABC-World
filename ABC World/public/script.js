// Datos para juego 1: vocales con imágenes
const vocales = [
  { letra: 'A', imagen: '/images/a.png' },
  { letra: 'E', imagen: '/images/e.png' },
  { letra: 'I', imagen: '/images/i.png' },
  { letra: 'O', imagen: '/images/o.png' },
  { letra: 'U', imagen: '/images/u.png' },
];

// Datos para juego 2: imágenes con palabra y vocal inicial
const imagenesJuego2 = [
  { palabra: 'Araña', imagen: '/images/imagenesJuego2/araña.png', vocal: 'A' },
  { palabra: 'Avión', imagen: '/images/imagenesJuego2/avion.png', vocal: 'A' },
  { palabra: 'Elefante', imagen: '/images/imagenesJuego2/elefante.png', vocal: 'E' },
  {palabra: 'Escoba', imagen: '/images/imagenesJuego2/escoba.png', vocal: 'E' },
  { palabra: 'Isla', imagen: '/images/imagenesJuego2/isla.png', vocal: 'I' },
  { palabra: 'Iglú', imagen: '/images/imagenesJuego2/iglú.png', vocal : 'I' },
  { palabra: 'Oso', imagen: '/images/imagenesJuego2/oso.png', vocal: 'O' },
  { palabra: 'Ojo', imagen: '/images/imagenesJuego2/ojo.png', vocal: 'O' },
  { palabra: 'Uva', imagen: '/images/imagenesJuego2/uva.png', vocal: 'U' },
  { palabra: 'Casa', imagen: '/images/imagenesJuego2/casa.png', vocal: 'A' }, // ejemplo extra que no empieza por vocal A
  { palabra: 'Perro', imagen: '/images/imagenesJuego2/perro.png', vocal: 'E' }, // ejemplo extra
];

// Variables juego 1
let vocalActual = null;
let puntajeVocales = 0;

// Variables juego 2
let vocalActualJuego2 = null;
let puntajeImagenes = 0;

window.onload = () => {
  // Referencias a botones menú
  document.getElementById('btn-vocales').onclick = () => iniciarJuegoVocales();
  document.getElementById('btn-imagenes').onclick = () => iniciarJuegoImagenes();

  // Botones volver
  document.getElementById('btn-volver-vocales').onclick = () => mostrarMenu();
  document.getElementById('btn-volver-imagenes').onclick = () => mostrarMenu();

  mostrarMenu();
};

// Mostrar solo el menú y ocultar juegos
function mostrarMenu() {
  document.getElementById('menu').style.display = 'block';
  document.getElementById('juego-vocales').style.display = 'none';
  document.getElementById('juego-imagenes').style.display = 'none';
}

// --- Juego 1: Aprender las vocales ---

function iniciarJuegoVocales() {
  puntajeVocales = 0;
  document.getElementById('puntaje-vocales').textContent = puntajeVocales;
  document.getElementById('menu').style.display = 'none';
  document.getElementById('juego-vocales').style.display = 'block';
  nuevaRondaVocales();
}

function nuevaRondaVocales() {
  vocalActual = vocales[Math.floor(Math.random() * vocales.length)];

  const imagenContainer = document.getElementById('imagen-container-vocales');
  imagenContainer.innerHTML = `<img src="${vocalActual.imagen}" alt="Vocal" />`;

  const opcionesContainer = document.getElementById('opciones-container-vocales');
  opcionesContainer.innerHTML = '';

  vocales.forEach(vocal => {
    const btn = document.createElement('button');
    btn.textContent = vocal.letra;
    btn.style.fontSize = '2em';
    btn.style.margin = '5px';
    btn.onclick = () => validarRespuestaVocales(vocal.letra);
    opcionesContainer.appendChild(btn);
  });

  document.getElementById('mensaje-vocales').textContent = '';
}

async function validarRespuestaVocales(letraSeleccionada) {
  // Validación local simple (sin llamar al servidor)
  const esCorrecto = letraSeleccionada.toUpperCase() === vocalActual.letra.toUpperCase();

  const mensaje = document.getElementById('mensaje-vocales');
  if (esCorrecto) {
    puntajeVocales++;
    document.getElementById('puntaje-vocales').textContent = puntajeVocales;
    mensaje.textContent = '¡Correcto! 🎉';
    mensaje.style.color = 'green';
  } else {
    mensaje.textContent = `Incorrecto. La respuesta correcta es ${vocalActual.letra}`;
    mensaje.style.color = 'red';
  }

  setTimeout(nuevaRondaVocales, 2000);
}

// --- Juego 2: Identificar imágenes que empiecen por vocal ---

function iniciarJuegoImagenes() {
  puntajeImagenes = 0;
  document.getElementById('puntaje-imagenes').textContent = puntajeImagenes;
  document.getElementById('menu').style.display = 'none';
  document.getElementById('juego-imagenes').style.display = 'block';
  nuevaRondaImagenes();
}

function nuevaRondaImagenes() {
  // Elegir una vocal aleatoria
  vocalActualJuego2 = vocales[Math.floor(Math.random() * vocales.length)].letra;
  document.getElementById('vocal-actual-imagenes').textContent = vocalActualJuego2;

  // Mostrar imágenes mezcladas (algunas que empiezan por la vocal, otras no)
  const imagenesContainer = document.getElementById('imagenes-container');
  imagenesContainer.innerHTML = '';

  // Seleccionar 4 imágenes aleatorias (pueden incluir algunas que no empiecen por la vocal)
  const opciones = [];

  // Añadir al menos 1 imagen que empiece por la vocal actual
  const imagenesCorrectas = imagenesJuego2.filter(img => img.vocal === vocalActualJuego2);
  if (imagenesCorrectas.length > 0) {
    opciones.push(imagenesCorrectas[Math.floor(Math.random() * imagenesCorrectas.length)]);
  }

  // Añadir imágenes aleatorias hasta tener 4 opciones
  while (opciones.length < 4) {
    const imgRandom = imagenesJuego2[Math.floor(Math.random() * imagenesJuego2.length)];
    if (!opciones.includes(imgRandom)) {
      opciones.push(imgRandom);
    }
  }

  // Mezclar opciones
  opciones.sort(() => Math.random() - 0.5);

  opciones.forEach(imgObj => {
    const imgElem = document.createElement('img');
    imgElem.src = imgObj.imagen;
    imgElem.alt = imgObj.palabra;
    imgElem.title = imgObj.palabra;
    imgElem.style.margin = '10px';
    imgElem.style.width = '120px';
    imgElem.style.height = '120px';
    imgElem.style.cursor = 'pointer';
    imgElem.onclick = () => validarRespuestaImagenes(imgObj);
    imagenesContainer.appendChild(imgElem);
  });

  document.getElementById('mensaje-imagenes').textContent = '';
}

function validarRespuestaImagenes(imagenSeleccionada) {
  const mensaje = document.getElementById('mensaje-imagenes');
  if (imagenSeleccionada.vocal === vocalActualJuego2) {
    puntajeImagenes++;
    document.getElementById('puntaje-imagenes').textContent = puntajeImagenes;
    mensaje.textContent = '¡Correcto! 🎉';
    mensaje.style.color = 'green';
  } else {
    mensaje.textContent = `Incorrecto. La palabra "${imagenSeleccionada.palabra}" no empieza por la vocal ${vocalActualJuego2}`;
    mensaje.style.color = 'red';
  }

  setTimeout(nuevaRondaImagenes, 2000);
}
