import Cart from '../src/models/Cart.js';
import InputView from '../src/views/InputView.js';
import { MissionUtils } from '@woowacourse/mission-utils';

jest.mock('../src/views/InputView.js');

const mockNowDate = (date) => {
  jest.spyOn(MissionUtils.DateTimes, 'now').mockReturnValue(new Date(date));
};

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
          return {
            buy: 2,
            get: 1,
            start_date: '2024-06-01',
            end_date: '2024-12-31',
          };
        }
        return null;
      }),
      isWithinPromotionPeriod: jest.fn((startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return (
          MissionUtils.DateTimes.now() >= start &&
          MissionUtils.DateTimes.now() <= end
        );
      }),
    };

    cart = new Cart(mockProductManager, mockPromotionManager);
    InputView.readPromotionAddConfirmation.mockResolvedValue(true);
    InputView.readRegularPriceConfirmation.mockResolvedValue(true);
  });

  test('addItem() 메서드가 프로모션에 따라 상품을 올바르게 추가하고 할인을 반영하는지 확인', async () => {
    mockNowDate('2024-06-01');
    await cart.addItem('콜라', 2);
    const receiptData = cart.generateReceiptData();

    expect(receiptData.itemsDetails).toEqual([
      { name: '콜라', quantity: 3, total: 3000 },
    ]);
    expect(receiptData.promotionsDetails).toEqual([
      { name: '콜라', quantity: 1 },
    ]);
    expect(cart.calculateFinalAmount()).toBe(2000);
  });

  test('calculateFinalAmount()가 멤버십 할인 없이 프로모션 할인 금액을 올바르게 반영하는지 확인', async () => {
    mockNowDate('2024-06-01');
    await cart.addItem('콜라', 2);
    await cart.addItem('사이다', 1);

    const finalAmountWithoutMembership = cart.calculateFinalAmount(false);
    expect(finalAmountWithoutMembership).toBe(3000);
  });

  test('프로모션이 유효하지 않은 경우에 대한 처리 확인', async () => {
    mockNowDate('2024-01-01'); // 프로모션이 유효하지 않은 날짜 설정
    await cart.addItem('콜라', 2);

    const receiptData = cart.generateReceiptData();
    expect(receiptData.itemsDetails).toEqual([
      { name: '콜라', quantity: 2, total: 2000 },
    ]);
    expect(receiptData.promotionsDetails).toEqual([]);
    expect(cart.calculateFinalAmount()).toBe(2000); // 프로모션 할인 없음
  });

  test('calculateFinalAmount()가 멤버십 할인이 적용된 최종 결제 금액을 올바르게 계산하는지 확인', async () => {
    mockNowDate('2024-06-01');
    await cart.addItem('콜라', 2);
    await cart.addItem('사이다', 3);

    const finalAmountWithMembership = cart.calculateFinalAmount(true);
    expect(finalAmountWithMembership).toBe(3500);
  });
});
