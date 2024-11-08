import { loadProductData } from '../utils/loadProductData.js';
import PromotionManager from './PromotionManager.js';

class ProductManager {
  #products;
  #promotionManager;

  constructor() {
    this.#products = loadProductData();
    this.#promotionManager = new PromotionManager();
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
      throw new Error('[ERROR] 재고가 부족합니다.');
    }

    const promotionalStock = this.#products.find(
      (product) => product.name === name && product.promotion !== null,
    );
    const availablePromotionalStock = promotionalStock?.quantity || 0;

    // 프로모션에 따라 조정된 수량을 가져옴
    const adjustedQuantity = this.#promotionManager.applyPromotion(
      name,
      quantity,
      availablePromotionalStock,
    );

    let remainingQuantity = adjustedQuantity;

    // 프로모션 재고에서 차감
    if (promotionalStock) {
      const deductAmount = Math.min(
        promotionalStock.quantity,
        remainingQuantity,
      );
      promotionalStock.quantity -= deductAmount;
      remainingQuantity -= deductAmount;
    }

    // 일반 재고에서 차감
    const regularStock = this.#products.find(
      (product) => product.name === name && product.promotion === null,
    );
    if (remainingQuantity > 0 && regularStock) {
      regularStock.quantity -= remainingQuantity;
    }
  }
}

export default ProductManager;
