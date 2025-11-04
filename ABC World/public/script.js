import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, doc, setDoc, getDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js'; // Importar getDoc
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

let userId = null; // ID del dispositivo (tablet)
let usuarioActualId = null; // NUEVO: ID del niño (ej: "sol", "luna")

async function inicializarAuth() {
  try {
    await signInAnonymously(auth);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        userId = user.uid;  // ID único para el dispositivo
        console.log('Dispositivo autenticado:', userId);
      }
    });
  } catch (error) {
    console.error('Error en autenticación:', error);
  }
}

// --- NUEVA LÓGICA DE PUNTAJES ---

async function guardarPuntaje(juego, puntaje) {
  // No guardar si no hay dispositivo o no se ha seleccionado un niño
  if (!userId || !usuarioActualId) return; 
  
  try {
    // Crear un ID de documento único para ESE niño en ESE dispositivo
    const userDocId = `${userId}_${usuarioActualId}`;
    const docRef = doc(db, 'puntajes', userDocId);

    // Obtener puntajes actuales para verificar si es un nuevo récord
    const docSnap = await getDoc(docRef);
    let currentHighScore = 0;
    if (docSnap.exists()) {
        currentHighScore = docSnap.data()[juego] || 0; // Obtiene el puntaje de ESE juego
    }

    // Solo guardar si el nuevo puntaje es MÁS ALTO
    if (puntaje > currentHighScore) {
      await setDoc(docRef, {
        [juego]: puntaje, // Guarda el puntaje para ESE juego (ej: { vocales: 10 })
        avatar: usuarioActualId, // Guarda qué avatar era
        fecha: new Date().toISOString()
      }, { merge: true }); // merge para actualizar/añadir solo este juego sin borrar los otros
      console.log(`Nuevo récord guardado para ${userDocId} en ${juego}:`, puntaje);
    } else {
      console.log('Puntaje no superado, no se guarda.');
    }
  } catch (error) {
    console.error('Error al guardar puntaje:', error);
  }
}

async function cargarPuntajeMaximo(juego) {
  if (!userId || !usuarioActualId) return 0;
  try {
    const userDocId = `${userId}_${usuarioActualId}`;
    const docRef = doc(db, 'puntajes', userDocId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      // Devuelve el puntaje MÁXIMO para ESE JUEGO específico
      return docSnap.data()[juego] || 0;
    }
    return 0; // No hay puntaje para ese juego
  } catch (error) {
    console.error('Error al cargar puntaje:', error);
    return 0;
  }
}

// (Función TTS - sin cambios)
function reproducirTTS(texto, velocidad = 0.8, vozSeleccionada = null) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = 'es-MX';
    utterance.rate = velocidad;
    utterance.pitch = 1;
    
    if (vozSeleccionada) {
      utterance.voice = vozSeleccionada;
    } else {
      const voces = speechSynthesis.getVoices();
      const vozEspanol = voces.find(voice => voice.lang.startsWith('es'));
      if (vozEspanol) utterance.voice = vozEspanol;
    }
    
    speechSynthesis.speak(utterance);
  } else {
    console.log('TTS no soportado en este navegador');
  }
}


// (Datos de los juegos - sin cambios)
const vocales = [
  { letra: 'A', imagen: 'images/a.png' }, { letra: 'E', imagen: 'images/e.png' },
  { letra: 'I', imagen: 'images/i.png' }, { letra: 'O', imagen: 'images/o.png' },
  { letra: 'U', imagen: 'images/u.png' },
];
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
  { palabra: 'Casa', imagen: 'images/imagenesJuego2/casa.png', vocal: 'A' },
  { palabra: 'Perro', imagen: 'images/imagenesJuego2/perro.png', vocal: 'E' },
];
const datosMemoriaSimple = [
  { tipo: 'silabas', palabra: 'Casa', silabas: 2 }, { tipo: 'silabas', palabra: 'Sol', silabas: 1},
  { tipo: 'silabas', palabra: 'Zapato', silabas: 3}, { tipo: 'silabas', palabra: 'Pez', silabas: 1 },
  { tipo: 'silabas', palabra: 'Perro', silabas: 2 }, { tipo: 'silabas', palabra: 'Gato', silabas: 2 },
  { tipo: 'silabas', palabra: 'Pan', silabas: 1 }, { tipo: 'silabas', palabra: 'Pato', silabas: 2 },
  { tipo: 'silabas', palabra: 'Luna', silabas: 2 }, { tipo: 'silabas', palabra: 'Mesa', silabas: 2 },
  { tipo: 'silabas', palabra: 'Ojo', silabas: 2 }, { tipo: 'silabas', palabra: 'Tren', silabas: 1 },
  { tipo: 'silabas', palabra: 'Flor', silabas: 1 }, { tipo: 'silabas', palabra: 'Agua', silabas: 2 },
  { tipo: 'silabas', palabra: 'Lápiz', silabas: 2 }
];
const datosMemoriaMedio = [
    { tipo: 'silabas', palabra: 'Elefante', silabas: 4 }, { tipo: 'silabas', palabra: 'Pelota', silabas: 3 },
    { tipo: 'silabas', palabra: 'Mariposa', silabas: 4 }, { tipo: 'silabas', palabra: 'Tomate', silabas: 3 },
    { tipo: 'silabas', palabra: 'Dinosaurio', silabas: 5 }, { tipo: 'silabas', palabra: 'Caballo', silabas: 3 },
    { tipo: 'silabas', palabra: 'Bicicleta', silabas: 5 }, { tipo: 'silabas', palabra: 'Cuchara', silabas: 3 },
    { tipo: 'silabas', palabra: 'Chocolate', silabas: 4 }, { tipo: 'silabas', palabra: 'Manzana', silabas: 3 },
    { tipo: 'silabas', palabra: 'Mantequilla', silabas: 4 }, { tipo: 'silabas', palabra: 'Matemáticas', silabas: 5 }
];
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
  }
];


// (Variables de estado de los juegos - sin cambios)
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

// (Funciones de reproducir audio - sin cambios)
function reproducirAudioPalabra(palabra) {
  reproducirTTS(palabra, 0.6);
}
function reproducirAudioCuento(textoCuento) {
  reproducirTTS(textoCuento, 0.7);
}
function reproducirAudioPregunta(textoPregunta) {
  reproducirTTS(textoPregunta, 0.7);
}


// --- LÓGICA DE NAVEGACIÓN ACTUALIZADA ---

window.onload = () => {
  inicializarAuth();

  // Configurar los clics de los avatares
  configurarSeleccionUsuario();

  // Configurar botones de menú (juegos)
  document.getElementById('btn-vocales').onclick = () => iniciarJuegoVocales();
  document.getElementById('btn-imagenes').onclick = () => iniciarJuegoImagenes();
  document.getElementById('btn-memoria-fonologica').onclick = () => iniciarJuegoMemoria();
  document.getElementById('btn-cuentos').onclick = () => iniciarJuegoCuentos(); 
  
  // Configurar botones "Volver" (guardan puntaje)
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
  
  // NUEVO: Configurar botón "Cambiar de Usuario"
  document.getElementById('btn-cambiar-usuario').onclick = mostrarPantallaSeleccion;
  
  // Empezar en la pantalla de selección
  mostrarPantallaSeleccion();
};

// NUEVO: Asigna los eventos de clic a los avatares
function configurarSeleccionUsuario() {
  document.querySelectorAll('.avatar-emoji').forEach(avatar => {
    avatar.onclick = () => {
      const id = avatar.dataset.id;
      const emoji = avatar.textContent;
      seleccionarUsuario(id, emoji);
    };
  });
}

// NUEVO: Se llama al hacer clic en un avatar
function seleccionarUsuario(id, emoji) {
  usuarioActualId = id; // Establece el usuario actual
  document.getElementById('saludo-usuario').innerHTML = `¡Hola, ${emoji}!`; // Pone el saludo
  mostrarMenu(); // Muestra el menú principal
}

// NUEVO: Muestra la pantalla de selección y oculta todo lo demás
function mostrarPantallaSeleccion() {
  usuarioActualId = null; // Resetea el usuario
  document.getElementById('pantalla-seleccion-usuario').style.display = 'flex';
  document.getElementById('menu').style.display = 'none';
  document.getElementById('juego-vocales').style.display = 'none';
  document.getElementById('juego-imagenes').style.display = 'none';
  document.getElementById('juego-memoria-fonologica').style.display = 'none';
  document.getElementById('juego-cuentos').style.display = 'none';
}

// ACTUALIZADO: Mostrar solo el menú y ocultar juegos y selección de usuario
function mostrarMenu() {
  document.getElementById('pantalla-seleccion-usuario').style.display = 'none';
  document.getElementById('menu').style.display = 'flex'; // Usar flex como en el CSS
  document.getElementById('juego-vocales').style.display = 'none';
  document.getElementById('juego-imagenes').style.display = 'none';
  document.getElementById('juego-memoria-fonologica').style.display = 'none';
  document.getElementById('juego-cuentos').style.display = 'none';
}

// --- Juego 1: Aprender las vocales (Actualizado para cargar puntaje) ---

async function iniciarJuegoVocales() {
  // Carga el puntaje máximo para el 'usuarioActualId'
  const highScore = await cargarPuntajeMaximo('vocales');
  puntajeVocales = 0;
  // Muestra el puntaje actual (0) y el mejor puntaje (highScore)
  document.getElementById('puntaje-vocales').textContent = `0 (Mejor: ${highScore})`;
  
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

  let letrasSeleccionadas = [vocalActual.letra];
  const letrasDisponibles = vocales.map(v => v.letra).filter(l => l !== vocalActual.letra);
  while (letrasSeleccionadas.length < opcionesVocales && letrasDisponibles.length > 0) {
    const randomIndex = Math.floor(Math.random() * letrasDisponibles.length);
    const letraRandom = letrasDisponibles.splice(randomIndex, 1)[0];
    letrasSeleccionadas.push(letraRandom);
  }

   letrasSeleccionadas.sort(() => Math.random() - 0.5);

  letrasSeleccionadas.forEach(letra => {
    const vocalObj = vocales.find(v => v.letra === letra);
    const btn = document.createElement('button');
    btn.textContent = vocalObj.letra;
    // btn.style.fontSize = '2em'; (Quitado para usar el de CSS)
    // btn.style.margin = '5px'; (Quitado para usar el de CSS)
    btn.onclick = () => validarRespuestaVocales(vocalObj.letra);
    opcionesContainer.appendChild(btn);
  });
  document.getElementById('mensaje-vocales').textContent = '';
  // (La función reproducirSonidoVocal no estaba definida, la comento)
  // setTimeout(() => reproducirSonidoVocal(vocalActual.letra), 500);
  // Si quieres que diga la letra, puedes usar:
  setTimeout(() => reproducirTTS(vocalActual.letra, 0.8), 500);

}

async function validarRespuestaVocales(letraSeleccionada) {
  const esCorrecto = letraSeleccionada.toUpperCase() === vocalActual.letra.toUpperCase();
  const mensaje = document.getElementById('mensaje-vocales');
  
  if (esCorrecto) {
    puntajeVocales++;
    aciertosConsecutivosVocales++;
    
    // Cargar el puntaje máximo actual para mostrarlo actualizado
    const highScore = await cargarPuntajeMaximo('vocales');
    document.getElementById('puntaje-vocales').textContent = `${puntajeVocales} (Mejor: ${Math.max(highScore, puntajeVocales)})`;

    if (aciertosConsecutivosVocales >= 5) opcionesVocales = Math.max(2, opcionesVocales);
    else if (aciertosConsecutivosVocales >= 3) opcionesVocales = 3;
    mensaje.textContent = '¡Correcto! 🎉';
    mensaje.className = 'correcto'; // Usar clases de CSS
  } else {
    aciertosConsecutivosVocales = 0;
    opcionesVocales = 5;
    mensaje.textContent = `Incorrecto. La respuesta correcta es ${vocalActual.letra}`;
    mensaje.className = 'incorrecto'; // Usar clases de CSS
  }
  setTimeout(nuevaRondaVocales, 2000);
}

// --- Juego 2: Identificar imágenes (Actualizado para cargar puntaje) ---

async function iniciarJuegoImagenes() {
  const highScore = await cargarPuntajeMaximo('imagenes');
  puntajeImagenes = 0;
  document.getElementById('puntaje-imagenes').textContent = `0 (Mejor: ${highScore})`;
  document.getElementById('menu').style.display = 'none';
  document.getElementById('juego-imagenes').style.display = 'block';
  nuevaRondaImagenes();
}

function nuevaRondaImagenes() {
  vocalActualJuego2 = vocales[Math.floor(Math.random() * vocales.length)].letra;
  document.getElementById('vocal-actual-imagenes').textContent = vocalActualJuego2;
  setTimeout(() => reproducirTTS(`Encuentra la imagen que empieza con ${vocalActualJuego2}`, 0.8), 500);


  const imagenesContainer = document.getElementById('imagenes-container');
  imagenesContainer.innerHTML = '';

  const opciones = [];
  const imagenesCorrectas = imagenesJuego2.filter(img => img.vocal === vocalActualJuego2);
  if (imagenesCorrectas.length > 0) {
    opciones.push(imagenesCorrectas[Math.floor(Math.random() * imagenesCorrectas.length)]);
  }

  while (opciones.length < numImagenes) {
    const imgRandom = imagenesJuego2[Math.floor(Math.random() * imagenesJuego2.length)];
    if (!opciones.includes(imgRandom)) {
      opciones.push(imgRandom);
    }
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
    imgElem.onclick = () => validarRespuestaImagenes(imgObj);
    imagenesContainer.appendChild(imgElem);
  });

  document.getElementById('mensaje-imagenes').textContent = '';
  document.getElementById('mensaje-imagenes').className = '';
}

async function validarRespuestaImagenes(imagenSeleccionada) {
  const mensaje = document.getElementById('mensaje-imagenes');
  
  if (imagenSeleccionada.vocal === vocalActualJuego2) {
    puntajeImagenes++;
    aciertosConsecutivosImagenes++;
    
    const highScore = await cargarPuntajeMaximo('imagenes');
    document.getElementById('puntaje-imagenes').textContent = `${puntajeImagenes} (Mejor: ${Math.max(highScore, puntajeImagenes)})`;

    if (aciertosConsecutivosImagenes >= 5) numImagenes = 8;
    else if (aciertosConsecutivosImagenes >= 3) numImagenes = 6;
    
    mensaje.textContent = '¡Correcto! 🎉';
    mensaje.className = 'correcto';
  } else {
    aciertosConsecutivosImagenes = 0;
    numImagenes = 4;
    mensaje.textContent = `Incorrecto. "${imagenSeleccionada.palabra}" no empieza por ${vocalActualJuego2}`;
    mensaje.className = 'incorrecto';
  }

  setTimeout(nuevaRondaImagenes, 2000);
}


// --- Juego 3: Memoria Fonológica (Actualizado para cargar puntaje) ---
async function iniciarJuegoMemoria() {
  const highScore = await cargarPuntajeMaximo('memoria');
  puntajeMemoria = 0;
  document.getElementById('puntaje-memoria').textContent = `0 (Mejor: ${highScore})`;
  document.getElementById('menu').style.display = 'none';
  document.getElementById('juego-memoria-fonologica').style.display = 'block';
  
  
  nuevaRondaMemoria();
}
function nuevaRondaMemoria() {
  let datosActuales = datosMemoriaSimple;
  if (nivelMemoria === 2) datosActuales = datosMemoriaMedio;
  else if (nivelMemoria === 3) datosActuales = datosMemoriaAvanzado;
  
  datoActualMemoria = datosActuales[Math.floor(Math.random() * datosActuales.length)];
  
  const instruccion = document.getElementById('instruccion-memoria');
  const opcionesContainer = document.getElementById('opciones-container-memoria');
  opcionesContainer.innerHTML = '';
  
  if (datoActualMemoria.tipo === 'silabas') {
    instruccion.textContent = '¿Cuántas sílabas tiene...?';
    // Opciones de sílabas (asegurémonos de incluir la correcta)
    let opcSilabas = [datoActualMemoria.silabas];
    while(opcSilabas.length < 4) {
        let numRnd = Math.floor(Math.random() * 5) + 1;
        if (!opcSilabas.includes(numRnd)) opcSilabas.push(numRnd);
    }
    opcSilabas.sort((a, b) => a - b);
    
    opcSilabas.forEach(num => {
      const btn = document.createElement('button');
      btn.textContent = num;
      btn.onclick = () => validarRespuestaMemoria(num);
      opcionesContainer.appendChild(btn);
    });
  } else {
    instruccion.textContent = '¿Qué palabra rima con...?';
    datoActualMemoria.opciones.forEach(opcion => {
      const btn = document.createElement('button');
      btn.textContent = opcion;
      btn.onclick = () => validarRespuestaMemoria(opcion);
      opcionesContainer.appendChild(btn);
    });
 }
  document.getElementById('mensaje-memoria').textContent = '';
  document.getElementById('mensaje-memoria').className = '';
  setTimeout(() => reproducirAudioPalabra(datoActualMemoria.palabra), 500);
}


async function validarRespuestaMemoria(respuesta) {
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
    
    const highScore = await cargarPuntajeMaximo('memoria');
    document.getElementById('puntaje-memoria').textContent = `${puntajeMemoria} (Mejor: ${Math.max(highScore, puntajeMemoria)})`;
    
    if (aciertosConsecutivosMemoria >= 5) nivelMemoria = 3;
    else if (aciertosConsecutivosMemoria >= 3) nivelMemoria = 2;
    mensaje.textContent = '¡Correcto! 🎉';
    mensaje.className = 'correcto'; // Corrección de bug: 'S' eliminada
  } else {
    aciertosConsecutivosMemoria = 0;
    nivelMemoria = 1;  // Reset
    mensaje.textContent = 'Incorrecto. Intenta de nuevo.';
    mensaje.className = 'incorrecto';
  }
  
  setTimeout(nuevaRondaMemoria, 2000);
}

// --- Juego 4: Cuentos Cortos (Actualizado para cargar puntaje) ---
async function iniciarJuegoCuentos() {
  const highScore = await cargarPuntajeMaximo('cuentos');
  puntajeCuentos = 0;
  preguntaActualIndex = 0;
  aciertosConsecutivosCuentos = 0; // Resetear aciertos
  nivelCuentos = 1; // Resetear nivel
  document.getElementById('puntaje-cuentos').textContent = `0 (Mejor: ${highScore})`;
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
    document.getElementById('mensaje-cuentos').textContent = '¡Cuento completado!';
    document.getElementById('mensaje-cuentos').className = 'correcto';
    // Cargar siguiente cuento
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
  document.getElementById('mensaje-cuentos').className = '';
  setTimeout(() => reproducirAudioPregunta(pregunta.pregunta), 500);
}

async function validarRespuestaCuentos(respuesta) {
  if (!cuentoActual || preguntaActualIndex >= cuentoActual.preguntas.length) return;
  
  const pregunta = cuentoActual.preguntas[preguntaActualIndex];
  const esCorrecto = respuesta === pregunta.correcta;
  
  const mensaje = document.getElementById('mensaje-cuentos');
  if (esCorrecto) {
    puntajeCuentos++;
    aciertosConsecutivosCuentos++;
    
    const highScore = await cargarPuntajeMaximo('cuentos');
    document.getElementById('puntaje-cuentos').textContent = `${puntajeCuentos} (Mejor: ${Math.max(highScore, puntajeCuentos)})`;
    
    if (aciertosConsecutivosCuentos >= 4) nivelCuentos = 3;
    else if (aciertosConsecutivosCuentos >= 2) nivelCuentos = 2;
    mensaje.textContent = '¡Correcto! 🎉';
    mensaje.className = 'correcto';
  } else {
    aciertosConsecutivosCuentos = 0;
    nivelCuentos = 1; // Corrección: Resetear a 1, no decrementar
    mensaje.textContent = `Incorrecto. La respuesta correcta es: ${pregunta.correcta}`;
    mensaje.className = 'incorrecto';
  }
  
  preguntaActualIndex++;
  setTimeout(mostrarPreguntaCuentos, 2000);
}