import { Console } from '@woowacourse/mission-utils';
import MESSAGES from '../constants/Message.js';

const OutputView = {
  formatPrice(price) {
    return new Intl.NumberFormat('ko-KR').format(price);
  },

  formatDiscountPrice(price) {
    return `-${new Intl.NumberFormat('ko-KR').format(price)}`;
  },

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
    this.printHeader();
    this.printItems(receiptData.itemsDetails);
    this.printPromotions(receiptData.promotionsDetails);
    this.printSummary(receiptData);
  },

  printHeader() {
    Console.print(MESSAGES.RECEIPT.TITLE);
    Console.print(
      `${'상품명'.padEnd(16)}${'수량'.padStart(6)}${'금액'.padStart(8)}`,
    );
  },

  printItems(itemsDetails) {
    itemsDetails.forEach((item) => {
      const itemText = `${item.name.padEnd(16)}${String(item.quantity).padStart(6)}${this.formatPrice(item.total).padStart(12)}`;
      Console.print(itemText);
    });
  },

  printPromotions(promotionsDetails) {
    Console.print(MESSAGES.RECEIPT.PROMOTION_HEADER);

    if (promotionsDetails.length === 0) {
      Console.print(MESSAGES.RECEIPT.NO_PROMOTION);
      return;
    }

    promotionsDetails.forEach((item) => {
      const promotionText = `${item.name.padEnd(16)}${String(item.quantity).padStart(6)}`;
      Console.print(promotionText);
    });
  },

  printSummary({
    totalAmountWithoutDiscounts,
    totalDiscountAmount,
    membershipDiscount,
    finalAmount,
    totalQuantity,
  }) {
    Console.print(MESSAGES.RECEIPT.DIVIDER);

    const summaryTexts = [
      `${'총구매액'.padEnd(16)}${String(totalQuantity).padStart(5)}${this.formatPrice(totalAmountWithoutDiscounts).padStart(12)}`,
      `${'행사할인'.padEnd(16)}${this.formatDiscountPrice(totalDiscountAmount).padStart(17)}`,
      `${'멤버십할인'.padEnd(16)}${this.formatDiscountPrice(membershipDiscount).padStart(16)}`,
      `${'내실돈'.padEnd(16)}${this.formatPrice(finalAmount).padStart(18)}`,
    ];

    summaryTexts.forEach((text) => Console.print(text));
  },
};

export default OutputView;
