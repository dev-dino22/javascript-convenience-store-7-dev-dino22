import { MissionUtils } from '@woowacourse/mission-utils';
import MESSAGES from '../constants/Message.js';
import { parseYesNoInput, parseItems } from '../utils/parseInput.js';

const InputView = {
  async readItem() {
    const input = await MissionUtils.Console.readLineAsync(
      MESSAGES.INPUT.PURCHASE_ITEMS,
    );
    return parseItems(input);
  },

  async readAdditionalQuantity() {
    const input = await MissionUtils.Console.readLineAsync(
      MESSAGES.INPUT.ADD_QUANTITY,
    );
    return parseYesNoInput(input);
  },

  async readMembershipDiscount() {
    const input = await MissionUtils.Console.readLineAsync(
      MESSAGES.INPUT.IS_MEMBERSHIP,
    );
    return parseYesNoInput(input);
  },

  async readPromotionAddConfirmation(productName, additionalQuantity) {
    const message = MESSAGES.INPUT.ADD_PROMOTION_CONFIRMATION.replace(
      '${productName}',
      productName,
    ).replace('${additionalQuantity}', additionalQuantity);

    const input = await MissionUtils.Console.readLineAsync(message);
    return parseYesNoInput(input);
  },

  async readRegularPriceConfirmation(productName, quantity) {
    const message = MESSAGES.INPUT.REGULAR_PRICE_CONFIRMATION.replace(
      '${productName}',
      productName,
    ).replace('${quantity}', quantity);

    const input = await MissionUtils.Console.readLineAsync(message);
    return parseYesNoInput(input);
  },
};

export default InputView;
