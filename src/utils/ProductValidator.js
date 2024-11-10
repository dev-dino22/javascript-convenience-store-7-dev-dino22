import MESSAGES from '../constants/Message.js';

class ProductValidator {
  checkProductStock(products, name, quantity) {
    const promotionalStock = products.find(
      (product) => product.name === name && product.promotion !== null,
    );
    const regularStock = products.find(
      (product) => product.name === name && product.promotion === null,
    );

    const availablePromotionalStock = promotionalStock?.quantity || 0;
    const availableRegularStock = regularStock?.quantity || 0;

    if (availablePromotionalStock + availableRegularStock < quantity) {
      throw new Error(MESSAGES.ERROR.INSUFFICIENT_STOCK);
    }
  }

  isPromotionStockSufficient(promotionStock, requiredQuantity) {
    return promotionStock >= requiredQuantity;
  }
}

export default ProductValidator;
