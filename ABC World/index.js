import express from 'express'

const app = express();
const port = 3000;

// Datos básicos: vocales con imágenes
const vocales = [
  { letra: 'A', imagen: '/images/a.png' },
  { letra: 'E', imagen: '/images/e.png' },
  { letra: 'I', imagen: '/images/i.png' },
  { letra: 'O', imagen: '/images/o.png' },
  { letra: 'U', imagen: '/images/u.png' },
];

// Middleware para parsear JSON
app.use(express.json());

// Servir archivos estáticos (HTML, JS, imágenes)
app.use(express.static('public'));

// Endpoint para obtener las vocales
app.get('/api/vocales', (req, res) => {
  res.json(vocales);
});

// Endpoint para validar respuesta
app.post('/api/validar', (req, res) => {
  const { letraSeleccionada, letraCorrecta } = req.body;

  if (!letraSeleccionada || !letraCorrecta) {
    return res.status(400).json({ error: 'Faltan datos' });
  }

  const esCorrecto = letraSeleccionada.toUpperCase() === letraCorrecta.toUpperCase();

  res.json({ correcto: esCorrecto });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
