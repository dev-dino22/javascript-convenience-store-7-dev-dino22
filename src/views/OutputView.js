import { Console } from '@woowacourse/mission-utils';
import MESSAGES from '../constants/Message.js';

const OutputView = {
  formatPrice(price) {
    return new Intl.NumberFormat('ko-KR').format(price);
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
    Console.print(MESSAGES.RECEIPT.ITEM_HEADER);
  },

  printItems(itemsDetails) {
    itemsDetails.forEach((item) => {
      const itemText = MESSAGES.RECEIPT.ITEM_ROW.replace('{name}', item.name)
        .replace('{quantity}', item.quantity)
        .replace('{total}', this.formatPrice(item.total));
      Console.print(itemText);
    });
  },

  printPromotions(promotionsDetails) {
    Console.print(MESSAGES.RECEIPT.PROMOTION_HEADER);
    if (promotionsDetails.length > 0) {
      promotionsDetails.forEach((item) => {
        const promotionText = MESSAGES.RECEIPT.PROMOTION_ROW.replace(
          '{name}',
          item.name,
        ).replace('{quantity}', item.quantity);
        Console.print(promotionText);
      });
    } else {
      Console.print(MESSAGES.RECEIPT.NO_PROMOTION);
    }
  },

  printSummary({
    totalAmountWithoutDiscounts,
    totalDiscountAmount,
    membershipDiscount,
    finalAmount,
  }) {
    Console.print(MESSAGES.RECEIPT.DIVIDER);
    const summaryTexts = [
      MESSAGES.RECEIPT.TOTAL_AMOUNT.replace(
        '{totalAmount}',
        this.formatPrice(totalAmountWithoutDiscounts),
      ),
      MESSAGES.RECEIPT.PROMOTION_DISCOUNT.replace(
        '{discountAmount}',
        this.formatPrice(totalDiscountAmount),
      ),
      MESSAGES.RECEIPT.MEMBERSHIP_DISCOUNT.replace(
        '{membershipDiscount}',
        this.formatPrice(membershipDiscount),
      ),
      MESSAGES.RECEIPT.FINAL_AMOUNT.replace(
        '{finalAmount}',
        this.formatPrice(finalAmount),
      ),
    ];
    summaryTexts.forEach((text) => Console.print(text));
  },
};

export default OutputView;
