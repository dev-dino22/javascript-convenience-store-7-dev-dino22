import OutputView from '../views/OutputView.js';

export const retryOnError = async (inputFunction) => {
  while (true) {
    try {
      return await inputFunction();
    } catch (error) {
      OutputView.printError(error.message);
    }
  }
};
