import ProductManager from '../models/ProductManager.js';
import PromotionManager from '../models/PromotionManager.js';
import Cart from '../models/Cart.js';
import InputView from '../views/InputView.js';
import OutputView from '../views/OutputView.js';
import { retryOnError } from '../utils/retryOnError.js';

class MainController {
  #productManager;
  #promotionManager;
  #cart;

  constructor() {
    this.#promotionManager = new PromotionManager();
    this.#productManager = new ProductManager(this.#promotionManager);
    this.#cart = new Cart(this.#productManager, this.#promotionManager);
  }

  async start() {
    let continueShopping = true;

    while (continueShopping) {
      this.#cart.resetCart();
      OutputView.printHello();
      await this.displayProducts();

      try {
        await this.addCart();

        const isMembership = await retryOnError(
          InputView.readMembershipDiscount,
        );
        const receiptData = this.#cart.generateReceiptData(isMembership);
        OutputView.printReceipt(receiptData);

        this.#cart.deductAllItemsStock();
      } catch (error) {
        OutputView.printError(error.message);
        continue;
      }
      continueShopping = await retryOnError(InputView.readAdditionalQuantity);
    }
  }

  async displayProducts() {
    const formattedProducts = this.#productManager.formatProductsInfo();
    OutputView.printProducts(formattedProducts);
  }

  async addCart() {
    const itemsToBuy = await retryOnError(InputView.readItem);
    this.#productManager.checkProductStock(itemsToBuy);

    for (const { name, quantity } of itemsToBuy) {
      await this.#cart.addItem(name, quantity);
    }
  }
}

export default MainController;
