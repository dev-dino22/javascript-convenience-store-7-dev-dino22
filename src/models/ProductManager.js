import { loadProductData } from '../utils/loadProductData.js';

class ProductManager {
  #products;

  constructor() {
    this.#products = loadProductData();
  }

  checkProductStock(name, quantity) {
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

  deductStock(name, quantity) {
    if (!this.checkProductStock(name, quantity)) {
      throw new Error('[ERROR]');
    }

    let remainingQuantity = quantity;

    const promotionalStock = this.#products.find(
      (product) => product.name === name && product.promotion !== null,
    );
    if (promotionalStock) {
      const deductAmount = Math.min(
        promotionalStock.quantity,
        remainingQuantity,
      );
      promotionalStock.quantity -= deductAmount;
      remainingQuantity -= deductAmount;
    }

    const regularStock = this.#products.find(
      (product) => product.name === name && product.promotion === null,
    );
    if (remainingQuantity > 0 && regularStock) {
      regularStock.quantity -= remainingQuantity;
    }
  }
}

export default ProductManager;
