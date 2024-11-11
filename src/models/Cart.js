import MembershipManager from './MembershipManager.js';
import InputView from '../views/InputView.js';
import { MissionUtils } from '@woowacourse/mission-utils';
import { retryOnError } from '../utils/retryOnError.js';

class Cart {
  #items;
  #promotionManager;
  #membershipManager;
  #productManager;
  #totalDiscountAmount;
  #totalQuantity;

  constructor(productManager, promotionManager) {
    this.#items = [];
    this.#promotionManager = promotionManager;
    this.#membershipManager = new MembershipManager();
    this.#productManager = productManager;
    this.#totalDiscountAmount = 0;
    this.#totalQuantity = 0;
  }

  resetCart() {
    this.#items = [];
    this.#totalDiscountAmount = 0;
    this.#totalQuantity = 0;
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

      if (buy === 1 && get === 1) {
        const maxBonusQuantity = Math.floor(quantity / buy) * get;
        const actualBonusQuantity = Math.min(
          maxBonusQuantity,
          availablePromotionalStock,
        );

        if (actualBonusQuantity === maxBonusQuantity) {
          if (quantity % 2 === 0) {
            bonusQuantity = actualBonusQuantity / 2;
            discountAmount = price * bonusQuantity;
          } else {
            const addMore = await retryOnError(() =>
              InputView.readPromotionAddConfirmation(name, actualBonusQuantity),
            );
            if (addMore) {
              purchaseQuantity += 1;
              bonusQuantity = actualBonusQuantity;
            } else if (quantity === 1) {
              bonusQuantity = 0;
            }
            discountAmount = price * bonusQuantity;
          }
        } else {
          const excessQuantity = quantity - availablePromotionalStock;
          const confirmRegularPrice = await retryOnError(() =>
            InputView.readRegularPriceConfirmation(name, excessQuantity),
          );

          if (!confirmRegularPrice) {
            purchaseQuantity -= excessQuantity;
          } else {
            purchaseQuantity = quantity;
          }
          bonusQuantity = actualBonusQuantity;
          discountAmount = price * bonusQuantity;
        }
      } else if (quantity >= buy) {
        const maxBonusQuantity = Math.floor(quantity / buy) * get;
        const actualBonusQuantity = Math.min(
          maxBonusQuantity,
          availablePromotionalStock,
        );

        const totalPromotionalApplicable =
          Math.floor(availablePromotionalStock / get) * buy;
        const remainingQuantity = quantity - totalPromotionalApplicable;

        if (actualBonusQuantity < maxBonusQuantity) {
          const confirmRegularPrice = await retryOnError(() =>
            InputView.readRegularPriceConfirmation(name, remainingQuantity),
          );
          if (!confirmRegularPrice) {
            purchaseQuantity -= remainingQuantity;
          } else {
            purchaseQuantity = totalPromotionalApplicable + remainingQuantity;
          }
          bonusQuantity = actualBonusQuantity;
          discountAmount = price * bonusQuantity;
        } else if (actualBonusQuantity >= maxBonusQuantity) {
          if (quantity % buy !== 0) {
            bonusQuantity = actualBonusQuantity;
            discountAmount = price * bonusQuantity;
          } else {
            const addMore = await retryOnError(() =>
              InputView.readPromotionAddConfirmation(name, actualBonusQuantity),
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

    this.#totalQuantity += purchaseQuantity;

    const adjustedQuantity = purchaseQuantity;
    this.#addDiscount(discountAmount);
    this.#addDiscountedItem(name, price, adjustedQuantity, bonusQuantity);
  }

  #addDiscountedItem(name, price, quantity, bonusQuantity) {
    this.#items.push({ name, price, quantity, bonusQuantity });
  }

  deductAllItemsStock() {
    this.#items.forEach(({ name, quantity, bonusQuantity }) => {
      const actualPurchaseQuantity = quantity - bonusQuantity;
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
      totalQuantity: this.#totalQuantity,
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
