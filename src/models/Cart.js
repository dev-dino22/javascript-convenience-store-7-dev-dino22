import MembershipManager from './MembershipManager.js';

class Cart {
  #items;
  #promotionManager;
  #membershipManager;
  #productManager;
  #totalDiscountAmount;

  constructor(productManager, promotionManager) {
    this.#items = [];
    this.#promotionManager = promotionManager;
    this.#membershipManager = new MembershipManager();
    this.#productManager = productManager;
    this.#totalDiscountAmount = 0;
  }

  resetCart() {
    this.#items = [];
    this.#totalDiscountAmount = 0;
  }

  addItem(name, quantity) {
    const { price, promotionName, availablePromotionalStock } =
      this.#productManager.returnProductDetails(name);

    const { adjustedQuantity, bonusQuantity } = this.#applyPromotionToItem(
      promotionName,
      quantity,
      availablePromotionalStock,
    );

    this.#addDiscountedItem(name, price, adjustedQuantity, bonusQuantity);
  }

  #applyPromotionToItem(promotionName, quantity, availablePromotionalStock) {
    return this.#promotionManager.applyPromotion(
      promotionName,
      quantity,
      availablePromotionalStock,
    );
  }

  #addDiscountedItem(name, price, quantity, bonusQuantity) {
    this.#items.push({ name, price, quantity, bonusQuantity });
    this.#addDiscount(bonusQuantity * price);
  }

  deductAllItemsStock() {
    this.#items.forEach(({ name, quantity, bonusQuantity }) => {
      this.#productManager.deductStock(name, quantity, bonusQuantity);
    });
  }

  #addDiscount(amount) {
    this.#totalDiscountAmount += amount;
  }

  calculateFinalAmount(applyMembershipDiscount = false) {
    const totalAmount =
      this.#calculateTotalAmountWithoutDiscounts() - this.#totalDiscountAmount;
    return (
      totalAmount -
      this.#calculateMembershipDiscount(totalAmount, applyMembershipDiscount)
    );
  }

  #calculateTotalAmountWithoutDiscounts() {
    return this.#items.reduce(
      (total, item) =>
        total + item.price * (item.quantity + item.bonusQuantity),
      0,
    );
  }

  #calculateMembershipDiscount(totalAmount, applyMembershipDiscount) {
    if (!applyMembershipDiscount) {
      return 0;
    }
    return this.#membershipManager.calculateMembershipDiscount(totalAmount);
  }

  #calculateSummaryDetails(applyMembershipDiscount) {
    return {
      totalAmountWithoutDiscounts: this.#calculateTotalAmountWithoutDiscounts(),
      totalDiscountAmount: this.#totalDiscountAmount,
      membershipDiscount: this.#getCalculatedMembershipDiscount(
        applyMembershipDiscount,
      ),
      finalAmount: this.calculateFinalAmount(applyMembershipDiscount),
    };
  }

  #getCalculatedMembershipDiscount(applyMembershipDiscount) {
    const baseAmount =
      this.#calculateTotalAmountWithoutDiscounts() - this.#totalDiscountAmount;
    return this.#calculateMembershipDiscount(
      baseAmount,
      applyMembershipDiscount,
    );
  }

  generateReceiptData(applyMembershipDiscount = false) {
    return {
      ...this.#calculateSummaryDetails(applyMembershipDiscount),
      itemsDetails: this.#getItemsDetails(),
      promotionsDetails: this.#getPromotionsDetails(),
    };
  }

  #getItemsDetails() {
    return this.#items.map(({ name, quantity, price }) => ({
      name,
      quantity,
      total: price * quantity,
    }));
  }

  #getPromotionsDetails() {
    const promotionalItems = this.#filterPromotionalItems();
    return this.#mapPromotionalDetails(promotionalItems);
  }

  #filterPromotionalItems() {
    return this.#items.filter((item) => item.bonusQuantity > 0);
  }

  #mapPromotionalDetails(promotionalItems) {
    return promotionalItems.map(({ name, bonusQuantity }) => ({
      name,
      quantity: bonusQuantity,
    }));
  }
}

export default Cart;
