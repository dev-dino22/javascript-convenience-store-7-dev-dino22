import fs from 'fs';

const PROMOTION_FILE_PATH = './public/promotions.md';

const readFileContent = (filePath) => {
  const data = fs.readFileSync(filePath, 'utf-8');
  return data.trim().split('\n').slice(1);
};

const parsePromotionLine = (line) => {
  const [name, buy, get, start_date, end_date] = line
    .split(',')
    .map((value) => value.trim());
  return {
    name,
    buy: parseInt(buy, 10),
    get: parseInt(get, 10),
    start_date,
    end_date,
  };
};

export const loadPromotionData = () => {
  const lines = readFileContent(PROMOTION_FILE_PATH);
  return lines.map(parsePromotionLine);
};
