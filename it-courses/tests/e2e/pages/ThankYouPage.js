const { BasePage } = require('./BasePage');

class ThankYouPage extends BasePage {
  constructor(page) {
    super(page);
    this.heading = page.locator('.checkout__success-title');
  }

  async expectVisible() {
    await this.heading.waitFor({ state: 'visible' });
    await this.page.waitForURL('**/thank-you');
  }
}

module.exports = { ThankYouPage };
