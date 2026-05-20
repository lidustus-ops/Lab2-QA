const { BasePage } = require('./BasePage');

class CatalogPage extends BasePage {
  constructor(page) {
    super(page);
    this.technicalSection = page.locator('#technicalCourses');
    this.nonTechnicalSection = page.locator('#nonTechnicalCourses');
    this.courseCards = page.locator('.course-card');
  }

  async open() {
    await this.goto('/catalog');
    await this.page.waitForSelector('.course-card', { timeout: 15000 });
  }

  async openFirstCourse() {
    const firstCard = this.courseCards.first();
    await firstCard.click();
  }
}

module.exports = { CatalogPage };
