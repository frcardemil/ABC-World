import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, doc, setDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

const firebaseConfig = {
  apiKey: "AIzaSyCZ5EN7GX05_OCqePTt0NhbMp2XHtNSHvI",
  authDomain: "abcworldmovil.firebaseapp.com",
  projectId: "abcworldmovil",
  storageBucket: "abcworldmovil.firebasestorage.app",
  messagingSenderId: "147110484087",
  appId: "1:147110484087:web:dde7c2b08a19b73a40ce72",
  measurementId: "G-97PFVQJS0S"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

let userId = null;

async function inicializarAuth() {
  try {
    await signInAnonymously(auth);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        userId = user.uid;  
        console.log('Usuario autenticado:', userId);
      }
    });
  } catch (error) {
    console.error('Error en autenticación:', error);
  }
}

async function guardarPuntaje(juego, puntaje) {
  if (!userId) return;
  try {
    await setDoc(doc(db, 'puntajes', userId), {
      juego: juego,
      puntaje: puntaje,
      fecha: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.error('Error al guardar puntaje:', error);
  }
}

// --- TTS (Audio) ---
function reproducirTTS(texto, velocidad = 0.8, vozSeleccionada = null) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = 'es-MX';
    utterance.rate = velocidad;
    utterance.pitch = 1;
    
    const voces = speechSynthesis.getVoices();
    const vozEspanol = voces.find(voice => voice.lang.startsWith('es'));
    if (vozEspanol) utterance.voice = vozEspanol;
    
    speechSynthesis.speak(utterance);
  }
}

// Helper Visual Bootstrap
function mostrarMensaje(idElemento, texto, tipo) {
    const el = document.getElementById(idElemento);
    el.textContent = texto;
    el.style.display = 'block';
    el.className = `alert mt-4 text-center fw-bold fs-4 animate__animated animate__fadeIn alert-${tipo}`;
}
function ocultarMensaje(idElemento) {
    document.getElementById(idElemento).style.display = 'none';
}

// Variables para control de Temporizadores
let timerAudio = null;
let timerSiguiente = null;

function limpiarTemporizadores() {
  if (timerAudio) clearTimeout(timerAudio);
  if (timerSiguiente) clearTimeout(timerSiguiente);
  speechSynthesis.cancel(); 
}

// --- DATOS ---
const vocales = [
  { letra: 'A', imagen: 'images/a.png' },
  { letra: 'E', imagen: 'images/e.png' },
  { letra: 'I', imagen: 'images/i.png' },
  { letra: 'O', imagen: 'images/o.png' },
  { letra: 'U', imagen: 'images/u.png' },
];

const imagenesJuego2 = [
  { palabra: 'Araña', imagen: 'images/imagenesJuego2/arana.png', vocal: 'A' },
  { palabra: 'Avión', imagen: 'images/imagenesJuego2/avion.png', vocal: 'A' },
  { palabra: 'Elefante', imagen: 'images/imagenesJuego2/elefante.png', vocal: 'E' },
  { palabra: 'Escoba', imagen: 'images/imagenesJuego2/escoba.png', vocal: 'E' },
  { palabra: 'Isla', imagen: 'images/imagenesJuego2/isla.png', vocal: 'I' },
  { palabra: 'Iglú', imagen: 'images/imagenesJuego2/iglu.png', vocal : 'I' },
  { palabra: 'Oso', imagen: 'images/imagenesJuego2/oso.png', vocal: 'O' },
  { palabra: 'Ojo', imagen: 'images/imagenesJuego2/ojo.png', vocal: 'O' },
  { palabra: 'Uva', imagen: 'images/imagenesJuego2/uva.png', vocal: 'U' },
  { palabra: 'Casa', imagen: 'images/imagenesJuego2/casa.png', vocal: 'A' },
  { palabra: 'Perro', imagen: 'images/imagenesJuego2/perro.png', vocal: 'E' },
];

const datosMemoriaSimple = [
  { tipo: 'silabas', palabra: 'Casa', silabas: 2 },
  { tipo: 'silabas', palabra: 'Sol', silabas: 1},
  { tipo: 'silabas', palabra: 'Zapato', silabas: 3},
  { tipo: 'silabas', palabra: 'Pez', silabas: 1 },
  { tipo: 'silabas', palabra: 'Perro', silabas: 2 },
  { tipo: 'silabas', palabra: 'Gato', silabas: 2 },
  { tipo: 'silabas', palabra: 'Pan', silabas: 1 },
  { tipo: 'silabas', palabra: 'Pato', silabas: 2 },
  { tipo: 'silabas', palabra: 'Luna', silabas: 2 },
  { tipo: 'silabas', palabra: 'Mesa', silabas: 2 },
  { tipo: 'silabas', palabra: 'Ojo', silabas: 2 },
  { tipo: 'silabas', palabra: 'Tren', silabas: 1 },
  { tipo: 'silabas', palabra: 'Flor', silabas: 1 },
  { tipo: 'silabas', palabra: 'Agua', silabas: 2 },
  { tipo: 'silabas', palabra: 'Lápiz', silabas: 2 }
];
const datosMemoriaMedio = [
    { tipo: 'silabas', palabra: 'Elefante', silabas: 4 },
    { tipo: 'silabas', palabra: 'Pelota', silabas: 3 },
    { tipo: 'silabas', palabra: 'Mariposa', silabas: 4 },
    { tipo: 'silabas', palabra: 'Tomate', silabas: 3 },
    { tipo: 'silabas', palabra: 'Dinosaurio', silabas: 5 },
    { tipo: 'silabas', palabra: 'Caballo', silabas: 3 },
    { tipo: 'silabas', palabra: 'Bicicleta', silabas: 5 },
    { tipo: 'silabas', palabra: 'Cuchara', silabas: 3 },
    { tipo: 'silabas', palabra: 'Chocolate', silabas: 4 },
    { tipo: 'silabas', palabra: 'Manzana', silabas: 3 },
    { tipo: 'silabas', palabra: 'Mantequilla', silabas: 4 },
    { tipo: 'silabas', palabra: 'Matemáticas', silabas: 5 }
]

const datosMemoriaAvanzado = [
  { tipo: 'rimas', palabra: 'Gato', rimaCorrecta: 'Pato', opciones: ['Pato', 'Sol', 'Luna'] },
  { tipo: 'rimas', palabra: 'Sol', rimaCorrecta: 'Sol', opciones: ['Luna', 'Sol', 'Casa'] },
  { tipo: 'rimas', palabra: 'Luna', rimaCorrecta: 'Cuna', opciones: ['Cuna', 'Perro', 'Gato'] },
  { tipo: 'rimas', palabra: 'Ratón', rimaCorrecta: 'Botón', opciones: ['Botón', 'Casa', 'Pez'] },
  { tipo: 'rimas', palabra: 'Casa', rimaCorrecta: 'Masa', opciones: ['Masa', 'Avión', 'Luna'] },
  { tipo: 'rimas', palabra: 'Oveja', rimaCorrecta: 'Abeja', opciones: ['Abeja', 'Queso', 'Pato'] },
  { tipo: 'rimas', palabra: 'Queso', rimaCorrecta: 'Hueso', opciones: ['Hueso', 'Ratón', 'Silla'] },
  { tipo: 'rimas', palabra: 'Silla', rimaCorrecta: 'Ardilla', opciones: ['Ardilla', 'Ojo', 'Zapato'] },
  { tipo: 'rimas', palabra: 'Pera', rimaCorrecta: 'Tetera', opciones: ['Tetera', 'Sol', 'Mano'] },
  { tipo: 'rimas', palabra: 'Estrella', rimaCorrecta: 'Botella', opciones: ['Botella', 'León', 'Agua'] }
];

const cuentosSimple = [
  {
    titulo: 'El Sombrero Rojo',
    texto: 'Había una vez una niña con un sombrero rojo. Caminó por el bosque y encontró un conejo.',
    preguntas: [
      { pregunta: '¿Qué color era el sombrero?', opciones: ['Rojo', 'Azul', 'Verde'], correcta: 'Rojo' },
      { pregunta: '¿Qué encontró la niña?', opciones: ['Un conejo', 'Un árbol', 'Una casa'], correcta: 'Un conejo' },
    ]
  },  
  {
    titulo: 'El Perro y el Gato',
    texto: 'El perro ladró al gato. El gato maulló y corrió.',
    preguntas: [
      { pregunta: '¿Qué hizo el perro?', opciones: ['Ladró', 'Maulló', 'Corrió'], correcta: 'Ladró' },
      { pregunta: '¿Qué hizo el gato?', opciones: ['Ladró', 'Maulló', 'Corrió'], correcta: 'Maulló' }
    ]
  }
];

const cuentosMedio = [
  {
    titulo: 'El Naufrago',
    texto: 'Un naufrago se encontraba perdido en el mar. Hasta que llego a una isla.',
    preguntas: [
      { pregunta: '¿Dónde estaba el naufrago?', opciones: ['En el mar', 'En la calle', 'En su casa'], correcta: 'En el mar'},
      { pregunta: 'El naufrago llego a una ', opciones: ['Casa', 'Isla', 'Ciudad'], correcta: 'Isla'},
    ]

  },
  {
    titulo: 'Dragón durmiente',
    texto: 'Un hada estaba paseando por el bosque cuando de pronto a lo lejos ve un dragón durmiendo y se alejo del lugar.',
    preguntas: [
      { pregunta: '¿Quién estaba durmiendo?', opciones: ['El dragón', 'El hada', 'El bosque'], correcta: 'El dragón'},
      { pregunta: '¿Por dónde paso el hada?', opciones: ['Por el bosque', 'Por el cielo', 'Por un dragón'], correcta: 'Por el bosque'},
    ]
  }
];

const cuentosAvanzado = [
  {
    titulo: 'La Aventura en el Bosque',
    texto: 'Un niño encontró un mapa en el bosque. Siguió el camino y llegó a una cueva llena de tesoros.',
    preguntas: [
      { pregunta: '¿Qué encontró el niño?', opciones: ['Un mapa', 'Un libro', 'Un juguete'], correcta: 'Un mapa' },
      { pregunta: '¿Dónde llegó?', opciones: ['A una cueva', 'A una casa', 'A un río'], correcta: 'A una cueva' }
    ]
  },
  {
    titulo: 'El explorador Teo',
    texto: 'El pequeño explorador, Teo, desafió al gigante de la montaña, quien gentilmente le ofreció un mapa estelar hacia la Luna de Caramelo.',
    preguntas: [
      {pregunta: '¿A quien desafio Teo?', opciones: ['Un gigante', 'Un león', 'Un caramelo'], correcta: 'Un gigante' },
      {pregunta: '¿De que es la luna?', opciones: ['Caramelo', 'Estelar', 'Piedra'], correcta: 'Caramelo' }
    ]
  }
];

// Variables
let vocalActual = null;
let puntajeVocales = 0;
let vocalActualJuego2 = null;
let puntajeImagenes = 0;
let datoActualMemoria = null;
let puntajeMemoria = 0;
let cuentoActual = null;
let preguntaActualIndex = 0;
let puntajeCuentos = 0;
let aciertosConsecutivosVocales = 0;
let opcionesVocales = 5;
let aciertosConsecutivosImagenes = 0;
let numImagenes = 4; 
let aciertosConsecutivosMemoria = 0;
let nivelMemoria = 1;
let aciertosConsecutivosCuentos = 0;
let nivelCuentos = 1; 
let vocalesMostradas = [];
let juegoVocalesCompletado = false;
let juegoImagenesCompletado = false;
let imagenesSeleccionadas = [];  
let imagenesCorrectas = [];
let juegoMemoriaCompletado = false;
let juegoCuentosCompletado = false;
let palabraUsadasMemoria = [];

function reproducirAudioPalabra(palabra) { reproducirTTS(palabra, 0.6); }
function reproducirAudioCuento(textoCuento) { reproducirTTS(textoCuento, 0.7); }
// Esta función ya no la usaremos directamente para preguntas, usaremos la lógica interna de mostrarPregunta

window.onload = () => {
  inicializarAuth();

  document.getElementById('btn-vocales').onclick = iniciarJuegoVocales;
  document.getElementById('btn-imagenes').onclick = iniciarJuegoImagenes;
  document.getElementById('btn-memoria-fonologica').onclick = iniciarJuegoMemoria;
  document.getElementById('btn-cuentos').onclick = iniciarJuegoCuentos; 
  
  // Botones VOLVER
  document.getElementById('btn-volver-vocales').onclick = async () => {
    limpiarTemporizadores();
    await guardarPuntaje('vocales', puntajeVocales);
    mostrarMenu();
  };
  document.getElementById('btn-volver-imagenes').onclick = async () => {
    limpiarTemporizadores();
    const btnConfirmar = document.getElementById('btn-confirmar-imagenes');
    if(btnConfirmar) btnConfirmar.style.display = 'none';
    await guardarPuntaje('imagenes', puntajeImagenes);
    mostrarMenu();
  };
  document.getElementById('btn-volver-memoria').onclick = async () => { 
    limpiarTemporizadores();
    await guardarPuntaje('memoria', puntajeMemoria);
    mostrarMenu();
  };
  document.getElementById('btn-volver-cuentos').onclick = async () => { 
    limpiarTemporizadores();
    await guardarPuntaje('cuentos', puntajeCuentos);
    mostrarMenu();
  };
  
  mostrarMenu();
};

function mostrarMenu() {
  const menu = document.getElementById('menu');
  menu.classList.remove('d-none');
  menu.classList.add('d-flex');
  ['juego-vocales', 'juego-imagenes', 'juego-memoria-fonologica', 'juego-cuentos'].forEach(id => {
    document.getElementById(id).style.display = 'none';
  });
}

function mostrarJuego(idJuego) {
  const menu = document.getElementById('menu');
  menu.classList.remove('d-flex');
  menu.classList.add('d-none');
  const juegoDiv = document.getElementById(idJuego);
  juegoDiv.style.display = 'block';
  window.scrollTo(0, 0);
}

// --- Juego 1 ---
function iniciarJuegoVocales() {
  puntajeVocales = 0; aciertosConsecutivosVocales = 0; opcionesVocales = 5; vocalesMostradas = []; juegoVocalesCompletado = false;
  document.getElementById('puntaje-vocales').textContent = puntajeVocales;
  mostrarJuego('juego-vocales');
  nuevaRondaVocales();
}

function nuevaRondaVocales() {
  if (juegoVocalesCompletado) return;
  const vocalesDisponibles = vocales.filter(v => !vocalesMostradas.includes(v.letra));
  
  if (vocalesDisponibles.length === 0) {
    juegoVocalesCompletado = true;
    mostrarMensaje('mensaje-vocales', '¡Juego completado! 🎉 Puntaje final: ' + puntajeVocales, 'primary');
    document.getElementById('opciones-container-vocales').innerHTML = '';
    document.getElementById('imagen-container-vocales').innerHTML = '';
    return;
  }

  vocalActual = vocalesDisponibles[Math.floor(Math.random() * vocalesDisponibles.length)];
  vocalesMostradas.push(vocalActual.letra);
  
  document.getElementById('imagen-container-vocales').innerHTML = 
      `<img src="${vocalActual.imagen}" alt="Vocal" class="img-fluid rounded border border-4 border-warning shadow vocal-img-style" />`;
  
  const opcionesContainer = document.getElementById('opciones-container-vocales');
  opcionesContainer.innerHTML = '';
  
  let letrasSeleccionadas = [vocalActual.letra];
  const letrasDisponibles = vocales.map(v => v.letra).filter(l => l !== vocalActual.letra);
  
  while (letrasSeleccionadas.length < opcionesVocales && letrasDisponibles.length > 0) {
    const randomIndex = Math.floor(Math.random() * letrasDisponibles.length);
    letrasSeleccionadas.push(letrasDisponibles.splice(randomIndex, 1)[0]);
  }
  letrasSeleccionadas.sort(() => Math.random() - 0.5);
  
  letrasSeleccionadas.forEach(letra => {
    const btn = document.createElement('button');
    btn.textContent = letra;
    btn.className = 'btn btn-warning m-2 shadow fw-bold';
    btn.style.fontSize = '2.5rem';
    btn.style.width = '80px';
    btn.style.height = '80px';
    btn.onclick = () => validarRespuestaVocales(letra);
    opcionesContainer.appendChild(btn);
  });
  
  ocultarMensaje('mensaje-vocales');
  timerAudio = setTimeout(() => reproducirTTS(vocalActual.letra), 500);
}

async function validarRespuestaVocales(letraSeleccionada) {
  if (juegoVocalesCompletado) return;
  const esCorrecto = letraSeleccionada.toUpperCase() === vocalActual.letra.toUpperCase();
  
  if (esCorrecto) {
    puntajeVocales++;
    aciertosConsecutivosVocales++;
    document.getElementById('puntaje-vocales').textContent = puntajeVocales;
    if (aciertosConsecutivosVocales >= 5) opcionesVocales = Math.max(2, opcionesVocales);
    else if (aciertosConsecutivosVocales >= 3) opcionesVocales = 3;
    mostrarMensaje('mensaje-vocales', '¡Correcto! 🎉', 'success');
  } else {
    aciertosConsecutivosVocales = 0;
    opcionesVocales = 5;
    mostrarMensaje('mensaje-vocales', `Incorrecto. La respuesta correcta es ${vocalActual.letra}`, 'danger');
  }
  timerSiguiente = setTimeout(nuevaRondaVocales, 2000);
}

// --- Juego 2 ---
function iniciarJuegoImagenes() {
  puntajeImagenes = 0; aciertosConsecutivosImagenes = 0; numImagenes = 4; juegoImagenesCompletado = false;
  imagenesSeleccionadas = []; imagenesCorrectas = [];
  document.getElementById('puntaje-imagenes').textContent = puntajeImagenes;
  mostrarJuego('juego-imagenes');
  
  const container = document.getElementById('juego-imagenes');
  let btnConfirmar = document.getElementById('btn-confirmar-imagenes');
  
  if (!btnConfirmar) {
    btnConfirmar = document.createElement('button');
    btnConfirmar.id = 'btn-confirmar-imagenes';
    btnConfirmar.textContent = '✅ Confirmar Selección';
    btnConfirmar.className = 'btn btn-success btn-lg w-100 mt-3 shadow fw-bold rounded-pill animate__animated animate__fadeInUp';
    btnConfirmar.onclick = () => confirmarSeleccionImagenes();
    const btnVolver = document.getElementById('btn-volver-imagenes').parentNode;
    container.insertBefore(btnConfirmar, btnVolver);
  } else {
    btnConfirmar.style.display = 'block';
  }
  
  nuevaRondaImagenes();
}

function nuevaRondaImagenes() {
  if (juegoImagenesCompletado) return;
  vocalActualJuego2 = vocales[Math.floor(Math.random() * vocales.length)].letra;
  document.getElementById('vocal-actual-imagenes').textContent = vocalActualJuego2;
  const imagenesContainer = document.getElementById('imagenes-container');
  imagenesContainer.innerHTML = '';
  imagenesSeleccionadas = [];
  imagenesCorrectas = imagenesJuego2.filter(img => img.vocal === vocalActualJuego2);

  const opciones = [...imagenesCorrectas];
  const incorrectas = imagenesJuego2.filter(img => img.vocal !== vocalActualJuego2);
  while (opciones.length < numImagenes && incorrectas.length > 0) {
    const randomIndex = Math.floor(Math.random() * incorrectas.length);
    opciones.push(incorrectas.splice(randomIndex, 1)[0]);
  }
  opciones.sort(() => Math.random() - 0.5);

  opciones.forEach(imgObj => {
    const imgElem = document.createElement('img');
    imgElem.src = imgObj.imagen;
    imgElem.alt = imgObj.palabra;
    imgElem.className = 'imagen-seleccionable border border-4 border-light rounded shadow-sm m-2';
    imgElem.style.width = '120px';
    imgElem.style.height = '120px';
    imgElem.style.cursor = 'pointer';
    imgElem.onclick = () => toggleSeleccionImagen(imgElem, imgObj);
    imagenesContainer.appendChild(imgElem);
  });

  ocultarMensaje('mensaje-imagenes');
  timerAudio = setTimeout(() => reproducirTTS(vocalActualJuego2), 500);
}

function toggleSeleccionImagen(imgElem, imgObj) {
  const index = imagenesSeleccionadas.findIndex(sel => sel.palabra === imgObj.palabra);
  if (index > -1) {
    imagenesSeleccionadas.splice(index, 1);
    imgElem.classList.remove('border-success');
    imgElem.classList.add('border-light');
    imgElem.style.transform = 'scale(1)';
  } else {
    imagenesSeleccionadas.push(imgObj);
    imgElem.classList.remove('border-light');
    imgElem.classList.add('border-success'); 
    imgElem.style.transform = 'scale(1.1)';
  }
}

function confirmarSeleccionImagenes() {
  if (juegoImagenesCompletado) return;
  const seleccionadasPalabras = imagenesSeleccionadas.map(sel => sel.palabra);
  const correctasPalabras = imagenesCorrectas.map(corr => corr.palabra);
  const esCorrecto = seleccionadasPalabras.length === correctasPalabras.length &&
                     seleccionadasPalabras.every(pal => correctasPalabras.includes(pal));
  
  if (esCorrecto) {
    puntajeImagenes++;
    aciertosConsecutivosImagenes++;
    document.getElementById('puntaje-imagenes').textContent = puntajeImagenes;
    if (aciertosConsecutivosImagenes >= 5) numImagenes = 8;
    else if (aciertosConsecutivosImagenes >= 3) numImagenes = 6;
    
    if (puntajeImagenes >= 10) {
      juegoImagenesCompletado = true;
      mostrarMensaje('mensaje-imagenes', '¡Juego completado! 🎉 Puntaje final: ' + puntajeImagenes, 'primary');
      document.getElementById('imagenes-container').innerHTML = '';
      document.getElementById('btn-confirmar-imagenes').style.display = 'none';
      return;
    }
    mostrarMensaje('mensaje-imagenes', '¡Correcto! 🎉', 'success');
  } else {
    aciertosConsecutivosImagenes = 0;
    numImagenes = 4;
    mostrarMensaje('mensaje-imagenes', 'Incorrecto. Revisa tu selección.', 'danger');
  }
  timerSiguiente = setTimeout(() => {
    imagenesSeleccionadas = [];
    nuevaRondaImagenes();
  }, 2000);
}

// --- Juego 3 ---
function iniciarJuegoMemoria() {
  puntajeMemoria = 0;
  juegoMemoriaCompletado = false;
  palabraUsadasMemoria = [];
  document.getElementById('puntaje-memoria').textContent = puntajeMemoria;
  mostrarJuego('juego-memoria-fonologica');
  
  document.getElementById('btn-reproducir-palabra').onclick = () => {
    if (datoActualMemoria) reproducirAudioPalabra(datoActualMemoria.palabra);
  };
  nuevaRondaMemoria();
}

function nuevaRondaMemoria() {
  if (juegoMemoriaCompletado) return;
  let datosActuales = datosMemoriaSimple;
  if (nivelMemoria === 2) datosActuales = datosMemoriaMedio;
  else if (nivelMemoria === 3) datosActuales = datosMemoriaAvanzado;

  const datosDisponibles = datosActuales.filter(dato => !palabraUsadasMemoria.includes(dato.palabra));
  if (datosDisponibles.length == 0){
    palabraUsadasMemoria = [];
    nuevaRondaMemoria();
    return;   
  }
  
  datoActualMemoria = datosDisponibles[Math.floor(Math.random() * datosDisponibles.length)];
  palabraUsadasMemoria.push(datoActualMemoria.palabra);
  
  const opcionesContainer = document.getElementById('opciones-container-memoria');
  opcionesContainer.innerHTML = '';
  
  if (datoActualMemoria.tipo === 'silabas') {
    [1,2, 3, 4, 5].forEach(num => {
      const btn = document.createElement('button');
      btn.textContent = num;
      btn.className = 'btn btn-primary btn-circulo shadow fw-bold m-2';
      btn.onclick = () => validarRespuestaMemoria(num);
      opcionesContainer.appendChild(btn);
    });
  } else {
    datoActualMemoria.opciones.forEach(opcion => {
      const btn = document.createElement('button');
      btn.textContent = opcion;
      btn.className = 'btn btn-primary m-2 shadow fw-bold fs-5 px-4 py-3 rounded-4';
      btn.onclick = () => validarRespuestaMemoria(opcion);
      opcionesContainer.appendChild(btn);
    });
 }
  ocultarMensaje('mensaje-memoria');
  timerAudio = setTimeout(() => reproducirAudioPalabra(datoActualMemoria.palabra), 500);
}

function validarRespuestaMemoria(respuesta) {
  let esCorrecto = false;
  if (datoActualMemoria.tipo === 'silabas') {
    esCorrecto = Number(respuesta) === datoActualMemoria.silabas; 
  } else {
    esCorrecto = respuesta === datoActualMemoria.rimaCorrecta;  
  }
  
  if (esCorrecto) {
    puntajeMemoria++;
    aciertosConsecutivosMemoria++;
    document.getElementById('puntaje-memoria').textContent = puntajeMemoria;
    if (aciertosConsecutivosMemoria >= 5) nivelMemoria = 3;
    else if (aciertosConsecutivosMemoria >= 3) nivelMemoria = 2;

    if (puntajeMemoria >= 10) { 
      juegoMemoriaCompletado = true;
      mostrarMensaje('mensaje-memoria', '¡Juego completado! 🎉 Puntaje final: ' + puntajeMemoria, 'primary');
      document.getElementById('opciones-container-memoria').innerHTML = '';
      return;
    }
    mostrarMensaje('mensaje-memoria', '¡Correcto! 🎉', 'success');
  } else {
    aciertosConsecutivosMemoria = 0;
    nivelMemoria = 1;
    mostrarMensaje('mensaje-memoria', 'Incorrecto. Intenta de nuevo.', 'danger');
  }
  timerSiguiente = setTimeout(nuevaRondaMemoria, 2000);
}

// --- Juego 4 ---
function iniciarJuegoCuentos() {
  puntajeCuentos = 0;
  preguntaActualIndex = 0;
  juegoCuentosCompletado = false;
  document.getElementById('puntaje-cuentos').textContent = puntajeCuentos;
  mostrarJuego('juego-cuentos');
  
  document.getElementById('btn-reproducir-cuento').onclick = () => {
    if(cuentoActual) reproducirAudioCuento(cuentoActual.texto);
  };
  
  nuevaRondaCuentos();
}

function nuevaRondaCuentos() {
  let cuentosActuales = cuentosSimple;
  if (nivelCuentos === 2) cuentosActuales = cuentosMedio;
  else if (nivelCuentos === 3) cuentosActuales = cuentosAvanzado;
  
  cuentoActual = cuentosActuales[Math.floor(Math.random() * cuentosActuales.length)];
  preguntaActualIndex = 0;
  
  document.getElementById('cuento-container').innerHTML = `<h3 class="text-danger mb-3 fw-bold">${cuentoActual.titulo}</h3><p class="fs-4">${cuentoActual.texto}</p>`;
  
  timerAudio = setTimeout(() => reproducirAudioCuento(cuentoActual.texto), 500);
  mostrarPreguntaCuentos();
}

// *** AQUÍ ESTÁ EL CAMBIO CLAVE ***
function mostrarPreguntaCuentos() {
  if (preguntaActualIndex >= cuentoActual.preguntas.length) {
    mostrarMensaje('mensaje-cuentos', '¡Cuento completado! Puntaje: ' + puntajeCuentos, 'success');
    timerSiguiente = setTimeout(nuevaRondaCuentos, 3000);
    return;
  }
  const pregunta = cuentoActual.preguntas[preguntaActualIndex];
  document.getElementById('pregunta-container').innerHTML = `<p>${pregunta.pregunta}</p>`;

  const opcionesContainer = document.getElementById('opciones-container-cuentos');
  opcionesContainer.innerHTML = '';
  pregunta.opciones.forEach(opcion => {
    const btn = document.createElement('button');
    btn.textContent = opcion;
    btn.className = 'btn btn-outline-primary btn-lg m-2 fw-bold border-3 rounded-pill';
    btn.onclick = () => validarRespuestaCuentos(opcion);
    opcionesContainer.appendChild(btn);
  });

  ocultarMensaje('mensaje-cuentos');
  
  // LEEMOS LA PREGUNTA Y LUEGO LAS OPCIONES
  // Creamos un texto único combinando todo
  const textoOpciones = pregunta.opciones.join('. '); 
  const textoCompleto = `${pregunta.pregunta}. ${textoOpciones}`;
  
  // Usamos timerAudio para gestionar el retraso, así si el usuario sale, se cancela
  timerAudio = setTimeout(() => reproducirTTS(textoCompleto, 0.7), 500);
}

function validarRespuestaCuentos(respuesta) {
  if (!cuentoActual || preguntaActualIndex >= cuentoActual.preguntas.length) return;
  const pregunta = cuentoActual.preguntas[preguntaActualIndex];
  const esCorrecto = respuesta === pregunta.correcta;
  
  let textoMensaje = '';
  
  if (esCorrecto) {
    puntajeCuentos++;
    aciertosConsecutivosCuentos++;
    document.getElementById('puntaje-cuentos').textContent = puntajeCuentos;
    if (aciertosConsecutivosCuentos >= 4) nivelCuentos = 3;
    else if (aciertosConsecutivosCuentos >= 2) nivelCuentos = 2;
    
    textoMensaje = '¡Correcto! ¡Muy bien!'; 
    
    if (puntajeCuentos >= 10) {  
      juegoCuentosCompletado = true;
      mostrarMensaje('mensaje-cuentos', '¡Juego completado! 🎉 Puntaje final: ' + puntajeCuentos, 'primary');
      document.getElementById('opciones-container-cuentos').innerHTML = '';
      document.getElementById('pregunta-container').innerHTML = '';
      document.getElementById('cuento-container').innerHTML = '';
      return;
    }
    mostrarMensaje('mensaje-cuentos', textoMensaje, 'success');
    reproducirTTS(textoMensaje); 
  } else {
    aciertosConsecutivosCuentos = 0;
    nivelCuentos--; 
    textoMensaje = `Incorrecto. La respuesta correcta es: ${pregunta.correcta}`;
    mostrarMensaje('mensaje-cuentos', textoMensaje, 'danger');
    reproducirTTS(textoMensaje); 
  }
  
  preguntaActualIndex++;
  timerSiguiente = setTimeout(mostrarPreguntaCuentos, 2500); 
}