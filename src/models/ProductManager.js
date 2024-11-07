import { loadProductData } from '../utils/loadProductData.js';

class ProductManager {
  #products = loadProductData();

  constructor() {
    this.#products = loadProductData();
  }
}

export default ProductManager;
