const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  code: String,
  price: Number,
  stock: Number,
  status: { type: Boolean, default: true },
});

const ProductModel = mongoose.model('Product', productSchema);

module.exports = ProductModel;
