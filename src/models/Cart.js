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

  resetCart() {
    this.#items = [];
    this.#totalDiscountAmount = 0;
  }

  addItem(name, price, quantity, availablePromotionalStock, promotionName) {
    const { adjustedQuantity = quantity, bonusQuantity = 0 } =
      this.#promotionManager.applyPromotion(
        promotionName,
        quantity,
        availablePromotionalStock,
      );

    this.#items.push({
      name,
      price,
      quantity: adjustedQuantity,
      bonusQuantity,
    });

    const discount = bonusQuantity * price;
    this.#addDiscount(discount);
  }

  // 전체 아이템 차감 메서드 - 구매 수량과 증정 수량 모두 포함
  deductAllItemsStock(productManager) {
    this.#items.forEach(({ name, quantity, bonusQuantity }) => {
      // quantity와 bonusQuantity로 차감
      productManager.deductStock(name, quantity, bonusQuantity);
    });
  }

  #addDiscount(amount) {
    this.#totalDiscountAmount += amount;
  }

  calculateFinalAmount(applyMembershipDiscount = false) {
    let totalAmount = this.#calculateTotalAmountWithoutDiscounts();

    totalAmount -= this.#totalDiscountAmount;

    // 멤버십 할인 적용
    const membershipDiscount = applyMembershipDiscount
      ? this.#membershipManager.calculateMembershipDiscount(totalAmount)
      : 0;

    return totalAmount - membershipDiscount;
  }

  #calculateTotalAmountWithoutDiscounts() {
    return this.#items.reduce(
      (total, item) =>
        total + item.price * (item.quantity + item.bonusQuantity),
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

    const itemsDetails = this.#items.map(({ name, quantity, price }) => ({
      name,
      quantity,
      total: price * quantity,
    }));

    const promotionsDetails = this.#items
      .filter((item) => item.bonusQuantity > 0)
      .map(({ name, bonusQuantity }) => ({
        name,
        quantity: bonusQuantity,
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
