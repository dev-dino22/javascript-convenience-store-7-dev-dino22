import MESSAGES from '../constants/Message.js';

class ProductValidator {
  checkProductStock(products, name, quantity) {
    const promotionalStock = products.find(
      (product) => product.name === name && product.promotion !== null,
    );
    const regularStock = products.find(
      (product) => product.name === name && product.promotion === null,
    );
    const totalStock =
      (promotionalStock?.quantity || 0) + (regularStock?.quantity || 0);
    if (totalStock < quantity) {
      throw new Error(MESSAGES.ERROR.INSUFFICIENT_STOCK);
    }
  }

  validatePromotionStock(promotionStock, adjustedQuantity) {
    if (promotionStock < adjustedQuantity) {
      throw new Error(MESSAGES.ERROR.INSUFFICIENT_PROMOTION_STOCK);
    }
  }
}

export default ProductValidator;
