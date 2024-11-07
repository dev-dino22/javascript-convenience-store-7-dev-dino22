import { loadProductData } from '../utils/loadProductData.js';

class ProductManager {
  #products;

  constructor() {
    this.#products = loadProductData();
  }

  checkProductstock(name, quantity) {
    const promotionalStock = this.#products.find(
      (product) => product.name === name && product.promotion !== null,
    );
    const regularStock = this.#products.find(
      (product) => product.name === name && product.promotion === null,
    );
    const totalStock =
      (promotionalStock?.quantity || 0) + (regularStock?.quantity || 0);

    return totalStock >= quantity;
  }
}

export default ProductManager;
