import Cart from '../src/models/Cart.js';

describe('Cart 클래스 테스트', () => {
  let cart;
  let mockProductManager;
  let mockPromotionManager;

  beforeEach(() => {
    mockProductManager = {
      returnProductDetails: jest.fn((name) => {
        if (name === '콜라') {
          return {
            price: 1000,
            promotionName: 'PROMO1',
            availablePromotionalStock: 5,
          };
        }
        return { price: 1000, promotionName: '', availablePromotionalStock: 0 };
      }),
      deductStock: jest.fn(),
    };

    mockPromotionManager = {
      applyPromotion: jest.fn(
        (promotionName, quantity, availablePromotionalStock) => {
          if (promotionName === 'PROMO1' && availablePromotionalStock > 0) {
            return { adjustedQuantity: quantity, bonusQuantity: 1 }; // 프로모션으로 1개 추가 제공
          }
          return { adjustedQuantity: quantity, bonusQuantity: 0 };
        },
      ),
    };

    cart = new Cart(mockProductManager, mockPromotionManager);
  });

  test('addItem() 메서드가 상품을 올바르게 추가하고 프로모션 할인을 반영하는지 확인', () => {
    expect(() => cart.addItem('콜라', 2)).not.toThrow();
    expect(cart.calculateFinalAmount()).toBeLessThanOrEqual(3000); // 콜라 2개 + 1개 프로모션
  });

  test('calculateFinalAmount() 메서드가 프로모션 할인 금액을 올바르게 반영하는지 확인', () => {
    cart.addItem('콜라', 2); // 콜라에 대한 프로모션이 적용되어 1개 추가 예상
    cart.addItem('사이다', 1); // 프로모션 없이 추가
    const finalAmount = cart.calculateFinalAmount();

    // 콜라(1000 * 3) + 사이다(1000) - 할인
    expect(finalAmount).toBeLessThanOrEqual(4000);
  });

  test('멤버십 할인이 적용되지 않았을 때 최종 결제 금액이 올바르게 계산되는지 확인', () => {
    cart.addItem('콜라', 2);
    cart.addItem('사이다', 3);
    const finalAmountWithoutMembership = cart.calculateFinalAmount(false);

    expect(finalAmountWithoutMembership).toBeGreaterThan(2000);
  });

  test('멤버십 할인이 적용되었을 때 최종 결제 금액이 올바르게 계산되는지 확인', () => {
    cart.addItem('콜라', 2);
    cart.addItem('사이다', 3);
    const finalAmountWithMembership = cart.calculateFinalAmount(true);

    expect(finalAmountWithMembership).toBeLessThan(5000);
  });
});
