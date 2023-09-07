const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose'); // Importar Mongoose

const app = express();
const PORT = 8080;

const dbUrl = 'mongodb+srv://<tadeoalmiron95>:<pochoclo74>@<proyectobackend.rllilts.mongodb.net>';

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Conexión a MongoDB Atlas establecida');
    // Iniciar el servidor
    http.listen(PORT, () => {
      console.log(`Servidor escuchando en el puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error al conectar a MongoDB Atlas:', error);
  });

// Importar el modelo de producto
const ProductModel = require('./components/productModel');

app.use(bodyParser.json());
app.use(express.json());

// Configuración de Handlebars
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Ruta raíz para listar todos los productos
app.get('/api/products', async (req, res) => {
  try {
    const products = await ProductModel.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los productos' });
  }
});

// Ruta para obtener un producto por su id
app.get('/api/products/:pid', async (req, res) => {
  const productId = req.params.pid;
  try {
    const product = await ProductModel.findById(productId);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el producto' });
  }
});

// Ruta para actualizar un producto por su id
app.put('/api/products/:pid', async (req, res) => {
  const productId = req.params.pid;
  const updatedProduct = req.body;
  try {
    const product = await ProductModel.findByIdAndUpdate(productId, updatedProduct, { new: true });
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el producto' });
  }
});

// Ruta para eliminar un producto por su id
app.delete('/api/products/:pid', async (req, res) => {
  const productId = req.params.pid;
  try {
    const product = await ProductModel.findByIdAndRemove(productId);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el producto' });
  }
});

// Ruta raíz para agregar un nuevo producto
app.post('/api/products', async (req, res) => {
  const product = req.body;
  try {
    const newProduct = await ProductModel.create(product);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar el producto' });
  }
});

// Configurar el evento de conexión del socket
io.on('connection', (socket) => {
  console.log('Un cliente se ha conectado');
});

// Iniciar el servidor
http.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
