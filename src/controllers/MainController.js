import InputView from '../views/InputView.js';
import OutputView from '../views/OutputView.js';
import ProductManager from '../models/ProductManager.js';
import Cart from '../models/Cart.js';

class MainController {
  constructor() {
    this.productManager = new ProductManager();
    this.cart = new Cart();
  }

  async start() {
    let continueShopping = true;

    while (continueShopping) {
      OutputView.printHello();
      await this.displayProducts();

      try {
        // Step: 장바구니에 상품 추가
        await this.addCart();
        const isMembership = await InputView.readMembershipDiscount();
        const receiptData = this.cart.generateReceiptData(isMembership);
        OutputView.printReceipt(receiptData);
      } catch (error) {
        OutputView.printError(error);
        continue;
      }

      // 추가 구매 여부 확인
      continueShopping = await InputView.readAdditionalQuantity();
    }
  }

  async displayProducts() {
    const formattedProducts = this.productManager.formatProductsInfo();
    OutputView.printProducts(formattedProducts);
  }

  async addCart() {
    // Step 1: 상품명과 수량을 입력받기
    const itemsToBuy = await InputView.readItem();
    this.productManager.checkProductStock(itemsToBuy);

    // Step 2: 장바구니 추가
    itemsToBuy.forEach(({ name, quantity }) => {
      // 2.1 상품의 가격과 프로모션 재고를 ProductManager에서 조회
      const { price, availablePromotionalStock, promotion } =
        this.productManager.returnProductDetails(name);

      // 2.2 Cart에 상품 추가, 필요시 프로모션 적용
      this.cart.addItem(name, price, quantity, availablePromotionalStock);
    });
  }
}

export default MainController;