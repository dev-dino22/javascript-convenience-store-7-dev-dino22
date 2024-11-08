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
});
