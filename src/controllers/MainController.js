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
    OutputView.printHello();
    await this.displayProducts();
  }

  async displayProducts() {
    const formattedProducts = this.productManager.formatProductsInfo();
    OutputView.printProducts(formattedProducts);
  }
}

export default MainController;
