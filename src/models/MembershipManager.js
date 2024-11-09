class MembershipManager {
  #maxDiscount = 8000;
  #discountRate = 0.3;

  /**
   * 프로모션 미적용 금액에 대해 멤버십 할인을 계산하여 반환
   * 최대 할인 한도는 8,000원
   * @param {number} remainingAmount - 프로모션 적용 후 남은 결제 금액
   * @returns {number} - 멤버십 할인이 적용된 금액
   * 주석 나중에 지우기
   */
  calculateMembershipDiscount(remainingAmount) {
    const discountAmount = Math.floor(remainingAmount * this.#discountRate);
    return Math.min(discountAmount, this.#maxDiscount);
  }
}

export default MembershipManager;
