import PromotionManager from './PromotionManager.js';

class Cart {
  #items;
  #promotionManager;
  #totalDiscountAmount;

  constructor() {
    this.#items = [];
    this.#promotionManager = new PromotionManager();
    this.#totalDiscountAmount = 0;
  }

  addItem(name, price, quantity, availablePromotionalStock) {
    const adjustedQuantity = this.#promotionManager.applyPromotion(
      name,
      quantity,
      availablePromotionalStock,
    );

    this.#items.push({ name, price, quantity: adjustedQuantity });

    // 프로모션 할인 금액 누적
    const discount = (quantity - adjustedQuantity) * price;
    this.#addDiscount(discount);
  }

  #addDiscount(amount) {
    this.#totalDiscountAmount += amount;
  }
}

export default Cart;
