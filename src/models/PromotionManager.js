import { loadPromotionData } from '../utils/loadPromotionData.js';

class PromotionManager {
  #promotions;

  constructor() {
    this.#promotions = loadPromotionData();
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
}

export default PromotionManager;
