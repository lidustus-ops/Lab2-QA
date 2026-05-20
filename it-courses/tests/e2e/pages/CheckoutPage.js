const { BasePage } = require('./BasePage');

class CheckoutPage extends BasePage {
  constructor(page) {
    super(page);
    this.form = page.locator('#checkoutForm');
    this.email = page.locator('#email');
    this.phone = page.locator('#phone');
    this.courseName = page.locator('#courseName');
    this.cardNumber = page.locator('#cardNumber');
    this.submit = page.locator('button[type="submit"]');
  }

  async open() {
    await this.goto('/checkout');
    await this.form.waitFor();
  }

  /**
   * @param {{ email: string, phone: string, courseName: string, cardNumber: string }} data
   */
  async fillAndSubmit(data) {
    await this.email.fill(data.email);
    await this.phone.fill(data.phone);
    await this.courseName.fill(data.courseName);
    await this.cardNumber.fill(data.cardNumber);
    await this.submit.click();
  }
}

module.exports = { CheckoutPage };
