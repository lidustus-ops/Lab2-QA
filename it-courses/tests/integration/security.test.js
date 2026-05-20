const request = require('supertest');
const { createApp } = require('../../server/app');

/**
 * Вузькі інтеграційні тести безпеки (наявна перевірка id курсу в URL).
 */
describe('Security integration: course id validation', () => {
  let app;

  beforeEach(() => {
    app = createApp();
  });

  it('rejects non-numeric course id', async () => {
    const response = await request(app).get('/course/abc');
    expect(response.status).toBe(400);
    expect(response.text).toContain('Invalid course id');
  });

  it('rejects malicious course id payload', async () => {
    const response = await request(app).get('/course/1%3B%20DROP%20TABLE');
    expect(response.status).toBe(400);
  });
});
