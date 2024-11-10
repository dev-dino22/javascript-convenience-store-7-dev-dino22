import Cart from '../src/models/Cart.js';
import InputView from '../src/views/InputView.js';

jest.mock('../src/views/InputView.js'); // InputView 모듈 모킹

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
      getPromotionDetails: jest.fn((promotionName) => {
        if (promotionName === 'PROMO1') {
          return { buy: 2, get: 1 }; // 2+1 프로모션
        }
        return null;
      }),
    };

    cart = new Cart(mockProductManager, mockPromotionManager);
  });

  beforeEach(() => {
    // 프로모션 추가 여부를 묻는 비동기 입력을 항상 'Y'로 응답하게 모킹
    InputView.readPromotionAddConfirmation.mockResolvedValue(true);
  });

  test('addItem() 메서드가 프로모션에 따라 상품을 올바르게 추가하고 할인을 반영하는지 확인', async () => {
    await cart.addItem('콜라', 2); // 콜라 2개 구매하면 프로모션으로 1개 추가
    const receiptData = cart.generateReceiptData();

    expect(receiptData.itemsDetails).toEqual([
      { name: '콜라', quantity: 3, total: 3000 }, // 콜라 2개 구매 + 1개 프로모션
    ]);
    expect(receiptData.promotionsDetails).toEqual([
      { name: '콜라', quantity: 1 }, // 증정된 1개의 콜라
    ]);
    expect(cart.calculateFinalAmount()).toBe(2000); // 최종 결제 금액 (할인 1000원 적용)
  });

  test('calculateFinalAmount()가 멤버십 할인 없이 프로모션 할인 금액을 올바르게 반영하는지 확인', async () => {
    await cart.addItem('콜라', 2); // 콜라 프로모션 적용
    await cart.addItem('사이다', 1); // 사이다는 프로모션 없음

    const finalAmountWithoutMembership = cart.calculateFinalAmount(false);
    expect(finalAmountWithoutMembership).toBe(3000); // 콜라 3개(3000) + 사이다 1개(1000) - 할인 1000
  });

  test('calculateFinalAmount()가 멤버십 할인이 적용된 최종 결제 금액을 올바르게 계산하는지 확인', async () => {
    // 콜라와 사이다 모두 2+1 프로모션이 적용되어야 함
    await cart.addItem('콜라', 2); // 콜라 2개 구매하면 1개 추가
    await cart.addItem('사이다', 3); // 사이다 3개 구매하면 1개 추가

    const finalAmountWithMembership = cart.calculateFinalAmount(true);

    // 총 구매액: 콜라(1000 * 3) + 사이다(1000 * 4) = 7000원
    // 행사할인: 콜라 1개(1000) + 사이다 1개(1000) = 2000원
    // 멤버십 할인: (7000 - 2000) * 30% = 1500원
    // 최종 결제 금액: 7000 - 2000 - 1500 = 3500원
    expect(finalAmountWithMembership).toBe(3500);
  });

  test('generateReceiptData()가 올바른 영수증 데이터를 생성하는지 확인', async () => {
    await cart.addItem('콜라', 2); // 콜라 프로모션 적용
    await cart.addItem('사이다', 2); // 사이다는 프로모션 없음

    const receiptData = cart.generateReceiptData(true);

    // 영수증의 아이템 및 프로모션 항목 확인
    expect(receiptData.itemsDetails).toEqual([
      { name: '콜라', quantity: 3, total: 3000 }, // 콜라 2개 구매 + 1개 프로모션
      { name: '사이다', quantity: 2, total: 2000 }, // 사이다 2개
    ]);
    expect(receiptData.promotionsDetails).toEqual([
      { name: '콜라', quantity: 1 }, // 콜라 1개 증정
    ]);

    // 총 구매액, 행사 할인, 멤버십 할인, 내실 돈을 올바르게 계산하는지 확인
    expect(receiptData.totalAmountWithoutDiscounts).toBe(5000);
    expect(receiptData.totalDiscountAmount).toBe(1000);
    expect(receiptData.membershipDiscount).toBe(1200); // 멤버십 할인 30%
    expect(receiptData.finalAmount).toBe(2800); // 총 결제 금액
  });
});
