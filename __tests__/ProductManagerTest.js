import ProductManager from '../src/models/ProductManager.js';

describe('ProductManager 단위 테스트', () => {
  let productManager;
  beforeEach(() => {
    productManager = new ProductManager();
  });

  test('구매하려는 상품의 재고가 충분한지 확인 (재고가 충분한 경우)', () => {
    expect(productManager.checkProductstock('물', 10)).toBe(true);
  });

  test('구매하려는 상품의 재고가 충분한지 확인 (재고가 부족한 경우)', () => {
    expect(productManager.checkProductstock('물', 20)).toBe(false);
  });
});
