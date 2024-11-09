import ProductManager from '../src/models/ProductManager.js';

describe('ProductManager 단위 테스트', () => {
  let productManager;
  beforeEach(() => {
    productManager = new ProductManager();
  });

  test('구매하려는 상품의 재고가 충분한지 확인 (재고가 충분한 경우)', () => {
    expect(productManager.checkProductStock('물', 10)).toBe(true);
  });

  test('구매하려는 상품의 재고가 충분한지 확인 (재고가 부족한 경우)', () => {
    expect(productManager.checkProductStock('물', 20)).toBe(false);
  });

  test('재고가 정상적으로 차감되고, 부족 시 오류 발생', () => {
    const productName = '물';
    const initialStock = 10;
    const quantityToDeduct = 1;

    // 10번 차감 테스트
    for (let i = 0; i < initialStock; i++) {
      expect(() =>
        productManager.deductStock(productName, quantityToDeduct),
      ).not.toThrow();
    }

    // 11번째 차감 시 에러 발생
    expect(() =>
      productManager.deductStock(productName, quantityToDeduct),
    ).toThrow('[ERROR]');
  });
});