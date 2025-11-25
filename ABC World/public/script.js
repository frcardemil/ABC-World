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
  { palabra: 'Araña', imagen: 'images/imagenesJuego2/arana.png', vocal: 'A' },
  { palabra: 'Avión', imagen: 'images/imagenesJuego2/avion.png', vocal: 'A' },
  { palabra: 'Elefante', imagen: 'images/imagenesJuego2/elefante.png', vocal: 'E' },
  {palabra: 'Escoba', imagen: 'images/imagenesJuego2/escoba.png', vocal: 'E' },
  { palabra: 'Isla', imagen: 'images/imagenesJuego2/isla.png', vocal: 'I' },
  { palabra: 'Iglú', imagen: 'images/imagenesJuego2/iglu.png', vocal : 'I' },
  { palabra: 'Oso', imagen: 'images/imagenesJuego2/oso.png', vocal: 'O' },
  { palabra: 'Ojo', imagen: 'images/imagenesJuego2/ojo.png', vocal: 'O' },
  { palabra: 'Uva', imagen: 'images/imagenesJuego2/uva.png', vocal: 'U' },
  { palabra: 'Casa', imagen: 'images/imagenesJuego2/casa.png', vocal: 'A' }, // ejemplo extra que no empieza por vocal A
  { palabra: 'Perro', imagen: 'images/imagenesJuego2/perro.png', vocal: 'E' }, // ejemplo extra
];

// Datos para juego 3: memoria fonológica
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

// Datos para juego 4: cuentos cortos con preguntas
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
    document.getElementById('btn-confirmar-imagenes').style.display = 'none';
    await guardarPuntaje('imagenes', puntajeImagenes);
    mostrarMenu();
  };
  document.getElementById('btn-volver-memoria').onclick = async () => { 
    speechSynthesis.cancel();
    await guardarPuntaje('memoria', puntajeMemoria);
    mostrarMenu();
  };
  document.getElementById('btn-volver-cuentos').onclick = async () => { 
    speechSynthesis.cancel();
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

function iniciarJuegoVocales() {
  puntajeVocales = 0;
  aciertosConsecutivosVocales = 0;
  opcionesVocales = 5;
  vocalesMostradas = [];  // Reset
  juegoVocalesCompletado = false;
  document.getElementById('puntaje-vocales').textContent = puntajeVocales;
  document.getElementById('menu').style.display = 'none';
  document.getElementById('juego-vocales').style.display = 'block';


  nuevaRondaVocales();
}

function nuevaRondaVocales() {
  if (juegoVocalesCompletado) return;  // No continuar si terminó
  
  // Filtrar vocales no mostradas
  const vocalesDisponibles = vocales.filter(v => !vocalesMostradas.includes(v.letra));
  
  if (vocalesDisponibles.length === 0) {
    // Todas las vocales mostradas: finalizar juego
    juegoVocalesCompletado = true;
    document.getElementById('mensaje-vocales').textContent = '¡Juego completado! Has aprendido todas las vocales. Puntaje final: ' + puntajeVocales;
    document.getElementById('mensaje-vocales').style.color = 'blue';
    // Ocultar opciones y mostrar solo el botón volver
    document.getElementById('opciones-container-vocales').innerHTML = '';
    document.getElementById('imagen-container-vocales').innerHTML = '';
    return;
  }

// Seleccionar una vocal aleatoria no mostrada
  vocalActual = vocalesDisponibles[Math.floor(Math.random() * vocalesDisponibles.length)];
  vocalesMostradas.push(vocalActual.letra);  // Marcar como mostrada
  
  // Mostrar imagen
  const imagenContainer = document.getElementById('imagen-container-vocales');
  imagenContainer.innerHTML = `<img src="${vocalActual.imagen}" alt="Vocal" />`;
  
  // Mostrar opciones
  const opcionesContainer = document.getElementById('opciones-container-vocales');
  opcionesContainer.innerHTML = '';
  
  // Seleccionar letras basadas en dificultad
  let letrasSeleccionadas = [vocalActual.letra];  // Incluir la correcta
  const letrasDisponibles = vocales.map(v => v.letra).filter(l => l !== vocalActual.letra);  // Otras letras
  
  while (letrasSeleccionadas.length < opcionesVocales && letrasDisponibles.length > 0) {
    const randomIndex = Math.floor(Math.random() * letrasDisponibles.length);
    const letraRandom = letrasDisponibles.splice(randomIndex, 1)[0];  // Remover para evitar duplicados
    letrasSeleccionadas.push(letraRandom);
  }
  
  letrasSeleccionadas.sort(() => Math.random() - 0.5);  // Mezclar
  
  // Crear botones con las letras seleccionadas
  letrasSeleccionadas.forEach(letra => {
    const vocalObj = vocales.find(v => v.letra === letra);  // Encontrar el objeto vocal
    const btn = document.createElement('button');
    btn.textContent = vocalObj.letra;
    btn.style.fontSize = '2em';
    btn.style.margin = '5px';
    btn.onclick = () => validarRespuestaVocales(vocalObj.letra);
    opcionesContainer.appendChild(btn);
  });
  
  document.getElementById('mensaje-vocales').textContent = '';
  setTimeout(() => reproducirSonidoVocal(vocalActual.letra), 500);
}

async function validarRespuestaVocales(letraSeleccionada) {
  if (juegoVocalesCompletado) return;  // No validar si terminó
  
  const esCorrecto = letraSeleccionada.toUpperCase() === vocalActual.letra.toUpperCase();
  const mensaje = document.getElementById('mensaje-vocales');
  
  if (esCorrecto) {
    puntajeVocales++;
    aciertosConsecutivosVocales++;
    document.getElementById('puntaje-vocales').textContent = puntajeVocales;
    if (aciertosConsecutivosVocales >= 5) opcionesVocales = Math.max(2, opcionesVocales);
    else if (aciertosConsecutivosVocales >= 3) opcionesVocales = 3;
    mensaje.textContent = '¡Correcto! 🎉';
    mensaje.style.color = 'green';
  } else {
    aciertosConsecutivosVocales = 0;
    opcionesVocales = 5;
    mensaje.textContent = `Incorrecto. La respuesta correcta es ${vocalActual.letra}`;
    mensaje.style.color = 'red';
  }
  
  setTimeout(nuevaRondaVocales, 2000);
}


// --- Juego 2: Identificar imágenes que empiecen por vocal ---

function iniciarJuegoImagenes() {
  puntajeImagenes = 0;
  aciertosConsecutivosImagenes = 0;
  numImagenes = 4;
  juegoImagenesCompletado = false;
  imagenesSeleccionadas = [];
  imagenesCorrectas = [];
  document.getElementById('puntaje-imagenes').textContent = puntajeImagenes;
  document.getElementById('menu').style.display = 'none';
  document.getElementById('juego-imagenes').style.display = 'block';
  const container = document.getElementById('juego-imagenes');
  if (!document.getElementById('btn-confirmar-imagenes')) {
    const btnConfirmar = document.createElement('button');
    btnConfirmar.id = 'btn-confirmar-imagenes';
    btnConfirmar.textContent = 'Confirmar Selección';
    btnConfirmar.onclick = () => confirmarSeleccionImagenes();
    container.appendChild(btnConfirmar);
  }
  
  nuevaRondaImagenes();
}

function nuevaRondaImagenes() {
  if (juegoImagenesCompletado) return;
  // Elegir una vocal aleatoria
  vocalActualJuego2 = vocales[Math.floor(Math.random() * vocales.length)].letra;
  document.getElementById('vocal-actual-imagenes').textContent = vocalActualJuego2;
  const imagenesContainer = document.getElementById('imagenes-container');
  imagenesContainer.innerHTML = '';
  imagenesSeleccionadas = [];
  imagenesCorrectas = imagenesJuego2.filter(img => img.vocal === vocalActualJuego2);

  // Mostrar imágenes mezcladas (aumentar numImagenes para más desafío)
  const opciones = [...imagenesCorrectas];  // Incluir todas las correctas
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
    imgElem.title = imgObj.palabra;
    imgElem.style.margin = '10px';
    imgElem.style.width = '120px';
    imgElem.style.height = '120px';
    imgElem.style.cursor = 'pointer';
    imgElem.style.border = '3px solid transparent';  // Inicial sin borde
    imgElem.onclick = () => toggleSeleccionImagen(imgElem, imgObj);
    imagenesContainer.appendChild(imgElem);
  });

  document.getElementById('mensaje-imagenes').textContent = `Selecciona todas las imágenes que empiecen por la vocal ${vocalActualJuego2}`;
  setTimeout(() => reproducirSonidoVocal(vocalActualJuego2), 500);
}


function toggleSeleccionImagen(imgElem, imgObj) {
  const index = imagenesSeleccionadas.findIndex(sel => sel.palabra === imgObj.palabra);
  if (index > -1) {
    // Desmarcar
    imagenesSeleccionadas.splice(index, 1);
    imgElem.style.border = '3px solid transparent';
  } else {
    // Marcar
    imagenesSeleccionadas.push(imgObj);
    imgElem.style.border = '3px solid green';
  }
}

function confirmarSeleccionImagenes() {
  if (juegoImagenesCompletado) return;
  
  const mensaje = document.getElementById('mensaje-imagenes');
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
      mensaje.textContent = '¡Juego completado! Has alcanzado 10 puntos. Puntaje final: ' + puntajeImagenes;
      mensaje.style.color = 'blue';
      document.getElementById('imagenes-container').innerHTML = '';
      document.getElementById('btn-confirmar-imagenes').style.display = 'none';
      return;
    }
  
    mensaje.textContent = '¡Correcto! Todas las imágenes seleccionadas son correctas. 🎉';
    mensaje.style.color = 'green';
  } else {
    aciertosConsecutivosImagenes = 0;
    numImagenes = 4;
    mensaje.textContent = 'Incorrecto. Revisa tu selección.';
    mensaje.style.color = 'red';
  }
  
  setTimeout(() => {
    imagenesSeleccionadas = [];
    nuevaRondaImagenes();
  }, 2000);
}


// --- juego 3: rimas y silabas ---
function iniciarJuegoMemoria() {
  puntajeMemoria = 0;
  juegoMemoriaCompletado = false;
  palabraUsadasMemoria = [];
  document.getElementById('puntaje-memoria').textContent = puntajeMemoria;
  document.getElementById('menu').style.display = 'none';
  document.getElementById('juego-memoria-fonologica').style.display = 'block';
  document.getElementById('btn-reproducir-palabra').onclick = () => {
  if (datoActualMemoria) reproducirAudioPalabra(datoActualMemoria.palabra);
  };
  
  
  nuevaRondaMemoria();
}
function nuevaRondaMemoria() {
  if (juegoMemoriaCompletado)return;
  let datosActuales = datosMemoriaSimple;
  if (nivelMemoria === 2) datosActuales = datosMemoriaMedio;
  else if (nivelMemoria === 3) datosActuales = datosMemoriaAvanzado;

  const datosDisponibles = datosActuales.filter(dato => !palabraUsadasMemoria.includes(dato.palabra));
  if (datosDisponibles.length ==0){
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
  let esCorrecto = false;
  if (datoActualMemoria.tipo === 'silabas') {
    esCorrecto = Number(respuesta) === datoActualMemoria.silabas; 
  } else {
    esCorrecto = respuesta === datoActualMemoria.rimaCorrecta;  
  }
  
  const mensaje = document.getElementById('mensaje-memoria');
  if (esCorrecto) {
    puntajeMemoria++;
    aciertosConsecutivosMemoria++;
    document.getElementById('puntaje-memoria').textContent = puntajeMemoria;
    if (aciertosConsecutivosMemoria >= 5) nivelMemoria = 3;
    else if (aciertosConsecutivosMemoria >= 3) nivelMemoria = 2;

    if (puntajeMemoria >= 10) { 
      juegoMemoriaCompletado = true;
      mensaje.textContent = '¡Juego completado! Has alcanzado 10 puntos. Puntaje final: ' + puntajeMemoria;
      mensaje.style.color = 'blue';
      document.getElementById('opciones-container-memoria').innerHTML = '';
      return;
    }
    mensaje.textContent = '¡Correcto! 🎉';
    mensaje.style.color = 'green';
  } else {
    aciertosConsecutivosMemoria = 0;
    nivelMemoria = 1;  // Reset
    mensaje.textContent = 'Incorrecto. Intenta de nuevo.';
    mensaje.style.color = 'red';
  }
  
  setTimeout(nuevaRondaMemoria, 2000);
}

// --- Juego 4: Cuentos Cortos ---
function iniciarJuegoCuentos() {
  puntajeCuentos = 0;
  preguntaActualIndex = 0;
  juegoCuentosCompletado = false;
  document.getElementById('puntaje-cuentos').textContent = puntajeCuentos;
  document.getElementById('menu').style.display = 'none';
  document.getElementById('juego-cuentos').style.display = 'block';
  
  
  nuevaRondaCuentos();
}
function nuevaRondaCuentos() {
  let cuentosActuales = cuentosSimple;
  if (nivelCuentos === 2) cuentosActuales = cuentosMedio;
  else if (nivelCuentos === 3) cuentosActuales = cuentosAvanzado;
  
  cuentoActual = cuentosActuales[Math.floor(Math.random() * cuentosActuales.length)];
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
  if (!cuentoActual || preguntaActualIndex >= cuentoActual.preguntas.length) return;  // Seguridad
  
  const pregunta = cuentoActual.preguntas[preguntaActualIndex];
  const esCorrecto = respuesta === pregunta.correcta;  // Comparación string
  
  const mensaje = document.getElementById('mensaje-cuentos');
  if (esCorrecto) {
    puntajeCuentos++;
    aciertosConsecutivosCuentos++;
    document.getElementById('puntaje-cuentos').textContent = puntajeCuentos;
    if (aciertosConsecutivosCuentos >= 4) nivelCuentos = 3;
    else if (aciertosConsecutivosCuentos >= 2) nivelCuentos = 2;
    if (puntajeCuentos >= 10) {  
      juegoCuentosCompletado = true;
      mensaje.textContent = '¡Juego completado! Has alcanzado 10 puntos. Puntaje final: ' + puntajeCuentos;
      mensaje.style.color = 'blue';
      document.getElementById('opciones-container-cuentos').innerHTML = '';
      document.getElementById('pregunta-container').innerHTML = '';
      document.getElementById('cuento-container').innerHTML = '';
      return;
    }
    mensaje.textContent = '¡Correcto! 🎉';
    mensaje.style.color = 'green';
  } else {
    aciertosConsecutivosCuentos = 0;
    nivelCuentos--; // Reset
    mensaje.textContent = `Incorrecto. La respuesta correcta es: ${pregunta.correcta}`;
    mensaje.style.color = 'red';
  }
  
  preguntaActualIndex++;
  setTimeout(mostrarPreguntaCuentos, 2000);
}


