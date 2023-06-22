const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const app = express();
const PORT = 8080;

const ProductManager = require('./ProductManager');
const productManager = new ProductManager('productos.json');

app.use(bodyParser.json());
app.use(express.json());

// Configuración de Handlebars
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Ruta raíz para listar todos los productos
app.get('/api/products', (req, res) => {
  const products = productManager.getProducts();
  res.json(products);
});

// Ruta para obtener un producto por su id
app.get('/api/products/:pid', (req, res) => {
  const productId = parseInt(req.params.pid);
  const product = productManager.getProductById(productId);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Producto no encontrado' });
  }
});

// Ruta para actualizar un producto por su id
app.put('/api/products/:pid', (req, res) => {
  const productId = parseInt(req.params.pid);
  const updatedProduct = req.body;
  const product = productManager.updateProduct(productId, updatedProduct);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Producto no encontrado' });
  }
});

// Ruta para eliminar un producto por su id
app.delete('/api/products/:pid', (req, res) => {
  const productId = parseInt(req.params.pid);
  const product = productManager.deleteProduct(productId);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Producto no encontrado' });
  }
});

// Ruta raíz para agregar un nuevo producto
app.post('/api/products', (req, res) => {
  const product = req.body;
  // Generar un ID autogenerado para el nuevo producto
  const newProductId = Date.now().toString();
  // Asignar el ID al producto
  product.id = newProductId;
  // Establecer el estado por defecto como true si no se proporciona
  product.status = product.status !== undefined ? product.status : true;
  // Agregar el producto al gestor de productos
  productManager.addProduct(product);
  res.status(201).json(product);
});

// Configurar el evento de conexión del socket
io.on('connection', (socket) => {
  console.log('Un cliente se ha conectado');

});

// Iniciar el servidor
http.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
