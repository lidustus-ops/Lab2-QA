const request = require('supertest');
const { createApp } = require('../../server/app');

describe('Express pages integration', () => {
  let app;

  beforeEach(() => {
    app = createApp();
  });

  it('GET / renders home page', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toContain('IT Courses');
  });

  it('GET /catalog renders catalog page', async () => {
    const response = await request(app).get('/catalog');
    expect(response.status).toBe(200);
    expect(response.text).toContain('IT Courses Catalog');
  });

  it('GET /course/:id renders course detail for valid id', async () => {
    const response = await request(app).get('/course/1');
    expect(response.status).toBe(200);
    expect(response.text).toContain('course-detail');
  });
});
