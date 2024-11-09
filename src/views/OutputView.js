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
};

export default OutputView;
