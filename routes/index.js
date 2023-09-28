const express = require('express');
const router = express.Router();

const productRoutes = require('..routes/productRoutes');
router.use('/api/products', productRoutes); 

module.exports = router;
