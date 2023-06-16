const fs = require('fs');

class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = this.loadProducts();
  }

  loadProducts() {
    try {
      const productsData = fs.readFileSync(this.path, 'utf-8');
      return JSON.parse(productsData);
    } catch (error) {
      return [];
    }
  }

  saveProducts() {
    fs.writeFileSync(this.path, JSON.stringify(this.products));
  }

  getProducts() {
    return this.products;
  }

  addProduct(product) {
    const newProduct = {
      id: this.products.length + 1,
      ...product,
    };
    this.products.push(newProduct);
    this.saveProducts();
    return newProduct;
  }

  updateProduct(id, updatedProduct) {
    const index = this.products.findIndex((product) => product.id === id);
    if (index !== -1) {
      this.products[index] = {
        ...this.products[index],
        ...updatedProduct,
      };
      this.saveProducts();
      return this.products[index];
    }
    return null;
  }

  deleteProduct(id) {
    const index = this.products.findIndex((product) => product.id === id);
    if (index !== -1) {
      const deletedProduct = this.products.splice(index, 1);
      this.saveProducts();
      return deletedProduct[0];
    }
    return null;
  }

  getProductById(id) {
    return this.products.find((product) => product.id === id) || null;
  }
}

module.exports = ProductManager;
