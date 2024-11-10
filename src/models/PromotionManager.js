import { loadPromotionData } from '../utils/loadPromotionData.js';
import { DateTimes } from '@woowacourse/mission-utils';
class PromotionManager {
  #promotions;
  #totalDiscountAmount;

  constructor() {
    this.#promotions = loadPromotionData();
    this.#totalDiscountAmount = 0;
  }

  /*isPromotionApplicable(name) {
    const promotion = this.#promotions.find((promo) => promo.name === name);
    return promotion !== undefined;
  }*/

  applyPromotion(promotionName, quantity, availablePromotionalStock) {
    const promotion = this.#promotions.find(
      (promo) => promo.name === promotionName,
    );
    if (!promotion) return { adjustedQuantity: quantity, bonusQuantity: 0 };

    const { buy, get, start_date, end_date } = promotion;
    if (!this.isWithinPromotionPeriod(start_date, end_date)) {
      return { adjustedQuantity: quantity, bonusQuantity: 0 };
    }

    const maxBonus = Math.floor(quantity / buy) * get;
    const applicableBonus = Math.min(maxBonus, availablePromotionalStock);

    return {
      adjustedQuantity: quantity,
      bonusQuantity: applicableBonus,
    };
  }

  isWithinPromotionPeriod(startDate, endDate) {
    const currentDate = DateTimes.now();
    return (
      currentDate >= new Date(startDate) && currentDate <= new Date(endDate)
    );
  }

  calculateBonus(quantity, buy, get, availablePromotionalStock) {
    const maxBonus = Math.floor(quantity / buy) * get;
    const applicableBonus = Math.min(maxBonus, availablePromotionalStock);
    return quantity + applicableBonus;
  }

  calculateDiscountAmount(name, quantity, price, availablePromotionalStock) {
    const promotion = this.#promotions.find((promo) => promo.name === name);
    if (!promotion) return 0;

    const { buy, get, start_date, end_date } = promotion;
    if (!this.isWithinPromotionPeriod(start_date, end_date) || quantity < buy) {
      return 0;
    }

    // calculateBonus를 호출하여 applicableBonus 계산
    const applicableBonus =
      this.calculateBonus(quantity, buy, get, availablePromotionalStock) -
      quantity;

    // applicableBonus에 제품 가격을 곱하여 할인 금액 반환
    return applicableBonus * price;
  }
}

export default PromotionManager;
