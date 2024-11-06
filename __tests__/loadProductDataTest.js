import fs from 'fs/promises';
import path from 'path';

export const loadProductData = async (filePath) => {
  const data = await fs.readFile(filePath, 'utf-8');
  const lines = data.trim().split('\n').slice(1);
  return lines.map((line) => {
    const [name, price, quantity, promotion] = line
      .split(',')
      .map((value) => value.trim());
    return {
      name,
      price: parseInt(price, 10),
      quantity: parseInt(quantity, 10),
      promotion: promotion === 'null' ? null : promotion,
    };
  });
};

describe('loadProductData() 함수 테스트', () => {
  test('상품 목록이 정상적으로 불러와지는지 확인', async () => {
    const filePath = path.resolve(__dirname, '../public/products.md');
    const products = await loadProductData(filePath);

    expect(products).toEqual([
      { name: '콜라', price: 1000, quantity: 10, promotion: '탄산2+1' },
      { name: '콜라', price: 1000, quantity: 10, promotion: null },
      { name: '사이다', price: 1000, quantity: 8, promotion: '탄산2+1' },
      { name: '사이다', price: 1000, quantity: 7, promotion: null },
      { name: '오렌지주스', price: 1800, quantity: 9, promotion: 'MD추천상품' },
      { name: '탄산수', price: 1200, quantity: 5, promotion: '탄산2+1' },
      { name: '물', price: 500, quantity: 10, promotion: null },
      { name: '비타민워터', price: 1500, quantity: 6, promotion: null },
      { name: '감자칩', price: 1500, quantity: 5, promotion: '반짝할인' },
      { name: '감자칩', price: 1500, quantity: 5, promotion: null },
      { name: '초코바', price: 1200, quantity: 5, promotion: 'MD추천상품' },
      { name: '초코바', price: 1200, quantity: 5, promotion: null },
      { name: '에너지바', price: 2000, quantity: 5, promotion: null },
      { name: '정식도시락', price: 6400, quantity: 8, promotion: null },
      { name: '컵라면', price: 1700, quantity: 1, promotion: 'MD추천상품' },
      { name: '컵라면', price: 1700, quantity: 10, promotion: null },
    ]);
  });
});
