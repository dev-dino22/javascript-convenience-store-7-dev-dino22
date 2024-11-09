import PromotionManager from './PromotionManager.js';
import MembershipManager from './MembershipManager.js';

class Cart {
  #items;
  #promotionManager;
  #membershipManager;
  #totalDiscountAmount;

  constructor() {
    this.#items = [];
    this.#promotionManager = new PromotionManager();
    this.#membershipManager = new MembershipManager();
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

  calculateFinalAmount(applyMembershipDiscount = false) {
    let totalAmount = this.#calculateTotalAmountWithoutDiscounts();

    // 프로모션 할인 적용
    totalAmount -= this.#totalDiscountAmount;

    // 멤버십 할인 적용
    if (applyMembershipDiscount) {
      const membershipDiscount =
        this.#membershipManager.calculateMembershipDiscount(totalAmount);
      totalAmount -= membershipDiscount;
    }

    return totalAmount;
  }

  #calculateTotalAmountWithoutDiscounts() {
    return this.#items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  }
}

export default Cart;
