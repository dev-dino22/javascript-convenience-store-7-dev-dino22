import { loadProductData } from '../utils/loadProductData.js';
import PromotionManager from './PromotionManager.js';
import ProductValidator from '../utils/ProductValidator.js';

class ProductManager {
  #products;
  #promotionManager;
  #validate;
  constructor() {
    this.#products = loadProductData();
    this.#promotionManager = new PromotionManager();
    this.#validate = new ProductValidator();
  }

  checkProductStock(itemsToBuy) {
    itemsToBuy.forEach(({ name, quantity }) => {
      this.#validate.checkProductStock(this.#products, name, quantity);
    });
  }

  returnProductDetails(name) {
    const product = this.#products.find((item) => item.name === name);
    if (!product) throw new Error(`[ERROR] ${name} 상품을 찾을 수 없습니다.`);

    const { price, promotion, quantity } = product;
    let availablePromotionalStock = 0;
    if (promotion) {
      availablePromotionalStock = quantity;
    }

    return { price, availablePromotionalStock, promotion };
  }

  deductStock(name, quantity) {
    const promotionalStock = this.#products.find(
      (product) => product.name === name && product.promotion !== null,
    );
    const availablePromotionalStock = promotionalStock?.quantity || 0;

    const adjustedQuantity = promotionalStock
      ? this.#promotionManager.applyPromotion(
          promotionalStock.promotion,
          quantity,
          availablePromotionalStock,
        )
      : quantity;

    let remainingQuantity = adjustedQuantity;

    // 프로모션 재고 차감
    if (promotionalStock) {
      const deductAmount = Math.min(
        promotionalStock.quantity,
        remainingQuantity,
      );
      promotionalStock.quantity -= deductAmount;
      remainingQuantity -= deductAmount;
      this.#validate.validatePromotionStock(
        promotionalStock.quantity,
        deductAmount,
      );
    }

    // 일반 재고 차감
    const regularStock = this.#products.find(
      (product) => product.name === name && product.promotion === null,
    );
    if (remainingQuantity > 0 && regularStock) {
      regularStock.quantity -= remainingQuantity;
    }
  }

  // 상품 정보를 문자열로 가공하여 반환
  formatProductsInfo() {
    const productInfoLines = this.#products.map((product) => {
      const quantityText = this.formatQuantity(product.quantity);
      const promotionText = this.formatPromotion(product.promotion);
      return `- ${product.name} ${product.price}원 ${quantityText} ${promotionText}`.trim();
    });

    const formattedInfo = productInfoLines.join('\n');
    return formattedInfo;
  }

  formatQuantity(quantity) {
    if (quantity > 0) {
      return `${quantity}개`;
    }
    return '재고 없음';
  }

  formatPromotion(promotion) {
    if (promotion) {
      return promotion;
    }
    return '';
  }
}

export default ProductManager;
