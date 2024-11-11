const deepFreeze = (obj) => {
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      deepFreeze(obj[key]);
    }
  });
  return Object.freeze(obj);
};

const MESSAGES = deepFreeze({
  INFO: {
    HELLO: '안녕하세요. W편의점입니다.',
    PRODUCT_LIST_HEADER: '현재 보유하고 있는 상품입니다.',
    LINE_BREAK: '',
  },
  ERROR: {
    INSUFFICIENT_STOCK:
      '[ERROR] 재고 수량을 초과하여 구매할 수 없습니다. 다시 입력해 주세요.',
    INSUFFICIENT_PROMOTION_STOCK: '[ERROR] 프로모션 재고가 부족합니다.',
  },
  RECEIPT: {
    TITLE: '==============W 편의점================',
    ITEM_HEADER: '상품명수량금액',
    PROMOTION_HEADER: '================증정==================',
    NO_PROMOTION: '없음',
    ITEM_ROW: '{name}{quantity}{total}',
    PROMOTION_ROW: '{name}{quantity}',
    TOTAL_AMOUNT: '총구매액{totalQuantity}{totalAmount}',
    PROMOTION_DISCOUNT: '행사할인-{discountAmount}',
    MEMBERSHIP_DISCOUNT: '멤버십할인-{membershipDiscount}',
    FINAL_AMOUNT: '내실돈{finalAmount}',
    DIVIDER: '======================================',
  },
});

export default MESSAGES;
