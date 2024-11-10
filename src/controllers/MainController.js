import ProductManager from '../models/ProductManager.js';
import PromotionManager from '../models/PromotionManager.js'; // PromotionManager 추가
import Cart from '../models/Cart.js';
import InputView from '../views/InputView.js';
import OutputView from '../views/OutputView.js';

class MainController {
  #productManager;
  #promotionManager;
  #cart;

  constructor() {
    this.#productManager = new ProductManager();
    this.#promotionManager = new PromotionManager();
    this.#cart = new Cart(this.#productManager, this.#promotionManager);
  }

  async start() {
    let continueShopping = true;

    while (continueShopping) {
      this.#cart.resetCart();
      OutputView.printHello();
      await this.displayProducts();

      try {
        // Step 1: 장바구니에 상품 추가
        await this.addCart();

        // Step 2: 멤버십 할인 적용 여부 확인 및 영수증 출력
        const isMembership = await InputView.readMembershipDiscount();
        const receiptData = this.#cart.generateReceiptData(isMembership);
        OutputView.printReceipt(receiptData);

        // Step 3: 영수증 출력 후 재고 차감
        this.#cart.deductAllItemsStock();
      } catch (error) {
        OutputView.printError(error.message);
        continue;
      }

      // 추가 구매 여부 확인
      continueShopping = await InputView.readAdditionalQuantity();
    }
  }

  async displayProducts() {
    const formattedProducts = this.#productManager.formatProductsInfo();
    OutputView.printProducts(formattedProducts);
  }

  async addCart() {
    const itemsToBuy = await InputView.readItem();
    this.#productManager.checkProductStock(itemsToBuy);

    for (const { name, quantity } of itemsToBuy) {
      await this.#cart.addItem(name, quantity); // 인자 간소화된 addItem 호출
    }
  }
}

export default MainController;
