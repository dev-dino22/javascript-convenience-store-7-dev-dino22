import { Console } from '@woowacourse/mission-utils';
import MESSAGES from '../constants/Message.js';

const OutputView = {
  printHello() {
    Console.print(MESSAGES.INFO.LINE_BREAK);
    Console.print(MESSAGES.INFO.HELLO);
  },
  printProducts(formattedProductsInfo) {
    Console.print(MESSAGES.INFO.PRODUCT_LIST_HEADER);
    Console.print(MESSAGES.INFO.LINE_BREAK);
    Console.print(formattedProductsInfo);
    Console.print(MESSAGES.INFO.LINE_BREAK);
  },
  printError(error) {
    Console.print(error);
  },
  printReceipt(receiptData) {
    const {
      itemsDetails,
      promotionsDetails,
      totalAmountWithoutDiscounts,
      totalDiscountAmount,
      membershipDiscount,
      finalAmount,
    } = receiptData;

    const itemsText = itemsDetails
      .map((item) => `${item.name}\t\t${item.quantity}\t${item.total}`)
      .join('\n');

    const promotionsText =
      promotionsDetails.length > 0
        ? promotionsDetails
            .map((item) => `${item.name}\t\t${item.quantity}`)
            .join('\n')
        : '없음';

    const receiptText = `
==============W 편의점================
상품명\t\t수량\t금액
${itemsText}
=============증정===============
${promotionsText}
====================================
총구매액\t\t\t${totalAmountWithoutDiscounts}
행사할인\t\t\t-${totalDiscountAmount}
멤버십할인\t\t\t-${membershipDiscount}
내실돈\t\t\t${finalAmount}
`;

    Console.print(receiptText);
  },
};

export default OutputView;
