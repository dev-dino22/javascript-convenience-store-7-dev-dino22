import PromotionManager from '../src/models/PromotionManager.js';

describe('Promotion 기능 단위 테스트', () => {
  let promotionManager;
  beforeEach(() => {
    promotionManager = new PromotionManager();
  });

  test('applyPromotion() 기능테스트 - 2+1 수량 반환', () => {
    const promotionName = '탄산2+1';
    const quantity = 2;
    const result = promotionManager.applyPromotion(promotionName, quantity, 10);

    expect(result).toBe(3);
  });

  test('applyPromotion() 기능테스트 - 1+1 수량 반환(MD추천상품)', () => {
    const promotionName = 'MD추천상품';
    const quantity = 1;
    const result = promotionManager.applyPromotion(promotionName, quantity, 10);

    expect(result).toBe(2);
  });

  test('applyPromotion() 기능테스트 - 2+1 수량 반환(반짝할인)', () => {
    const promotionName = '반짝할인';
    const quantity = 3;
    const result = promotionManager.applyPromotion(promotionName, quantity, 10);

    expect(result).toBe(6);
  });

  test('calculateBonus() 기능테스트 - 보너스 상품 개수 반환 확인', () => {
    const quantity = 2;
    const buy = 2;
    const get = 1;
    const availablePromotionalStock = 10;

    const calculateBonusResult = promotionManager.calculateBonus(
      quantity,
      buy,
      get,
      availablePromotionalStock,
    );

    const result = calculateBonusResult - quantity;

    expect(result).toBe(1);
  });

  test('calculateDiscountAmount() 기능테스트 - 할인 금액 계산', () => {
    const promotionName = '반짝할인';
    const quantity = 2;
    const price = 1500;
    const availablePromotionalStock = 5;

    const result = promotionManager.calculateDiscountAmount(
      promotionName,
      quantity,
      price,
      availablePromotionalStock,
    );

    expect(result).toBe(3000);
  });
});
