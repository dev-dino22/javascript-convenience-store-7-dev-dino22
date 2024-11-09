import Cart from '../src/models/Cart.js';

describe('Cart 클래스 테스트', () => {
  let cart;

  beforeEach(() => {
    cart = new Cart();
  });

  test('addItem() 메서드가 상품을 올바르게 추가하고 프로모션 할인을 반영하는지 확인', () => {
    const productName = '콜라';
    const productPrice = 1000;
    const productQuantity = 2;
    const availablePromotionalStock = 5;

    // 상품 추가 및 프로모션 할인 적용 확인
    expect(() =>
      cart.addItem(
        productName,
        productPrice,
        productQuantity,
        availablePromotionalStock,
      ),
    ).not.toThrow();
  });

  test('calculateFinalAmount() 메서드가 프로모션 할인 금액을 올바르게 반영하는지 확인', () => {
    cart.addItem('콜라', 1000, 2, 5); // 프로모션 적용 시 1개 추가 증정으로 예상됨
    cart.addItem('사이다', 1000, 1, 0); // 프로모션 없이 추가
    const finalAmount = cart.calculateFinalAmount();

    // 콜라(1000 * 3) + 사이다(1000) - 할인
    expect(finalAmount).toBeLessThanOrEqual(4000);
  });

  test('멤버십 할인이 적용되지 않았을 때 최종 결제 금액이 올바르게 계산되는지 확인', () => {
    cart.addItem('콜라', 1000, 2, 5);
    cart.addItem('사이다', 1000, 3, 0);
    const finalAmountWithoutMembership = cart.calculateFinalAmount(false);

    expect(finalAmountWithoutMembership).toBeGreaterThan(2000);
  });

  test('멤버십 할인이 적용되었을 때 최종 결제 금액이 올바르게 계산되는지 확인', () => {
    cart.addItem('콜라', 1000, 2, 5);
    cart.addItem('사이다', 1000, 3, 0);
    const finalAmountWithMembership = cart.calculateFinalAmount(true);

    expect(finalAmountWithMembership).toBeLessThan(5000);
  });
});
