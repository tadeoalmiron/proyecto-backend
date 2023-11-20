const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose'); 
const customLogger = require('./utils/loggerWinston'); 

const app = express();
const PORT = 8080;

const dbUrl = 'mongodb+srv://<tadeoalmiron95>:<pochoclo74>@<proyectobackend.rllilts.mongodb.net>';

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    customLogger.info('Conexión a MongoDB Atlas establecida'); // Utilizar el logger para registrar un mensaje de nivel info
    // Iniciar el servidor
    http.listen(PORT, () => {
      customLogger.info(`Servidor escuchando en el puerto ${PORT}`); // Registrar un mensaje de nivel info
    });
  })
  .catch((error) => {
    customLogger.error('Error al conectar a MongoDB Atlas:', error); // Registrar un mensaje de nivel error
  });

// Importar el modelo de producto
const ProductModel = require('./components/productModel');

app.use(bodyParser.json());
app.use(express.json());

// Configuración de Handlebars
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Ruta para acceder a la documentación de Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Ruta raíz para listar todos los productos
app.get('/api/products', async (req, res) => {
  try {
    const products = await ProductModel.find();
    res.json(products);
  } catch (error) {
    customLogger.error('Error al obtener los productos:', error); // Registrar un mensaje de nivel error
    res.status(500).json({ message: 'Error al obtener los productos' });
  }
});

// Ruta para obtener un producto por su id
app.get('/api/products/:pid', async (req, res) => {
  const productId = req.params.pid;
  try {
    const product = await ProductModel.findById(productId);
    if (product) {
      customLogger.info(`Producto con ID ${productId} encontrado`); // Registrar un mensaje de nivel info
      res.json(product);
    } else {
      customLogger.warn(`Producto con ID ${productId} no encontrado`); // Registrar un mensaje de nivel warning
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (error) {
    customLogger.error('Error al obtener el producto:', error); // Registrar un mensaje de nivel error
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
      customLogger.info(`Producto con ID ${productId} actualizado`); // Registrar un mensaje de nivel info
      res.json(product);
    } else {
      customLogger.warn(`Producto con ID ${productId} no encontrado para actualizar`); // Registrar un mensaje de nivel warning
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (error) {
    customLogger.error(`Error al actualizar el producto con ID ${productId}:`, error); // Registrar un mensaje de nivel error
    res.status(500).json({ message: 'Error al actualizar el producto' });
  }
});

// Ruta para eliminar un producto por su id
app.delete('/api/products/:pid', async (req, res) => {
  const productId = req.params.pid;
  try {
    const product = await ProductModel.findByIdAndRemove(productId);
    if (product) {
      customLogger.info(`Producto con ID ${productId} eliminado`); // Registrar un mensaje de nivel info
      res.json(product);
    } else {
      customLogger.warn(`Producto con ID ${productId} no encontrado para eliminar`); // Registrar un mensaje de nivel warning
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (error) {
    customLogger.error(`Error al eliminar el producto con ID ${productId}:`, error); // Registrar un mensaje de nivel error
    res.status(500).json({ message: 'Error al eliminar el producto' });
  }
});

// Ruta raíz para agregar un nuevo producto
app.post('/api/products', async (req, res) => {
  const product = req.body;
  try {
    const newProduct = await ProductModel.create(product);
    customLogger.info('Nuevo producto agregado'); // Registrar un mensaje de nivel info
    res.status(201).json(newProduct);
  } catch (error) {
    customLogger.error('Error al agregar el producto:', error); // Registrar un mensaje de nivel error
    res.status(500).json({ message: 'Error al agregar el producto' });
  }
});

// Configurar el evento de conexión del socket
io.on('connection', (socket) => {
  customLogger.info('Un cliente se ha conectado'); // Registrar un mensaje de nivel info
});

// Iniciar el servidor
http.listen(PORT, () => {
  customLogger.info(`Servidor escuchando en el puerto ${PORT}`); // Registrar un mensaje de nivel info
});
