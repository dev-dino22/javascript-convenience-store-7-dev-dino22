import { loadPromotionData } from '../src/utils/loadPromotionData.js';

describe('loadPromotionData() 함수 테스트', () => {
  test('loadPromotionData가 객체 배열을 반환하는지 확인', async () => {
    const promotions = loadPromotionData();

    expect(Array.isArray(promotions)).toBe(true);

    // 배열 내부 요소가 객체인지 확인
    expect(promotions.every((item) => typeof item === 'object')).toBe(true);

    // 예시로 첫 번째 객체의 구조를 확인 (이름, 가격, 수량이 제대로 파싱되었는지)
    expect(promotions[0]).toHaveProperty('name');
    expect(promotions[0]).toHaveProperty('buy');
    expect(promotions[0]).toHaveProperty('get');
    expect(promotions[0]).toHaveProperty('start_date');
    expect(promotions[0]).toHaveProperty('end_date');
  });
  test('상품 목록이 정상적으로 불러와지는지 확인', async () => {
    const promotions = loadPromotionData();

    expect(promotions).toEqual([
      {
        name: '탄산2+1',
        buy: 2,
        get: 1,
        start_date: '2024-01-01',
        end_date: '2024-12-31',
      },
      {
        name: 'MD추천상품',
        buy: 1,
        get: 1,
        start_date: '2024-01-01',
        end_date: '2024-12-31',
      },
      {
        name: '반짝할인',
        buy: 1,
        get: 1,
        start_date: '2024-11-01',
        end_date: '2024-11-30',
      },
    ]);
  });
});
