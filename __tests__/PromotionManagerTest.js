import { MissionUtils } from '@woowacourse/mission-utils';
import PromotionManager from '../src/models/PromotionManager.js';

describe('PromotionManager 단위 테스트', () => {
  let promotionManager;

  beforeEach(() => {
    promotionManager = new PromotionManager();
  });

  test('applyPromotion() 기능 테스트 - 2+1 수량 반환', () => {
    const promotionName = '탄산2+1';
    const quantity = 2;
    const availablePromotionalStock = 10;

    const result = promotionManager.applyPromotion(
      promotionName,
      quantity,
      availablePromotionalStock,
    );

    expect(result).toEqual({
      adjustedQuantity: 2,
      bonusQuantity: 1,
    });
  });

  test('applyPromotion() 기능 테스트 - 1+1 수량 반환 (MD추천상품)', () => {
    const promotionName = 'MD추천상품';
    const quantity = 1;
    const availablePromotionalStock = 10;

    const result = promotionManager.applyPromotion(
      promotionName,
      quantity,
      availablePromotionalStock,
    );

    expect(result).toEqual({
      adjustedQuantity: 1,
      bonusQuantity: 1,
    });
  });

  test('applyPromotion() 기능 테스트 - 프로모션 기간이 아닐 때', () => {
    const promotionName = '반짝할인';
    const quantity = 3;
    const availablePromotionalStock = 10;

    // 가정: 현재 날짜가 프로모션 기간이 아님
    jest
      .spyOn(promotionManager, 'isWithinPromotionPeriod')
      .mockReturnValue(false);

    const result = promotionManager.applyPromotion(
      promotionName,
      quantity,
      availablePromotionalStock,
    );

    expect(result).toEqual({
      adjustedQuantity: 3,
      bonusQuantity: 0,
    });
  });

  test('calculateBonus() 기능 테스트 - 보너스 상품 개수 반환 확인', () => {
    const quantity = 4;
    const buy = 2;
    const get = 1;
    const availablePromotionalStock = 10;

    const result = promotionManager.calculateBonus(
      quantity,
      buy,
      get,
      availablePromotionalStock,
    );

    expect(result).toBe(6); // 4개의 구매에 대해 2개의 보너스를 적용
  });

  test('calculateDiscountAmount() 기능 테스트 - 할인 금액 계산', () => {
    const promotionName = '탄산2+1';
    const quantity = 4;
    const price = 1000;
    const availablePromotionalStock = 10;

    const result = promotionManager.calculateDiscountAmount(
      promotionName,
      quantity,
      price,
      availablePromotionalStock,
    );

    expect(result).toBe(2000); // 2개 구매마다 1개 보너스 -> 2개 할인이 적용되어 2000원 할인
  });

  test('calculateDiscountAmount() 기능 테스트 - 프로모션 기간이 아닐 때 할인 금액 없음', () => {
    const promotionName = '반짝할인';
    const quantity = 4;
    const price = 1000;
    const availablePromotionalStock = 10;

    jest
      .spyOn(promotionManager, 'isWithinPromotionPeriod')
      .mockReturnValue(false);

    const result = promotionManager.calculateDiscountAmount(
      promotionName,
      quantity,
      price,
      availablePromotionalStock,
    );

    expect(result).toBe(0); // 프로모션 기간이 아니므로 할인 없음
  });

  test('isWithinPromotionPeriod() 기능 테스트 - 프로모션 기간 확인', () => {
    const startDate = '2024-01-01';
    const endDate = '2024-12-31';
    const currentDate = MissionUtils.DateTimes.now();

    jest.useFakeTimers().setSystemTime(new Date('2024-06-15'));

    const result = promotionManager.isWithinPromotionPeriod(
      startDate,
      endDate,
      currentDate,
    );
    expect(result).toBe(true);

    jest.useRealTimers();
  });
});
