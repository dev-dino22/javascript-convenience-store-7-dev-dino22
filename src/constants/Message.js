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
    INSUFFICIENT_STOCK: '[ERROR] 재고가 부족합니다.',
    INSUFFICIENT_PROMOTION_STOCK: '[ERROR] 프로모션 재고가 부족합니다.',
  },
});

export default MESSAGES;
