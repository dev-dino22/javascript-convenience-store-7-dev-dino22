const MESSAGES = {
  INFO: {
    HELLO: '안녕하세요. W편의점입니다.',
    PRODUCT_LIST_HEADER: '현재 보유하고 있는 상품입니다.',
    LINE_BREAK: '',
  },
  ERROR: {
    INSUFFICIENT_STOCK:
      '[ERROR] 재고 수량을 초과하여 구매할 수 없습니다. 다시 입력해 주세요.',
    INSUFFICIENT_PROMOTION_STOCK: '[ERROR] 프로모션 재고가 부족합니다.',
    IS_NOT_FORMAT:
      '[ERROR] 올바르지 않은 형식으로 입력했습니다. 다시 입력해 주세요.',
    NOT_Y_OR_N: '[ERROR] Y 또는 N으로 입력해 주세요.',
    EMPTY_INPUT: '[ERROR] 입력값이 비었습니다.',
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
  INPUT: {
    ADD_QUANTITY: '감사합니다. 구매하고 싶은 다른 상품이 있나요? (Y/N)',
    IS_MEMBERSHIP: '멤버십 할인을 받으시겠습니까? (Y/N)',
    PURCHASE_ITEMS:
      '구매하실 상품명과 수량을 입력해 주세요. (예: [사이다-2],[감자칩-1])',
    REGULAR_PRICE_CONFIRMATION:
      '현재 ${productName} ${quantity}개는 프로모션 할인이 적용되지 않습니다. 그래도 구매하시겠습니까? (Y/N)',
    ADD_PROMOTION_CONFIRMATION:
      '현재 ${productName}은(는) ${additionalQuantity}개를 무료로 더 받을 수 있습니다. 추가하시겠습니까? (Y/N)',
  },
};

export default MESSAGES;
