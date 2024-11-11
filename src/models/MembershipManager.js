class MembershipManager {
  #maxDiscount = 8000;
  #discountRate = 0.3;

  calculateMembershipDiscount(remainingAmount) {
    const discountAmount = Math.floor(remainingAmount * this.#discountRate);
    return Math.min(discountAmount, this.#maxDiscount);
  }
}

export default MembershipManager;
