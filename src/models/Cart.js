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

  generateReceiptData(applyMembershipDiscount = false) {
    const totalAmountWithoutDiscounts =
      this.#calculateTotalAmountWithoutDiscounts();
    const finalAmount = this.calculateFinalAmount(applyMembershipDiscount);
    const membershipDiscount = applyMembershipDiscount
      ? this.#membershipManager.calculateMembershipDiscount(
          totalAmountWithoutDiscounts - this.#totalDiscountAmount,
        )
      : 0;

    // 장바구니 내 아이템 상세 정보
    const itemsDetails = this.#items.map(({ name, quantity, price }) => ({
      name,
      quantity,
      total: price * quantity,
    }));

    // 증정 항목 정보 (프로모션으로 적용된 항목)
    const promotionsDetails = this.#items
      .filter((item) => item.quantity > 1) // assuming promotion items have adjusted quantities
      .map(({ name, quantity }) => ({
        name,
        quantity: quantity - 1, // 증정 개수만 포함
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
