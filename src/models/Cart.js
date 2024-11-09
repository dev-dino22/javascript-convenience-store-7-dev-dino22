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
    const membershipDiscount = applyMembershipDiscount
      ? this.#membershipManager.calculateMembershipDiscount(totalAmount)
      : 0;

    return totalAmount - membershipDiscount;
  }

  #calculateTotalAmountWithoutDiscounts() {
    return this.#items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  }

  deductAllItemsStock(productManager) {
    this.#items.forEach(({ name, quantity }) => {
      productManager.deductStock(name, quantity);
    });
  }

  generateReceiptData(applyMembershipDiscount = false) {
    const totalAmountWithoutDiscounts =
      this.#calculateTotalAmountWithoutDiscounts();
    const finalAmount = this.calculateFinalAmount(applyMembershipDiscount);
    const membershipDiscount = applyMembershipDiscount
      ? -this.#membershipManager.calculateMembershipDiscount(
          totalAmountWithoutDiscounts - this.#totalDiscountAmount,
        )
      : 0;

    const itemsDetails = this.#items.map(({ name, quantity, price }) => ({
      name,
      quantity,
      total: price * quantity,
    }));

    const promotionsDetails = this.#items
      .filter((item) => item.quantity > 1)
      .map(({ name, quantity }) => ({
        name,
        quantity: quantity - 1,
      }));

    return {
      itemsDetails,
      promotionsDetails,
      totalAmountWithoutDiscounts,
      totalDiscountAmount: this.#totalDiscountAmount,
      membershipDiscount,
      finalAmount,
    };
  }
}

export default Cart;
