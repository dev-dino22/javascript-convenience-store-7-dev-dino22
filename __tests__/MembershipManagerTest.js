import MembershipManager from '../src/models/MembershipManager.js';

describe('MembershipManager 단위 테스트', () => {
  let membershipManager;

  beforeEach(() => {
    membershipManager = new MembershipManager();
  });

  test('할인 금액이 최대 한도 8,000원을 초과하지 않도록 한다', () => {
    const remainingAmount = 50000;
    const discount =
      membershipManager.calculateMembershipDiscount(remainingAmount);
    expect(discount).toBe(8000);
  });

  test('할인 금액이 남은 결제 금액의 30%인 경우', () => {
    const remainingAmount = 20000;
    const discount =
      membershipManager.calculateMembershipDiscount(remainingAmount);
    expect(discount).toBe(6000);
  });

  test('작은 금액에 대한 멤버십 할인이 제대로 적용되는지 확인', () => {
    const remainingAmount = 10000;
    const discount =
      membershipManager.calculateMembershipDiscount(remainingAmount);
    expect(discount).toBe(3000);
  });

  test('결제 금액이 0일 때 할인 금액이 0이어야 한다', () => {
    const remainingAmount = 0;
    const discount =
      membershipManager.calculateMembershipDiscount(remainingAmount);
    expect(discount).toBe(0);
  });

  test('할인 금액이 최대 한도 이하일 경우 정상적으로 30% 할인이 적용되는지 확인', () => {
    const remainingAmount = 26000;
    const discount =
      membershipManager.calculateMembershipDiscount(remainingAmount);
    expect(discount).toBe(7800);
  });
});
