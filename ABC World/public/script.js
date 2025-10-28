import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, doc, setDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
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
        userId = user.uid;  // ID único para el usuario
        console.log('Usuario autenticado:', userId);
      }
    });
  } catch (error) {
    console.error('Error en autenticación:', error);
  }
}

async function guardarPuntaje(juego, puntaje) {
  if (!userId) return;  // No guardar si no hay usuario
  try {
    // Guardar en una colección "puntajes" con doc por usuario y juego
    await setDoc(doc(db, 'puntajes', userId), {
      juego: juego,  // ej. 'vocales' o 'imagenes'
      puntaje: puntaje,
      fecha: new Date().toISOString()
    }, { merge: true });  // merge para actualizar si existe
    console.log('Puntaje guardado:', puntaje);
  } catch (error) {
    console.error('Error al guardar puntaje:', error);
  }
}

async function cargarPuntajeMaximo(juego) {
  if (!userId) return 0;
  try {
    const docRef = doc(db, 'puntajes', userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().puntaje || 0;
    }
    return 0;
  } catch (error) {
    console.error('Error al cargar puntaje:', error);
    return 0;
  }
}

// Función para reproducir texto con TTS
function reproducirTTS(texto, velocidad = 0.8, vozSeleccionada = null) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = 'es-MX';  // Idioma español (cambia a 'es-MX' para México, etc.)
    utterance.rate = velocidad;  // Velocidad: 0.1 (lento) a 2.0 (rápido)
    utterance.pitch = 1;  // Tono: 0 (grave) a 2 (agudo)
    
    // Seleccionar voz (opcional)
    if (vozSeleccionada) {
      utterance.voice = vozSeleccionada;
    } else {
      // Usar la primera voz en español disponible
      const voces = speechSynthesis.getVoices();
      const vozEspanol = voces.find(voice => voice.lang.startsWith('es'));
      if (vozEspanol) utterance.voice = vozEspanol;
    }
    
    speechSynthesis.speak(utterance);
  } else {
    console.log('TTS no soportado en este navegador');
  }
}


// Datos para juego 1: vocales con imágenes
const vocales = [
  { letra: 'A', imagen: 'images/a.png' },
  { letra: 'E', imagen: 'images/e.png' },
  { letra: 'I', imagen: 'images/i.png' },
  { letra: 'O', imagen: 'images/o.png' },
  { letra: 'U', imagen: 'images/u.png' },
];

// Datos para juego 2: imágenes con palabra y vocal inicial
const imagenesJuego2 = [
  { palabra: 'Araña', imagen: 'images/imagenesJuego2/araña.png', vocal: 'A' },
  { palabra: 'Avión', imagen: 'images/imagenesJuego2/avion.png', vocal: 'A' },
  { palabra: 'Elefante', imagen: 'images/imagenesJuego2/elefante.png', vocal: 'E' },
  {palabra: 'Escoba', imagen: 'images/imagenesJuego2/escoba.png', vocal: 'E' },
  { palabra: 'Isla', imagen: 'images/imagenesJuego2/isla.png', vocal: 'I' },
  { palabra: 'Iglú', imagen: 'images/imagenesJuego2/iglú.png', vocal : 'I' },
  { palabra: 'Oso', imagen: 'images/imagenesJuego2/oso.png', vocal: 'O' },
  { palabra: 'Ojo', imagen: 'images/imagenesJuego2/ojo.png', vocal: 'O' },
  { palabra: 'Uva', imagen: 'images/imagenesJuego2/uva.png', vocal: 'U' },
  { palabra: 'Casa', imagen: 'images/imagenesJuego2/casa.png', vocal: 'A' }, // ejemplo extra que no empieza por vocal A
  { palabra: 'Perro', imagen: 'images/imagenesJuego2/perro.png', vocal: 'E' }, // ejemplo extra
];

const datosMemoria = [
  { tipo: 'silabas', palabra: 'Elefante', silabas: 4 },
  { tipo: 'silabas', palabra: 'Casa', silabas: 2 },
  { tipo: 'rimas', palabra: 'Gato', rimaCorrecta: 'Pato', opciones: ['Pato', 'Sol', 'Luna'] },
  { tipo: 'rimas', palabra: 'Sol', rimaCorrecta: 'Sol', opciones: ['Luna', 'Sol', 'Casa'] },
];

const cuentos = [
  {
    titulo: 'El Sombrero Rojo',
    texto: 'Había una vez una niña con un sombrero rojo. Caminó por el bosque y encontró un conejo.',
    preguntas: [
      { pregunta: '¿Qué color era el sombrero?', opciones: ['Rojo', 'Azul', 'Verde'], correcta: 'Rojo' },
      { pregunta: '¿Qué encontró la niña?', opciones: ['Un conejo', 'Un árbol', 'Una casa'], correcta: 'Un conejo' }
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


// Variables para juegos
let vocalActual = null;
let puntajeVocales = 0;
let vocalActualJuego2 = null;
let puntajeImagenes = 0;
let datoActualMemoria = null;
let puntajeMemoria = 0;
let cuentoActual = null;
let preguntaActualIndex = 0;
let puntajeCuentos = 0;


// Función para reproducir palabra con TTS (Juego 3)
function reproducirAudioPalabra(palabra) {
  reproducirTTS(palabra, 0.6);  // Lento para claridad
}
// Función para reproducir cuento con TTS (Juego 4)
function reproducirAudioCuento(textoCuento) {
  reproducirTTS(textoCuento, 0.7);  // Moderado para narración
}
function reproducirAudioPregunta(textoPregunta) {
  reproducirTTS(textoPregunta, 0.7);  // Misma velocidad que el cuento
}

window.onload = () => {
  inicializarAuth();

  // Referencias a botones menú
  document.getElementById('btn-vocales').onclick = () => iniciarJuegoVocales();
  document.getElementById('btn-imagenes').onclick = () => iniciarJuegoImagenes();
  document.getElementById('btn-memoria-fonologica').onclick = () => iniciarJuegoMemoria();
  document.getElementById('btn-cuentos').onclick = () => iniciarJuegoCuentos(); 
  
  
  document.getElementById('btn-volver-vocales').onclick = async () => {
    await guardarPuntaje('vocales', puntajeVocales);
    mostrarMenu();
  };
  document.getElementById('btn-volver-imagenes').onclick = async () => {
    await guardarPuntaje('imagenes', puntajeImagenes);
    mostrarMenu();
  };
  document.getElementById('btn-volver-memoria').onclick = async () => { 
    await guardarPuntaje('memoria', puntajeMemoria);
    mostrarMenu();
  };
  document.getElementById('btn-volver-cuentos').onclick = async () => { 
    await guardarPuntaje('cuentos', puntajeCuentos);
    mostrarMenu();
  };
  
  mostrarMenu();
};

// Mostrar solo el menú y ocultar juegos
function mostrarMenu() {
  document.getElementById('menu').style.display = 'block';
  document.getElementById('juego-vocales').style.display = 'none';
  document.getElementById('juego-imagenes').style.display = 'none';
  document.getElementById('juego-memoria-fonologica').style.display = 'none';
  document.getElementById('juego-cuentos').style.display = 'none';
}

// --- Juego 1: Aprender las vocales ---

async function iniciarJuegoVocales() {
  const highScore = await cargarPuntajeMaximo('vocales');
  document.getElementById('puntaje-vocales').textContent = `0 (Mejor: ${highScore})`;
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
    await guardarPuntaje('vocales', puntajeVocales);
    mensaje.textContent = '¡Correcto! 🎉';
    mensaje.style.color = 'green';
  } else {
    mensaje.textContent = `Incorrecto. La respuesta correcta es ${vocalActual.letra}`;
    mensaje.style.color = 'red';
  }

  setTimeout(nuevaRondaVocales, 2000);
}
document.getElementById('btn-volver-vocales').onclick = async () => {
  await guardarPuntaje('vocales', puntajeVocales);  // Guardar final
  mostrarMenu();
};

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


// --- juego 3: rimas y silabas ---
function iniciarJuegoMemoria() {
  puntajeMemoria = 0;
  document.getElementById('puntaje-memoria').textContent = puntajeMemoria;
  document.getElementById('menu').style.display = 'none';
  document.getElementById('juego-memoria-fonologica').style.display = 'block';
  
  
  nuevaRondaMemoria();
}
function nuevaRondaMemoria() {
  datoActualMemoria = datosMemoria[Math.floor(Math.random() * datosMemoria.length)];
  const instruccion = datoActualMemoria.tipo === 'silabas' 
    ? `Cuenta las sílabas de "${datoActualMemoria.palabra}"` 
    : `¿Qué palabra rima con "${datoActualMemoria.palabra}"?`;
  document.getElementById('instruccion-memoria').textContent = instruccion;
  
  const opcionesContainer = document.getElementById('opciones-container-memoria');
  opcionesContainer.innerHTML = '';
  if (datoActualMemoria.tipo === 'silabas') {
    [2, 3, 4, 5].forEach(num => {
      const btn = document.createElement('button');
      btn.textContent = num;
      btn.onclick = () => validarRespuestaMemoria(num);
      opcionesContainer.appendChild(btn);
    });
  } else {
    datoActualMemoria.opciones.forEach(opcion => {
      const btn = document.createElement('button');
      btn.textContent = opcion;
      btn.onclick = () => validarRespuestaMemoria(opcion);
      opcionesContainer.appendChild(btn);
    });
 }
  document.getElementById('mensaje-memoria').textContent = '';
  setTimeout(() => reproducirAudioPalabra(datoActualMemoria.palabra), 500);
}

function validarRespuestaMemoria(respuesta) {
  const esCorrecto = datoActualMemoria.tipo === 'silabas' 
    ? respuesta === datoActualMemoria.silabas 
    : respuesta === datoActualMemoria.rimaCorrecta;
  const mensaje = document.getElementById('mensaje-memoria');
  if (esCorrecto) {
    puntajeMemoria++;
    document.getElementById('puntaje-memoria').textContent = puntajeMemoria;
    mensaje.textContent = '¡Correcto! 🎉';
    mensaje.style.color = 'green';
  } else {
    mensaje.textContent = 'Incorrecto. Intenta de nuevo.';
    mensaje.style.color = 'red';
  }
  setTimeout(nuevaRondaMemoria, 2000);
}

// --- Juego 4: Cuentos Cortos ---
function iniciarJuegoCuentos() {
  puntajeCuentos = 0;
  preguntaActualIndex = 0;
  document.getElementById('puntaje-cuentos').textContent = puntajeCuentos;
  document.getElementById('menu').style.display = 'none';
  document.getElementById('juego-cuentos').style.display = 'block';
  
  
  nuevaRondaCuentos();
}
function nuevaRondaCuentos() {
  cuentoActual = cuentos[Math.floor(Math.random() * cuentos.length)];
  preguntaActualIndex = 0;
  document.getElementById('cuento-container').innerHTML = `<h3>${cuentoActual.titulo}</h3><p>${cuentoActual.texto}</p>`;
  setTimeout(() => reproducirAudioCuento(cuentoActual.texto), 500);
  mostrarPreguntaCuentos();
}
function mostrarPreguntaCuentos() {
  if (preguntaActualIndex >= cuentoActual.preguntas.length) {
    document.getElementById('mensaje-cuentos').textContent = '¡Cuento completado! Puntaje: ' + puntajeCuentos;
    setTimeout(nuevaRondaCuentos, 3000);
    return;
  }
  const pregunta = cuentoActual.preguntas[preguntaActualIndex];
  document.getElementById('pregunta-container').innerHTML = `<p>${pregunta.pregunta}</p>`;

  const opcionesContainer = document.getElementById('opciones-container-cuentos');
  opcionesContainer.innerHTML = '';
  pregunta.opciones.forEach(opcion => {
    const btn = document.createElement('button');
    btn.textContent = opcion;
    btn.onclick = () => validarRespuestaCuentos(opcion);
    opcionesContainer.appendChild(btn);
  });
  document.getElementById('mensaje-cuentos').textContent = '';
  setTimeout(() => reproducirAudioPregunta(pregunta.pregunta), 500);
}
function validarRespuestaCuentos(respuesta) {
  const pregunta = cuentoActual.preguntas[preguntaActualIndex];
  const esCorrecto = respuesta === pregunta.correcta;
  const mensaje = document.getElementById('mensaje-cuentos');
  if (esCorrecto) {
    puntajeCuentos++;
    document.getElementById('puntaje-cuentos').textContent = puntajeCuentos;
    mensaje.textContent = '¡Correcto! 🎉';
    mensaje.style.color = 'green';
  } else {
    mensaje.textContent = `Incorrecto. La respuesta correcta es: ${pregunta.correcta}`;
    mensaje.style.color = 'red';
  }
  preguntaActualIndex++;
  setTimeout(mostrarPreguntaCuentos, 2000);
}
