const { BasePage } = require('./BasePage');

class CourseDetailPage extends BasePage {
  constructor(page) {
    super(page);
    this.title = page.locator('#courseTitle');
    this.buyButton = page.locator('#buyButton');
    this.price = page.locator('#coursePriceValue');
  }

  async waitForLoaded() {
    await this.page.waitForFunction(() => {
      const el = document.getElementById('courseTitle');
      return el && el.textContent && el.textContent !== 'Course Title';
    }, { timeout: 15000 });
  }

  async clickBuy() {
    await this.buyButton.click();
  }
}

module.exports = { CourseDetailPage };
