import { MissionUtils } from '@woowacourse/mission-utils';
import MESSAGES from '../constants/Message.js';

const InputView = {
  async readItem() {
    const input = await MissionUtils.Console.readLineAsync(
      MESSAGES.INPUT.PURCHASE_ITEMS,
    );

    const items = input
      .trim()
      .match(/\[(.*?)\]/g)
      .map((item) => {
        const [name, quantity] = item
          .replace(/[\[\]]/g, '')
          .split('-')
          .map((value) => value.trim());
        if (!name || isNaN(quantity)) {
          throw new Error(MESSAGES.ERROR.IS_NOT_FORMAT);
        }
        return { name, quantity: parseInt(quantity, 10) };
      });
    return items;
  },

  async readAdditionalQuantity() {
    const input = await MissionUtils.Console.readLineAsync(
      MESSAGES.INPUT.ADD_QUANTITY,
    );

    const answer = input.trim().toUpperCase();
    if (answer === 'Y' || answer === 'N') {
      return answer === 'Y';
    }

    throw new Error(MESSAGES.ERROR.NOT_Y_OR_N);
  },

  async readMembershipDiscount() {
    const input = await MissionUtils.Console.readLineAsync(
      MESSAGES.INPUT.IS_MEMBERSHIP,
    );

    const answer = input.trim().toUpperCase();
    if (answer === 'Y' || answer === 'N') {
      return answer === 'Y';
    }
    throw new Error(MESSAGES.ERROR.NOT_Y_OR_N);
  },

  async readPromotionAddConfirmation(productName, additionalQuantity) {
    const message = MESSAGES.INPUT.ADD_PROMOTION_CONFIRMATION.replace(
      '${productName}',
      productName,
    ).replace('${additionalQuantity}', additionalQuantity);

    const input = await MissionUtils.Console.readLineAsync(message);

    const answer = input.trim().toUpperCase();
    if (answer === 'Y' || answer === 'N') {
      return answer === 'Y';
    }
    throw new Error(MESSAGES.ERROR.NOT_Y_OR_N);
  },

  async readRegularPriceConfirmation(productName, quantity) {
    const message = MESSAGES.INPUT.REGULAR_PRICE_CONFIRMATION.replace(
      '${productName}',
      productName,
    ).replace('${quantity}', quantity);

    const input = await MissionUtils.Console.readLineAsync(message);

    const answer = input.trim().toUpperCase();
    if (answer === 'Y' || answer === 'N') {
      return answer === 'Y';
    }
    throw new Error(MESSAGES.ERROR.NOT_Y_OR_N);
  },
};

export default InputView;
