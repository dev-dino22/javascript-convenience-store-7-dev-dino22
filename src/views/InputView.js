import { Console } from '@woowacourse/mission-utils';

const InputView = {
  async readItem() {
    const input = await Console.readLineAsync(
      '구매하실 상품명과 수량을 입력해 주세요. (예: [사이다-2],[감자칩-1])',
    );
    try {
      const items = input
        .trim()
        .match(/\[(.*?)\]/g) // 대괄호로 묶인 부분을 추출
        .map((item) => {
          const [name, quantity] = item
            .replace(/[\[\]]/g, '') // 대괄호 제거
            .split('-')
            .map((value) => value.trim());
          if (!name || isNaN(quantity)) {
            throw new Error(
              '[ERROR] 올바르지 않은 형식으로 입력했습니다. 다시 입력해 주세요.',
            );
          }
          return { name, quantity: parseInt(quantity, 10) };
        });
      return items;
    } catch (error) {
      Console.print(error.message);
      return this.readItem();
    }
  },
};

export default InputView;
