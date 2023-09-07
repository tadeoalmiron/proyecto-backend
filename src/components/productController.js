const ProductModel = require('../components/ProductModel');

// Controlador para listar todos los productos
const listProducts = async (req, res) => {
  try {
    const products = await ProductModel.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los productos' });
  }
};

// Controlador para obtener un producto por su id
const getProductById = async (req, res) => {
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
};

// Controlador para actualizar un producto por su id
const updateProductById = async (req, res) => {
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
};

// Controlador para eliminar un producto por su id
const deleteProductById = async (req, res) => {
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
};

// Controlador para agregar un nuevo producto
const addProduct = async (req, res) => {
  const product = req.body;
  try {
    const newProduct = await ProductModel.create(product);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar el producto' });
  }
};

module.exports = {
  listProducts,
  getProductById,
  updateProductById,
  deleteProductById,
  addProduct,
};
