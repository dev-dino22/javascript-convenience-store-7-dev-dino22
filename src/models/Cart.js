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
        const maxBonusQuantity = Math.floor(quantity / buy) * get;

        const actualBonusQuantity = Math.min(
          maxBonusQuantity,
          availablePromotionalStock,
        );

        // 프로모션 할인이 적용되지 않는 수량 계산
        const totalPromotionalApplicable =
          Math.floor(availablePromotionalStock / get) * buy;
        const remainingQuantity = quantity - totalPromotionalApplicable;

        if (actualBonusQuantity < maxBonusQuantity) {
          // 프로모션 재고가 부족하여 일부 수량은 정가로 구매해야 함을 알림
          const confirmRegularPrice =
            await InputView.readRegularPriceConfirmation(
              name,
              remainingQuantity,
            );
          if (!confirmRegularPrice) {
            console.log(`${name} 구매가 취소되었습니다.`);
            return; // 사용자 거절 시 구매 취소
          }
          // 정가로 남은 수량을 구매하기로 결정한 경우
          purchaseQuantity = totalPromotionalApplicable + remainingQuantity;
          bonusQuantity = actualBonusQuantity;
          discountAmount = price * bonusQuantity;
        } else if (actualBonusQuantity >= maxBonusQuantity) {
          if (quantity % buy !== 0) {
            // 고객이 프로모션 조건을 만족한 수량을 가져온 경우
            console.log('조건을 충족하여 자동으로 증정 혜택을 적용');
            bonusQuantity = actualBonusQuantity;
            discountAmount = price * bonusQuantity;
          } else {
            // 프로모션 조건보다 부족할 경우 추가 수량을 제안
            console.log(
              '프로모션 조건보다 부족한 수량으로 입력, 추가 수량 제안',
            );
            const addMore = await InputView.readPromotionAddConfirmation(
              name,
              actualBonusQuantity,
            );
            if (addMore) {
              purchaseQuantity += get;
              bonusQuantity = actualBonusQuantity;
              discountAmount = price * bonusQuantity;
            }
          }
        }
      }
    }

    // 최종 구매 수량은 실제 구매한 수량만 반영
    const adjustedQuantity = purchaseQuantity;
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
