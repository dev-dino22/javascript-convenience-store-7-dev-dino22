import { loadProductData } from '../utils/loadProductData.js';
import PromotionManager from './PromotionManager.js';
import ProductValidator from '../utils/ProductValidator.js';
import InputView from '../views/InputView.js';
import { MissionUtils } from '@woowacourse/mission-utils';

class ProductManager {
  #products;
  #promotionManager;
  #validate;

  constructor(promotionManager) {
    this.#products = loadProductData();
    this.#promotionManager = promotionManager;
    this.#validate = new ProductValidator();
  }

  checkProductStock(itemsToBuy) {
    itemsToBuy.forEach(({ name, quantity }) => {
      this.#validate.checkProductStock(this.#products, name, quantity);
    });
  }

  async handlePromotionStock(name, quantity) {
    const promotionalStock = this.#products.find(
      (product) => product.name === name && product.promotion !== null,
    );
    const availablePromotionalStock = promotionalStock?.quantity || 0;
    if (
      !this.#validate.isPromotionStockSufficient(
        availablePromotionalStock,
        quantity,
      )
    ) {
      const proceedWithoutPromotion =
        await InputView.readRegularPriceConfirmation(name, quantity);
      if (!proceedWithoutPromotion) return false;
    }
    return true;
  }
  findPromotionalProduct(name) {
    return this.#products.find(
      (item) => item.name === name && item.promotion !== null,
    );
  }

  findRegularProduct(name) {
    return this.#products.find(
      (item) => item.name === name && item.promotion === null,
    );
  }

  calculatePromotionalStock(promotionalProduct) {
    if (!promotionalProduct) return 0;

    const promotionDetails = this.#promotionManager.getPromotionDetails(
      promotionalProduct.promotion,
    );
    if (!promotionDetails) return 0;

    const { buy, get } = promotionDetails;
    if (buy === 1 && get === 1)
      return Math.floor(promotionalProduct.quantity / 2);

    const maxApplicablePromotions = Math.floor(
      promotionalProduct.quantity / (buy + get),
    );
    return maxApplicablePromotions * get;
  }

  derivePriceAndQuantity(regularProduct, promotionalProduct) {
    if (regularProduct)
      return { price: regularProduct.price, quantity: regularProduct.quantity };
    if (promotionalProduct)
      return {
        price: promotionalProduct.price,
        quantity: promotionalProduct.quantity,
      };
    return { price: 0, quantity: 0 };
  }

  returnProductDetails(name) {
    const promotionalProduct = this.findPromotionalProduct(name);
    const regularProduct = this.findRegularProduct(name);

    let promotionName = null;
    if (promotionalProduct) {
      promotionName = promotionalProduct.promotion;
    }

    const availablePromotionalStock =
      this.calculatePromotionalStock(promotionalProduct);

    const { price, quantity } = this.derivePriceAndQuantity(
      regularProduct,
      promotionalProduct,
    );

    return { price, promotionName, availablePromotionalStock, quantity };
  }

  deductStock(name, purchaseQuantity = 0, bonusQuantity = 0) {
    const promotionalStock = this.#products.find(
      (product) => product.name === name && product.promotion !== null,
    );
    const regularStock = this.#products.find(
      (product) => product.name === name && product.promotion === null,
    );

    if (promotionalStock && bonusQuantity > 0) {
      const deductBonusAmount = Math.min(
        promotionalStock.quantity,
        bonusQuantity,
      );
      promotionalStock.quantity -= deductBonusAmount;
    }

    let remainingPurchaseQuantity = purchaseQuantity;
    if (promotionalStock && remainingPurchaseQuantity > 0) {
      const deductPurchaseAmount = Math.min(
        promotionalStock.quantity,
        remainingPurchaseQuantity,
      );
      promotionalStock.quantity -= deductPurchaseAmount;
      remainingPurchaseQuantity -= deductPurchaseAmount;
    }

    if (remainingPurchaseQuantity > 0 && regularStock) {
      if (regularStock.quantity < remainingPurchaseQuantity) {
        throw new Error('[ERROR] 재고가 부족합니다.');
      }
      regularStock.quantity -= remainingPurchaseQuantity;
      return;
    }

    if (remainingPurchaseQuantity > 0) {
      throw new Error('[ERROR] 재고가 부족합니다.');
    }
  }

  // 상품 정보를 문자열로 가공하여 반환
  formatProductsInfo() {
    const productInfoLines = this.#products.map((product) => {
      const quantityText = this.formatQuantity(product.quantity);
      const promotionText = this.formatPromotion(product.promotion);
      const formattedPrice = this.formatPrice(product.price); // 가격 포맷 적용
      return `- ${product.name} ${formattedPrice}원 ${quantityText} ${promotionText}`.trim();
    });

    return productInfoLines.join('\n');
  }

  formatPrice(price) {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    })
      .format(price)
      .replace('₩', '')
      .trim();
  }

  formatQuantity(quantity) {
    if (quantity > 0) {
      return `${quantity}개`;
    }
    return '재고 없음';
  }

  formatPromotion(promotion) {
    if (promotion) {
      return promotion;
    }
    return '';
  }
}

export default ProductManager;
