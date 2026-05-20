// @ts-check
const { test, expect } = require('@playwright/test');
const { CatalogPage } = require('../pages/CatalogPage');
const { CourseDetailPage } = require('../pages/CourseDetailPage');

/**
 * TC-E2E-01 (з ЛР1): User flow — перегляд каталогу та деталей курсу
 * Prerequisites: json-server + Express (webServer у playwright.config.js)
 */
test.describe('TC-E2E-01: Catalog browse to course detail', () => {
  test('visitor opens catalog and views course details', async ({ page }) => {
    const catalog = new CatalogPage(page);
    const detail = new CourseDetailPage(page);

    await catalog.open();

    const technicalCount = await catalog.technicalSection.locator('.course-card').count();
    const nonTechnicalCount = await catalog.nonTechnicalSection.locator('.course-card').count();

    expect(technicalCount).toBeGreaterThan(0);
    expect(nonTechnicalCount).toBeGreaterThan(0);

    await catalog.openFirstCourse();
    await expect(page).toHaveURL(/\/course\/\d+/);

    await detail.waitForLoaded();
    await expect(detail.title).not.toHaveText('Course Title');
    await expect(detail.price).toContainText('$');
  });
});
