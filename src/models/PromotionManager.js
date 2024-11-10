import { loadPromotionData } from '../utils/loadPromotionData.js';
import { MissionUtils } from '@woowacourse/mission-utils';

class PromotionManager {
  #promotions;
  #totalDiscountAmount;

  constructor() {
    this.#promotions = loadPromotionData();
    this.#totalDiscountAmount = 0;
  }

  applyPromotion(promotionName, quantity, availablePromotionalStock) {
    const promotion = this.#promotions.find(
      (promo) => promo.name === promotionName,
    );

    if (!promotion || quantity < promotion.buy) {
      return { adjustedQuantity: quantity, bonusQuantity: 0 };
    }

    const { buy, get, start_date, end_date } = promotion;

    const isWithinPeriod = this.isWithinPromotionPeriod(start_date, end_date);

    if (!isWithinPeriod) {
      return { adjustedQuantity: quantity, bonusQuantity: 0 };
    }

    const maxBonus = Math.floor(quantity / buy) * get;
    const applicableBonus = Math.min(maxBonus, availablePromotionalStock);

    return {
      adjustedQuantity: quantity,
      bonusQuantity: applicableBonus,
    };
  }

  getPromotionDetails(promotionName) {
    const promotion = this.#promotions.find(
      (promo) => promo.name === promotionName,
    );
    if (!promotion) return null;

    const { buy, get, start_date, end_date } = promotion;
    return { buy, get, start_date, end_date };
  }

  isWithinPromotionPeriod(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    return (
      MissionUtils.DateTimes.now() >= start &&
      MissionUtils.DateTimes.now() <= end
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

    const applicableBonus =
      this.calculateBonus(quantity, buy, get, availablePromotionalStock) -
      quantity;

    return applicableBonus * price;
  }
}

export default PromotionManager;
