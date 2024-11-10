import { loadProductData } from '../utils/loadProductData.js';
import PromotionManager from './PromotionManager.js';
import ProductValidator from '../utils/ProductValidator.js';
import InputView from '../views/InputView.js';

class ProductManager {
  #products;
  #promotionManager;
  #validate;

  constructor() {
    this.#products = loadProductData();
    this.#promotionManager = new PromotionManager();
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

    // 프로모션 재고가 충분하지 않을 경우
    if (
      !this.#validate.isPromotionStockSufficient(
        availablePromotionalStock,
        quantity,
      )
    ) {
      // 프로모션 없이 구매할지 여부를 묻기
      const proceedWithoutPromotion =
        await InputView.readRegularPriceConfirmation(name, quantity);
      if (!proceedWithoutPromotion) return false; // 구매를 원치 않으면 false 반환
    }

    return true; // 프로모션 재고가 충분하거나 사용자가 프로모션 없이 구매를 원함
  }

  returnProductDetails(name) {
    // 상품 이름과 프로모션이 있는 항목을 먼저 찾음
    const promotionalProduct = this.#products.find(
      (item) => item.name === name && item.promotion !== null,
    );

    // 기본 제품을 찾음 (프로모션이 없는 제품)
    const regularProduct = this.#products.find(
      (item) => item.name === name && item.promotion === null,
    );

    // 프로모션이 있는 제품의 재고와 프로모션 이름 설정
    const promotionName = promotionalProduct
      ? promotionalProduct.promotion
      : null;
    const availablePromotionalStock = promotionalProduct
      ? promotionalProduct.quantity
      : 0;

    // 가격은 기본 제품에서 가져오고, 기본 재고는 regularProduct가 있으면 사용
    const price = regularProduct
      ? regularProduct.price
      : promotionalProduct.price;
    const quantity = regularProduct
      ? regularProduct.quantity
      : promotionalProduct.quantity;

    return { price, promotionName, availablePromotionalStock, quantity };
  }

  deductStock(name, purchaseQuantity = 0, bonusQuantity = 0) {
    const totalQuantity = purchaseQuantity + bonusQuantity;

    const promotionalStock = this.#products.find(
      (product) => product.name === name && product.promotion !== null,
    );
    const regularStock = this.#products.find(
      (product) => product.name === name && product.promotion === null,
    );

    // Step 1: 보너스 수량은 무조건 promotionalStock에서 차감
    if (promotionalStock && bonusQuantity > 0) {
      const deductBonusAmount = Math.min(
        promotionalStock.quantity,
        bonusQuantity,
      );
      promotionalStock.quantity -= deductBonusAmount;
    }

    // Step 2: 구매 수량을 promotionalStock에서 먼저 차감
    let remainingPurchaseQuantity = purchaseQuantity;
    if (promotionalStock && remainingPurchaseQuantity > 0) {
      const deductPurchaseAmount = Math.min(
        promotionalStock.quantity,
        remainingPurchaseQuantity,
      );
      promotionalStock.quantity -= deductPurchaseAmount;
      remainingPurchaseQuantity -= deductPurchaseAmount;
    }

    // Step 3: 남은 구매 수량을 regularStock에서 차감
    if (remainingPurchaseQuantity > 0 && regularStock) {
      if (regularStock.quantity < remainingPurchaseQuantity) {
        throw new Error('[ERROR] 재고가 부족합니다.');
      }
      regularStock.quantity -= remainingPurchaseQuantity;
    } else if (remainingPurchaseQuantity > 0) {
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
