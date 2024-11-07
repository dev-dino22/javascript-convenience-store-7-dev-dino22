import fs from 'fs/promises';

const PRODUCTS_FILE_PATH = './public/products.md';

const readFileContent = async (filePath) => {
  const data = await fs.readFile(filePath, 'utf-8');
  return data.trim().split('\n').slice(1);
};

const parsePromotion = (promotion) => {
  if (promotion === 'null') {
    return null;
  }
  return promotion;
};

const parseProductLine = (line) => {
  const [name, price, quantity, promotion] = line
    .split(',')
    .map((value) => value.trim());
  return {
    name,
    price: parseInt(price, 10),
    quantity: parseInt(quantity, 10),
    promotion: parsePromotion(promotion),
  };
};

export const loadProductData = async () => {
  const lines = await readFileContent(PRODUCTS_FILE_PATH);
  return lines.map(parseProductLine);
};
