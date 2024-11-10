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
      this.cart.resetCart();
      OutputView.printHello();
      await this.displayProducts();

      try {
        // Step 1: 장바구니에 상품 추가
        await this.addCart();

        // Step 2: 멤버십 할인 적용 여부 확인 및 영수증 출력
        const isMembership = await InputView.readMembershipDiscount();
        const receiptData = this.cart.generateReceiptData(isMembership);
        OutputView.printReceipt(receiptData);

        // Step 3: 영수증 출력 후 재고 차감
        this.cart.deductAllItemsStock(this.productManager);
      } catch (error) {
        OutputView.printError(error.message);
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

  // MainController의 addCart 메서드 수정
  async addCart() {
    const itemsToBuy = await InputView.readItem();
    this.productManager.checkProductStock(itemsToBuy);

    for (const { name, quantity } of itemsToBuy) {
      const { price, promotionName, availablePromotionalStock } =
        this.productManager.returnProductDetails(name);

      // 장바구니에 추가
      this.cart.addItem(
        name,
        price,
        quantity,
        availablePromotionalStock,
        promotionName,
      );
    }
  }
}

export default MainController;
