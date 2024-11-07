import { loadProductData } from '../src/utils/loadProductData';

describe('loadProductData() 함수 테스트', () => {
  test('loadProductData가 객체 배열을 반환하는지 확인', async () => {
    const products = await loadProductData();

    // 배열인지 확인
    expect(Array.isArray(products)).toBe(true);

    // 배열 내부 요소가 객체인지 확인
    expect(products.every((item) => typeof item === 'object')).toBe(true);

    // 예시로 첫 번째 객체의 구조를 확인 (이름, 가격, 수량이 제대로 파싱되었는지)
    expect(products[0]).toHaveProperty('name');
    expect(products[0]).toHaveProperty('price');
    expect(products[0]).toHaveProperty('quantity');
    expect(products[0]).toHaveProperty('promotion');
  });
  test('상품 목록이 정상적으로 불러와지는지 확인', async () => {
    const products = await loadProductData();

    expect(products).toEqual([
      { name: '콜라', price: 1000, quantity: 10, promotion: '탄산2+1' },
      { name: '콜라', price: 1000, quantity: 10, promotion: null },
      { name: '사이다', price: 1000, quantity: 8, promotion: '탄산2+1' },
      { name: '사이다', price: 1000, quantity: 7, promotion: null },
      { name: '오렌지주스', price: 1800, quantity: 9, promotion: 'MD추천상품' },
      { name: '탄산수', price: 1200, quantity: 5, promotion: '탄산2+1' },
      { name: '물', price: 500, quantity: 10, promotion: null },
      { name: '비타민워터', price: 1500, quantity: 6, promotion: null },
      { name: '감자칩', price: 1500, quantity: 5, promotion: '반짝할인' },
      { name: '감자칩', price: 1500, quantity: 5, promotion: null },
      { name: '초코바', price: 1200, quantity: 5, promotion: 'MD추천상품' },
      { name: '초코바', price: 1200, quantity: 5, promotion: null },
      { name: '에너지바', price: 2000, quantity: 5, promotion: null },
      { name: '정식도시락', price: 6400, quantity: 8, promotion: null },
      { name: '컵라면', price: 1700, quantity: 1, promotion: 'MD추천상품' },
      { name: '컵라면', price: 1700, quantity: 10, promotion: null },
    ]);
  });
});
