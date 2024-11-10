import MembershipManager from './MembershipManager.js';
import InputView from '../views/InputView.js';
import { MissionUtils } from '@woowacourse/mission-utils';

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

  async addItem(name, quantity) {
    const { price, promotionName, availablePromotionalStock } =
      this.#productManager.returnProductDetails(name);

    const promotionDetails =
      this.#promotionManager.getPromotionDetails(promotionName);
    let purchaseQuantity = quantity;
    let bonusQuantity = 0;
    let discountAmount = 0;
    if (
      promotionDetails &&
      this.#promotionManager.isWithinPromotionPeriod(
        promotionDetails.start_date,
        promotionDetails.end_date,
      )
    ) {
      const { buy, get } = promotionDetails;
      if (quantity >= buy) {
        const extraQuantity = Math.floor(quantity / buy) * get;
        const addMore = await InputView.readPromotionAddConfirmation(
          name,
          extraQuantity,
        );

        if (addMore) {
          const promotionResult = await this.#promotionManager.applyPromotion(
            promotionName,
            quantity,
            availablePromotionalStock,
          );

          // promotionResult가 유효한 경우에만 bonusQuantity와 discountAmount를 업데이트
          if (promotionResult && promotionResult.bonusQuantity > 0) {
            bonusQuantity = promotionResult.bonusQuantity;
            discountAmount = price * bonusQuantity;
          }
        }
      }
    }
    const adjustedQuantity = purchaseQuantity + bonusQuantity;
    this.#addDiscount(discountAmount);
    this.#addDiscountedItem(name, price, adjustedQuantity, bonusQuantity);
  }

  #addDiscountedItem(name, price, quantity, bonusQuantity) {
    // `quantity`는 최종 재고 차감 수량(사용자가 실제로 구매한 수량 + 증정 포함)
    this.#items.push({ name, price, quantity, bonusQuantity });
  }

  deductAllItemsStock() {
    this.#items.forEach(({ name, quantity, bonusQuantity }) => {
      const actualPurchaseQuantity = quantity - bonusQuantity; // 실제 구매 수량 계산
      this.#productManager.deductStock(
        name,
        actualPurchaseQuantity,
        bonusQuantity,
      );
    });
  }

  #addDiscount(amount) {
    this.#totalDiscountAmount += amount;
  }

  calculateFinalAmount(applyMembershipDiscount = false) {
    const totalAmount = this.#calculateTotalAmountWithoutDiscounts();
    const discountTotal = totalAmount - this.#totalDiscountAmount;
    return (
      discountTotal -
      this.#calculateMembershipDiscount(discountTotal, applyMembershipDiscount)
    );
  }

  #calculateTotalAmountWithoutDiscounts() {
    // 총 구매액은 증정 수량을 포함한 총 수량 기준으로 계산
    return this.#items.reduce(
      (total, item) => total + item.price * item.quantity,
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
      totalDiscountAmount: this.#totalDiscountAmount, // 할인액을 정확히 반영
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
      itemsDetails: this.#getItemsDetails(), // adjustedQuantity가 반영되도록 수정
      promotionsDetails: this.#getPromotionsDetails(),
    };
  }

  #getItemsDetails() {
    // adjustedQuantity 반영하여 출력
    return this.#items.map(({ name, quantity, price }) => ({
      name,
      quantity, // adjustedQuantity가 적용된 수량을 출력
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
