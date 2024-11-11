import ProductManager from '../src/models/ProductManager.js';
import InputView from '../src/views/InputView.js';

jest.mock('../src/views/InputView.js'); // 사용자 입력을 모의 처리하기 위해 사용

describe('ProductManager 단위 테스트', () => {
  let productManager;

  beforeEach(() => {
    productManager = new ProductManager();
    jest.clearAllMocks();
  });

  test('구매하려는 상품의 재고가 충분한지 확인 (재고가 충분한 경우)', () => {
    const itemsToBuy = [{ name: '물', quantity: 10 }];
    expect(() => productManager.checkProductStock(itemsToBuy)).not.toThrow();
  });

  test('구매하려는 상품의 재고가 충분한지 확인 (재고가 부족한 경우)', () => {
    const itemsToBuy = [{ name: '물', quantity: 20 }];
    expect(() => productManager.checkProductStock(itemsToBuy)).toThrowError(
      '[ERROR] 재고 수량을 초과하여 구매할 수 없습니다. 다시 입력해 주세요.',
    );
  });

  test('프로모션 재고가 충분할 경우 handlePromotionStock() 메서드가 true 반환', async () => {
    const result = await productManager.handlePromotionStock('사이다', 2);
    expect(result).toBe(true);
  });

  test('프로모션 재고가 부족하고 사용자가 프로모션 없이 구매 거부 시 handlePromotionStock() 메서드가 false 반환', async () => {
    InputView.readRegularPriceConfirmation.mockResolvedValue(false);
    const result = await productManager.handlePromotionStock('사이다', 20);
    expect(result).toBe(false);
    expect(InputView.readRegularPriceConfirmation).toHaveBeenCalled();
  });

  test('프로모션 재고가 부족하더라도 사용자가 프로모션 없이 구매를 진행할 경우 handlePromotionStock() 메서드가 true 반환', async () => {
    InputView.readRegularPriceConfirmation.mockResolvedValue(true);
    const result = await productManager.handlePromotionStock('사이다', 20);
    expect(result).toBe(true);
    expect(InputView.readRegularPriceConfirmation).toHaveBeenCalled();
  });

  test('재고가 정상적으로 차감되고, 부족 시 오류 발생', () => {
    const productName = '물';
    const initialStock = 10;
    const quantityToDeduct = 1;

    for (let i = 0; i < initialStock; i++) {
      expect(() =>
        productManager.deductStock(productName, quantityToDeduct),
      ).not.toThrow();
    }

    expect(() =>
      productManager.deductStock(productName, quantityToDeduct),
    ).toThrow('[ERROR] 재고가 부족합니다.');
  });

  test('상품 정보를 문자열로 가공하여 반환하는지 확인', () => {
    const formattedInfo = productManager.formatProductsInfo();
    expect(formattedInfo).toContain('- 물');
    expect(formattedInfo).toMatch(/\d+원 \d+개/);
  });
});
