import MESSAGES from '../constants/Message.js';

export const parseItems = (input) => {
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
};

export const parseYesNoInput = (input) => {
  const answer = input.trim().toUpperCase();
  if (answer === 'Y' || answer === 'N') {
    return answer === 'Y';
  }
  throw new Error(MESSAGES.ERROR.NOT_Y_OR_N);
};
