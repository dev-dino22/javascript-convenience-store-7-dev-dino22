import { loadPromotionData } from '../utils/loadPromotionData.js';

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

  applyPromotion(name, quantity, availablePromotionalStock) {
    const promotion = this.#promotions.find((promo) => promo.name === name);
    if (!promotion) return quantity;

    const { buy, get, start_date, end_date } = promotion;
    if (!this.isWithinPromotionPeriod(start_date, end_date)) return quantity;

    if (name === '탄산2+1' && quantity >= buy) {
      return this.calculateBonus(quantity, buy, get, availablePromotionalStock);
    }

    if (name === 'MD추천상품' && quantity >= buy) {
      return this.calculateBonus(quantity, buy, get, availablePromotionalStock);
    }
    if (name === '반짝할인' && quantity >= buy) {
      return this.calculateBonus(quantity, buy, get, availablePromotionalStock);
    }

    return quantity;
  }

  isWithinPromotionPeriod(startDate, endDate) {
    const currentDate = new Date();
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
