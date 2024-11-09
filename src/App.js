import MainController from './controllers/MainController.js';

class App {
  async run() {
    const main = new MainController();
    await main.start();
  }
}

export default App;
