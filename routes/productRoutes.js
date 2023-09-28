const express = require('express');
const router = express.Router();
const productController = require('../components/productController'); // Ajusta la ruta de importación según la ubicación de productController


router.get('/', productController.getAllProducts);
router.get('/:pid', productController.getProductById);
router.post('/', productController.createProduct);
router.put('/:pid', productController.updateProduct);
router.delete('/:pid', productController.deleteProduct);

module.exports = router;
