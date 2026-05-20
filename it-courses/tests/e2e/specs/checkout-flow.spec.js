// @ts-check
const { test, expect } = require('@playwright/test');
const { CatalogPage } = require('../pages/CatalogPage');
const { CourseDetailPage } = require('../pages/CourseDetailPage');
const { CheckoutPage } = require('../pages/CheckoutPage');
const { ThankYouPage } = require('../pages/ThankYouPage');

/**
 * TC-E2E-02 (з ЛР1): User flow — Buy → Checkout → Thank you
 */
test.describe('TC-E2E-02: Purchase checkout flow', () => {
  test('visitor completes checkout after selecting a course', async ({ page }) => {
    const catalog = new CatalogPage(page);
    const detail = new CourseDetailPage(page);
    const checkout = new CheckoutPage(page);
    const thankYou = new ThankYouPage(page);

    await catalog.open();
    await catalog.openFirstCourse();
    await detail.waitForLoaded();

    const courseTitle = await detail.title.textContent();
    await detail.clickBuy();

    await expect(page).toHaveURL(/\/checkout/);
    await checkout.form.waitFor();

    await checkout.fillAndSubmit({
      email: 'student@example.com',
      phone: '0501234567',
      courseName: courseTitle || 'QA engineer',
      cardNumber: '4111111111111111',
    });

    await thankYou.expectVisible();
    await expect(thankYou.heading).toContainText(/thank you/i);
  });
});
