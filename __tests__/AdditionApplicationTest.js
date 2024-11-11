import App from '../src/App.js';
import { MissionUtils } from '@woowacourse/mission-utils';
import { EOL as LINE_SEPARATOR } from 'os';

const mockQuestions = (inputs) => {
  const messages = [];

  MissionUtils.Console.readLineAsync = jest.fn((prompt) => {
    messages.push(prompt);
    const input = inputs.shift();

    if (input === undefined) {
      console.error('NO INPUT 발생! 현재 messages:', messages); // 디버그 메시지 추가
      throw new Error('NO INPUT');
    }

    return Promise.resolve(input);
  });

  MissionUtils.Console.readLineAsync.messages = messages;
};

const mockNowDate = (date = null) => {
  const mockDateTimes = jest.spyOn(MissionUtils.DateTimes, 'now');
  mockDateTimes.mockReturnValue(new Date(date));
  return mockDateTimes;
};

const getLogSpy = () => {
  const logSpy = jest.spyOn(MissionUtils.Console, 'print');
  logSpy.mockClear();
  return logSpy;
};

const getOutput = (logSpy) => {
  return [...logSpy.mock.calls].join(LINE_SEPARATOR);
};

const expectLogContains = (received, expects) => {
  expects.forEach((exp) => {
    expect(received).toContain(exp);
  });
};

const expectLogContainsWithoutSpacesAndEquals = (received, expects) => {
  const processedReceived = received.replace(/[\s=]/g, '');
  expects.forEach((exp) => {
    expect(processedReceived).toContain(exp);
  });
};

const runExceptions = async ({
  inputs = [],
  inputsToTerminate = [],
  expectedErrorMessage = '',
}) => {
  // given
  const logSpy = getLogSpy();
  mockQuestions([...inputs, ...inputsToTerminate]);

  // when
  const app = new App();
  await app.run();

  // then
  expect(logSpy).toHaveBeenCalledWith(
    expect.stringContaining(expectedErrorMessage),
  );
};

const run = async ({
  inputs = [],
  inputsToTerminate = [],
  expected = [],
  expectedIgnoringWhiteSpaces = [],
}) => {
  // given
  const logSpy = getLogSpy();
  mockQuestions([...inputs, ...inputsToTerminate]);

  // when
  const app = new App();
  await app.run();

  const output = getOutput(logSpy);

  // then
  if (expectedIgnoringWhiteSpaces.length > 0) {
    expectLogContainsWithoutSpacesAndEquals(
      output,
      expectedIgnoringWhiteSpaces,
    );
  }
  if (expected.length > 0) {
    expectLogContains(output, expected);
  }
};

const INPUTS_TO_TERMINATE = ['[비타민워터-1]', 'N', 'N'];

describe('편의점 프로모션 테스트', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  /*
  /* N+1 프로모션 테스트 케이스
  */

  test('N+1 프로모션: 2+1으로 설정된 제품을 3개 구매 시', async () => {
    await run({
      inputs: ['[탄산수-3]', 'N', 'N'], // 탄산수 2+1 프로모션
      expectedIgnoringWhiteSpaces: [
        '총구매액33,600', // 총수량 3
        '내실돈2,400',
        '행사할인-1,200',
      ],
    });
  });

  test('N+1 프로모션: 재고 부족으로 증정 불가능 시', async () => {
    await runExceptions({
      inputs: ['[탄산수-10]'],
      expectedErrorMessage:
        '[ERROR] 재고 수량을 초과하여 구매할 수 없습니다. 다시 입력해 주세요.',
      inputsToTerminate: ['[탄산수-3]', 'N', 'N'],
    });
  });

  test('N+1 프로모션: 콜라 2+1 프로모션에서 10개 구매 시 프로모션 부족으로 6개만 구매', async () => {
    await run({
      inputs: ['[콜라-10]', 'N', 'N', 'N'], // 콜라 2+1 프로모션, 프로모션 부족으로 일부 구매 제외
      expectedIgnoringWhiteSpaces: [
        '총구매액66,000', // 총수량 6 (증정 포함)
        '내실돈3,000',
        '행사할인-3,000',
      ],
    });
  });
  test('N+1 프로모션: 콜라 2+1 프로모션에서 10개 구매 시 프로모션 부족 시 정가로 구매 확인', async () => {
    await run({
      inputs: ['[콜라-10]', 'Y', 'N', 'N'], // 콜라 2+1 프로모션, 프로모션 부족으로 일부 정가 구매 확인 후 진행
      expectedIgnoringWhiteSpaces: [
        '총구매액1010,000', // 총수량 10 (증정 포함)
        '내실돈7,000',
        '행사할인-3,000',
      ],
    });
  });

  /*
  /* 1+1 프로모션 테스트 케이스
  */
  test('1+1 프로모션: 제품을 1개 구매 시 추가 증정 물어보고 추가하지 않을 때', async () => {
    await run({
      inputs: ['[초코바-1]', 'N', 'N', 'N'],
      expectedIgnoringWhiteSpaces: [
        '총구매액11,200',
        '내실돈1,200',
        '행사할인-0',
      ],
    });
  });

  test('1+1 프로모션: 제품을 1개 구매 시 추가 증정 물어보고 추가할 때', async () => {
    await run({
      inputs: ['[초코바-1]', 'Y', 'N', 'N'], // 초코바 1+1 프로모션
      expectedIgnoringWhiteSpaces: [
        '총구매액22,400',
        '내실돈1,200',
        '행사할인-1,200',
      ],
    });
  });

  test('1+1 프로모션: 제품을 2개 구매 시 자동으로 1개 증정', async () => {
    await run({
      inputs: ['[초코바-2]', 'N', 'N'],
      expectedIgnoringWhiteSpaces: [
        '총구매액22,400',
        '내실돈1,200',
        '행사할인-1,200',
      ],
    });
  });

  test('1+1 프로모션: 재고 부족으로 인해 증정 불가능할 때', async () => {
    await run({
      inputs: ['[초코바-5]', 'Y', 'N', 'N'], // 재고 부족으로 증정 불가 상황
      expectedIgnoringWhiteSpaces: [
        '총구매액56,000',
        '행사할인-2,400',
        '내실돈3,600',
      ],
    });
  });
});
