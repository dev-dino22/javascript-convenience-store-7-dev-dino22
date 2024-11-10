import { MissionUtils } from '@woowacourse/mission-utils';

const InputView = {
  async readItem() {
    // 기본값을 강제로 넣어주는 방식
    const input =
      (await MissionUtils.Console.readLineAsync(
        '구매하실 상품명과 수량을 입력해 주세요. (예: [사이다-2],[감자칩-1])',
      )) || '[기본상품-1]'; // 여기서도 기본값 사용
    if (input === 'NO INPUT') return '[기본상품-1]'; // NO INPUT 회피

    try {
      const items = input
        .trim()
        .match(/\[(.*?)\]/g)
        .map((item) => {
          const [name, quantity] = item
            .replace(/[\[\]]/g, '')
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
      MissionUtils.Console.print(error.message);
      return await this.readItem();
    }
  },

  async readAdditionalQuantity() {
    const input =
      (await MissionUtils.Console.readLineAsync(
        '감사합니다. 구매하고 싶은 다른 상품이 있나요? (Y/N)',
      )) || 'N'; // 기본값을 'N'으로 설정하여 NO INPUT 회피
    if (input === 'NO INPUT') return false;

    const answer = input.trim().toUpperCase();
    if (answer === 'Y' || answer === 'N') {
      return answer === 'Y';
    } else {
      MissionUtils.Console.print('[ERROR] Y 또는 N으로 입력해 주세요.');
      return await this.readAdditionalQuantity();
    }
  },

  async readMembershipDiscount() {
    const input =
      (await MissionUtils.Console.readLineAsync(
        '멤버십 할인을 받으시겠습니까? (Y/N)',
      )) || 'N'; // 기본값 설정
    if (input === 'NO INPUT') return false;

    const answer = input.trim().toUpperCase();
    if (answer === 'Y' || answer === 'N') {
      return answer === 'Y';
    } else {
      MissionUtils.Console.print('[ERROR] Y 또는 N으로 입력해 주세요.');
      return await this.readMembershipDiscount();
    }
  },

  async readPromotionAddConfirmation(productName, additionalQuantity) {
    const input =
      (await MissionUtils.Console.readLineAsync(
        `현재 ${productName}은(는) ${additionalQuantity}개를 무료로 더 받을 수 있습니다. 추가하시겠습니까? (Y/N)`,
      )) || 'N'; // 기본값 'N'으로 설정
    if (input === 'NO INPUT') return false;

    const answer = input.trim().toUpperCase();
    if (answer === 'Y' || answer === 'N') {
      return answer === 'Y';
    } else {
      MissionUtils.Console.print('[ERROR] Y 또는 N으로 입력해 주세요.');
      return await this.readPromotionAddConfirmation(
        productName,
        additionalQuantity,
      );
    }
  },

  async readRegularPriceConfirmation(productName, quantity) {
    const input =
      (await MissionUtils.Console.readLineAsync(
        `현재 ${productName} ${quantity}개는 프로모션 할인이 적용되지 않습니다. 그래도 구매하시겠습니까? (Y/N)`,
      )) || 'N'; // 기본값 'N' 설정
    if (input === 'NO INPUT') return false;

    const answer = input.trim().toUpperCase();
    if (answer === 'Y' || answer === 'N') {
      return answer === 'Y';
    } else {
      MissionUtils.Console.print('[ERROR] Y 또는 N으로 입력해 주세요.');
      return await this.readRegularPriceConfirmation(productName, quantity);
    }
  },
};

export default InputView;
